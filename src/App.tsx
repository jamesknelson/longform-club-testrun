import * as React from 'react'
import { Suspense } from 'react'
import {
  Router,
  RouterContent,
  createRequestService,
  useRouterPending,
} from 'retil-router'

import './backend'
// import { DBUser, db } from './backend'
import { AppLayout } from './components/appLayout'
import { AuthProvider } from './hooks/useFirebaseAuth'
import indexRouter from './routers'
import { createFirebaseAuthService } from './services/firebaseAuthService'

// const users = db.collection('users')

const [authSource, authController] = createFirebaseAuthService()

const requestService = createRequestService({
  extend: (_, use) => {
    const { user } = use(authSource, { user: undefined })
    return {
      currentUser: user,
    }
  },
})

function App() {
  return (
    <Router fn={indexRouter} requestService={requestService}>
      <AuthProvider source={authSource} controller={authController}>
        <AppLayout>
          <Suspense fallback={<AppSpinner />}>
            <RouterContent />
          </Suspense>
        </AppLayout>
        <AppRouteLoadingIndicator />
      </AuthProvider>
    </Router>
  )
}

function AppRouteLoadingIndicator(props: { active?: boolean }) {
  const pending = useRouterPending()
  return pending ? <div className="AppRouteLoadingIndicator" /> : null
}

function AppSpinner() {
  return <div className="AppSpinner" />
}

export default App
