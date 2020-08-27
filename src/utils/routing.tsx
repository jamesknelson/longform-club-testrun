import * as React from 'react'
import {
  RouterAction,
  RouterFunction,
  RouterRequest,
  RouterResponse,
  createHref,
  routeRedirect,
} from 'retil-router'

import Loading from '../routers/loading'

export interface AppRequest extends RouterRequest {
  currentUser: any
}

export type AppRouter = RouterFunction<AppRequest>

export const loadingScreenRouter = () => <Loading />

export function switchAuth(routers: {
  authenticated: AppRouter
  pending: AppRouter
  unauthenticated: AppRouter
}): AppRouter {
  return (request, response) =>
    (request.currentUser === undefined
      ? routers.pending
      : request.currentUser
      ? routers.authenticated
      : routers.unauthenticated)(request, response)
}

export function requireAuth(
  authenticatedRouter: AppRouter,
  pendingRouter: AppRouter = loadingScreenRouter,
) {
  return switchAuth({
    authenticated: authenticatedRouter,
    pending: pendingRouter,
    unauthenticated: routeRedirect(
      (request) =>
        '/login?redirectTo=' + encodeURIComponent(createHref(request)),
    ),
  })
}

export function requireNoAuth<
  Request extends AppRequest,
  UnauthenticatedResponse extends RouterResponse,
  PendingResponse extends RouterResponse
>(
  unauthenticatedHandler: AppRouter,
  redirectLocation:
    | string
    | RouterAction<any>
    | ((request: AppRequest) => string | RouterAction<any>),
  pendingHandler: AppRouter = loadingScreenRouter,
) {
  return switchAuth({
    authenticated: routeRedirect(redirectLocation),
    pending: pendingHandler,
    unauthenticated: unauthenticatedHandler,
  })
}
