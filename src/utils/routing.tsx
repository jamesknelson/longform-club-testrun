import * as React from 'react'

import {
  RouterFunction,
  RouterDelta,
  RouterRequest,
  RouterResponse,
  createHref,
  createRedirectRouter,
} from './router'

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
    unauthenticated: createRedirectRouter(
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
    | RouterDelta
    | ((request: AppRequest) => string | RouterDelta),
  pendingHandler: AppRouter = loadingScreenRouter,
) {
  return switchAuth({
    authenticated: createRedirectRouter(redirectLocation),
    pending: pendingHandler,
    unauthenticated: unauthenticatedHandler,
  })
}
