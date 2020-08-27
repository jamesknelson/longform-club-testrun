import * as React from 'react'
import { routeByPattern, routeLazy, routeNotFoundBoundary } from 'retil-router'

import {
  AppRequest,
  AppRouter,
  requireAuth,
  requireNoAuth,
} from 'utils/routing'

import Dashboard from './dashboard'
import Join from './join'
import Landing from './landing'
import Login from './login'
import NotFound from './notFound'
import onboardingRouter from './onboarding'
import settingsRouter from './settings'

const Legal = React.lazy(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return import('./legal')
})

const indexPatternRouter: AppRouter = routeByPattern({
  './': <Landing />,
  './dashboard': requireAuth(() => <Dashboard />),
  './join': requireNoAuth(() => <Join />, '/dashboard'),
  './legal': () => <Legal />,
  './login': requireNoAuth(
    () => <Login />,
    (request) => (request.query.redirectTo as string) || '/dashboard',
  ),
  './onboarding': requireAuth(() => onboardingRouter),
  './recover': routeLazy(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return import('./recoverAccount')
  }),
  './settings/*': requireAuth(settingsRouter),
})

const indexRouter = routeNotFoundBoundary(
  indexPatternRouter,
  (request: AppRequest) => <NotFound request={request} />,
)

export default indexRouter
