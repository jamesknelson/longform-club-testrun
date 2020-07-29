import * as React from 'react'

import { createRouter, createLazyRouter } from 'utils/router'
import { AppRouter, requireAuth, requireNoAuth } from 'utils/routing'

import Dashboard from './dashboard'
import Join from './join'
import Landing from './landing'
import Login from './login'
import onboardingRouter from './onboarding'
import settingsRouter from './settings'

const Legal = React.lazy(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return import('./legal')
})

const indexRouter: AppRouter = createRouter({
  './': <Landing />,
  './dashboard': requireAuth(() => <Dashboard />),
  './join': requireNoAuth(() => <Join />, '/dashboard'),
  './legal': () => <Legal />,
  './login': requireNoAuth(
    () => <Login />,
    (request) => (request.query.redirectTo as string) || '/dashboard',
  ),
  './onboarding': requireAuth(() => onboardingRouter),
  './recover': createLazyRouter(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return import('./recoverAccount')
  }),
  './settings/*': requireAuth(settingsRouter),
})

export default indexRouter
