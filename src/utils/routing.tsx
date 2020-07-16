import { PartialPath, Path, parsePath } from 'history'
import { ParsedUrlQuery, parse as parseQueryString } from 'querystring'
import * as React from 'react'

import Loading from '../routers/loading'

export type Router<T extends object, Request extends RequestBase> = (
  request: Request,
) => Route<T>

export interface RequestBase extends Path {
  unmatchedPathname: string
  params: { [name: string]: string | string[] }
  pathname: string
  query: ParsedUrlQuery
}

// TODO: can we just throw an exception for Redirect, along with NotFound?
// Then a router could be an async function and it'd just return a promise
// to a route.
export type Route<T extends object> = MatchRoute<T> | RedirectRoute | null

export type MatchRoute<T extends object> = {
  type: 'match'
  payload: T
}

export type RedirectRoute = {
  type: 'redirect'
  location: string | PartialPath
}

export type Handler<T extends object, Request extends RequestBase> =
  | Router<T, Request>
  | T

export function handleRequest<T extends object, Request extends RequestBase>(
  handler: Handler<T, Request>,
  request: Request,
): Route<T> {
  const router = isHandlerRouter(handler) ? handler : match(handler)
  return router(request)
}

export function isHandlerRouter<T extends object, Request extends RequestBase>(
  handler: Handler<T, Request>,
): handler is Router<T, Request> {
  return typeof handler === 'function'
}

export function normalizePath(path: Path): Path {
  let pathname = path.pathname

  if (pathname === '/' || pathname === '') {
    pathname = '/'
  } else {
    // Add leading slash
    pathname = pathname[0] !== '/' ? '/' + pathname : pathname

    // Strip trailing slash
    pathname =
      pathname[pathname.length - 1] === '/'
        ? pathname.slice(0, pathname.length - 1)
        : pathname
  }

  return path.pathname === pathname
    ? path
    : {
        ...path,
        pathname,
      }
}

export function getRouteMatchAndRedirect<T extends object, RequestExt>(
  router: Router<T, RequestBase & RequestExt>,
  path: Path,
  ext: RequestExt,
): [T | null, Path | null] {
  let redirectCount = 0
  let redirectPath: Path | null = null
  let route: Route<T>
  do {
    const currentPath: Path = redirectPath || path
    const normalizedPath = normalizePath(currentPath)
    if (normalizedPath !== currentPath) {
      route = {
        type: 'redirect',
        location: normalizedPath,
      }
    } else {
      const request = createRequestFromNormalizedPath(normalizedPath, ext)
      route = router(request)
    }

    if (route && route.type === 'redirect') {
      const redirectTo = route.location
      const redirectPartialPath =
        typeof redirectTo === 'string' ? parsePath(redirectTo) : redirectTo

      redirectCount++
      redirectPath = {
        pathname: redirectPartialPath.pathname ?? '',
        search: redirectPartialPath.search ?? '',
        hash: redirectPartialPath.hash ?? '',
      }

      if (redirectCount > 5) {
        throw new Error('Redirect loop detected')
      }
    }
  } while (route && route.type === 'redirect')
  return [route && route.payload, redirectPath]
}

export function createRequestFromNormalizedPath<RequestExt>(
  normalizedPath: Path,
  ext?: RequestExt,
): RequestBase & RequestExt {
  const query = parseQueryString(normalizedPath.search)
  return Object.assign(
    {
      ...normalizedPath,
      params: {},
      query,
      unmatchedPathname: normalizedPath.pathname,
    },
    ext,
  )
}

export function match<T extends object, Request extends RequestBase>(
  handler: Handler<T, Request>,
): Router<T, Request> {
  const router = isHandlerRouter(handler)
    ? handler
    : (_request: Request) =>
        ({
          type: 'match' as const,
          payload: handler,
        } as Route<T>)

  return (request: Request): Route<T> => {
    const isFullMatch = request.unmatchedPathname.length === 0
    return isFullMatch ? router(request) : null
  }
}

// TODO: matchAll, which matches even when there's unmatched pathname remaining

export interface MountHandlers<T extends object, Request extends RequestBase> {
  [pattern: string]: Handler<T, Request>
}

// TODO: dynamic routes support, wildcard support
export function mount<T extends object, Request extends RequestBase>(
  handlers: MountHandlers<T, Request>,
): Router<T, Request> {
  const patterns = new Map<string, Handler<T, Request>>()
  const paths = Object.keys(handlers).sort().reverse()
  for (const path of paths) {
    patterns.set(
      '/' + path.replace(/^\.?\/?/, '').replace(/\/?$/, ''),
      handlers[path],
    )
  }

  return (request: Request): Route<T> => {
    for (const [pattern, handler] of Array.from(patterns.entries())) {
      if (request.unmatchedPathname.slice(0, pattern.length) === pattern) {
        return handleRequest(handler, {
          ...request,
          unmatchedPathname: request.unmatchedPathname.slice(pattern.length),
        })
      }
    }

    return null
  }
}

export function redirect<Request extends RequestBase>(
  location: string | PartialPath | ((request: Request) => string | PartialPath),
): Router<any, Request> {
  return (request: Request): Route<any> => ({
    type: 'redirect',
    location: typeof location === 'function' ? location(request) : location,
  })
}

export interface AppRequest extends RequestBase {
  currentUser: any
}

export function switchAuth<
  T extends object,
  Request extends AppRequest
>(handlers: {
  authenticated: Handler<T, Request>
  pending: Handler<T, Request>
  unauthenticated: Handler<T, Request>
}): Router<T, Request> {
  return (request: Request): Route<T> =>
    handleRequest(
      request.currentUser === undefined
        ? handlers.pending
        : request.currentUser
        ? handlers.authenticated
        : handlers.unauthenticated,
      request,
    )
}

export function requireAuth<T extends object, Request extends AppRequest>(
  authenticatedHandler: Handler<T, Request>,
  pendingHandler: Handler<T | React.ReactElement, Request> = <Loading />,
): Router<T | React.ReactElement, Request> {
  return switchAuth<T | React.ReactElement, Request>({
    authenticated: authenticatedHandler,
    pending: pendingHandler,
    unauthenticated: redirect(
      (request) =>
        '/login?redirectTo=' + encodeURIComponent(convertPathToURL(request)),
    ),
  })
}

export function requireNoAuth<T extends object, Request extends AppRequest>(
  unauthenticatedHandler: Handler<T, Request>,
  redirectLocation:
    | string
    | PartialPath
    | ((request: Request) => string | PartialPath),
  pendingHandler: Handler<T | React.ReactElement, Request> = <Loading />,
): Router<T | React.ReactElement, Request> {
  return switchAuth<T | React.ReactElement, Request>({
    authenticated: redirect(redirectLocation),
    pending: pendingHandler,
    unauthenticated: unauthenticatedHandler,
  })
}

function convertPathToURL(path: Path): string {
  return path.pathname + path.search + path.hash
}
