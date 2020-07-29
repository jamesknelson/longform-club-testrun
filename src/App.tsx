import * as React from 'react'
import { Suspense, useCallback, useState } from 'react'

import { AppLayout } from 'components/appLayout'

import {
  Router,
  RouterContent,
  RouterFunction,
  usePendingRequest,
} from 'utils/router'

import indexRouter from './routers'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  const appRouter = useCallback<RouterFunction>(
    (request, response) =>
      indexRouter(
        {
          ...request,
          currentUser,
        },
        response,
      ),
    [currentUser],
  )

  return (
    <Router router={appRouter} unstable_concurrentMode>
      <AppLayout>
        <Suspense fallback={null}>
          <RouterContent />
        </Suspense>
      </AppLayout>
      <AppRouteLoadingIndicator />
    </Router>
  )
}

function AppRouteLoadingIndicator() {
  const pendingRequest = usePendingRequest()
  return pendingRequest ? <div className="AppRouteLoadingIndicator" /> : null
}

export default App
