import * as React from 'react'

import { mount, requireAuth, requireNoAuth } from 'utils/routing'

import Dashboard from './dashboard'
import Join from './join'
import Landing from './landing'
import Legal from './legal'
import Login from './login'
import RecoverAccount from './recoverAccount'
import onboardingRouter from './onboarding'
import settingsRouter from './settings'

export default mount({
  './': <Landing />,
  './dashboard': requireAuth(<Dashboard />),
  './join': requireNoAuth(<Join />, '/dashboard'),
  './legal': <Legal />,
  './login': requireNoAuth(
    <Login />,
    (request) => (request.query.redirectTo as string) || '/dashboard',
  ),
  './onboarding': requireAuth(onboardingRouter),
  './recover': requireNoAuth(<RecoverAccount />, '/dashboard'),
  './settings': requireAuth(settingsRouter),
})
