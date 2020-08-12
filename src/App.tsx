import * as React from 'react'
import { Suspense, useCallback } from 'react'
import {
  Content,
  NotFoundBoundary,
  Router,
  RoutingProvider,
  usePendingRequest,
} from 'react-routing-library'
import { control, observe, useSource } from 'retil'

import { DBUser, db } from './backend'
import { AppLayout } from './components/appLayout'
import { DataService, createFirebaseAuthService } from './hooks/useFirebaseAuth'
import indexRouter from './routers'

export interface AuthLoggedInUser {
  id: string
  email: string | null
  emailVefiried: boolean
  displayName: string | null
  photoURL: string | null
  // hasActiveSubscription: boolean
}

export type AuthUser = undefined | null | AuthLoggedInUser

// Users contains private data
const users = db.collection('users')

const [authSource] = createFirebaseAuthService({
  buildUser: (firebaseUser, data: DBUser) => ({
    anonymous: firebaseUser.isAnonymous,
    data,
    email: firebaseUser.email,
    emailVefiried: firebaseUser.emailVerified,
    displayName: firebaseUser.displayName,
    id: firebaseUser.uid,
    photoURL: firebaseUser.photoURL,
  }),
  getDataService: (firebaseUser) => {
    const doc = users.doc(firebaseUser.uid)
    const source = observe<firebase.firestore.DocumentSnapshot<DBUser>>(
      (controller) => doc.onSnapshot(controller),
    )
    return control(source, (act) => async (merge: Partial<DBUser>): Promise<
      void
    > => {
      act(() => doc.set(merge, { merge: true }))
    })
  },
})

function App() {
  // TODO: how do we access auth state/controller from children?
  // the name `useAuth` is already taken... maybe create separate
  // `useCurrentUser` and `useAuthController` functions?

  const { currentUser } = useSource(authSource, { currentUser: undefined })

  console.log('currentUser', currentUser)

  const appRouter = useCallback<Router>(
    (request, response) => {
      const appRequest = { ...request, currentUser }
      return indexRouter(appRequest, response)
    },
    [currentUser],
  )

  return (
    <RoutingProvider router={appRouter} unstable_concurrentMode>
      <AppLayout>
        <Suspense fallback={<AppSpinner />}>
          <NotFoundBoundary renderError={() => <AppNotFoundMessage />}>
            <Content />
          </NotFoundBoundary>
        </Suspense>
      </AppLayout>
      <AppRouteLoadingIndicator />
    </RoutingProvider>
  )
}

function AppNotFoundMessage() {
  return (
    <div className="AppNotFoundMessage">
      <h1>Not Found -- Sorry!</h1>
    </div>
  )
}

function AppRouteLoadingIndicator() {
  const pendingRequest = usePendingRequest()
  return pendingRequest ? <div className="AppRouteLoadingIndicator" /> : null
}

function AppSpinner() {
  return <div className="AppSpinner" />
}

export default App
