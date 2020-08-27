import * as React from 'react'
import { Suspense, useCallback } from 'react'
import { RouterProvider, useRouter, RouterRequest } from 'retil-router'
import { useSource } from 'use-source'

import { AuthProvider } from './auth'
import { DBUser, db } from './backend'
import { AppLayout } from './components/appLayout'
import {
  createFirebaseAuthService,
  createFirestoreUserDataService,
} from './hooks/useFirebaseAuth'
import indexRouter from './routers'

const users = db.collection('users')

const [authSource, authController] = createFirebaseAuthService({
  buildUser: (firebaseUser, data: DBUser) =>
    firebaseUser.isAnonymous
      ? null
      : {
          data,
          email: firebaseUser.email,
          emailVefiried: firebaseUser.emailVerified,
          displayName: firebaseUser.displayName,
          id: firebaseUser.uid,
          photoURL: firebaseUser.photoURL,
        },

  getDataService: (uid) => createFirestoreUserDataService(users, uid),
})

function App() {
  const { currentUser } = useSource(authSource, {
    defaultValue: {
      currentUser: undefined,
    },
  })

  const transformRequest = useCallback(
    (request: RouterRequest<any>) => ({
      ...request,
      currentUser,
    }),
    [currentUser],
  )

  const route = useRouter(indexRouter, {
    transformRequest,
  })

  return (
    <AuthProvider source={authSource} controller={authController}>
      <RouterProvider value={route}>
        <AppLayout>
          <Suspense fallback={<AppSpinner />}>{route.content}</Suspense>
        </AppLayout>
        <AppRouteLoadingIndicator active={route.pending} />
      </RouterProvider>
    </AuthProvider>
  )
}

function AppRouteLoadingIndicator(props: { active?: boolean }) {
  return props.active ? <div className="AppRouteLoadingIndicator" /> : null
}

function AppSpinner() {
  return <div className="AppSpinner" />
}

export default App
