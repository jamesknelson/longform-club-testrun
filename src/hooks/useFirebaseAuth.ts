import firebase from 'firebase/app'
import { useMemo } from 'react'
import { Source, act, createState, fuse, observe, wait } from 'retil-source'
import { createMemo } from 'retil-support'

import {
  AuthController,
  AuthProfileUpdate,
  AuthSnapshot,
  AuthUserDataService,
} from '../auth'

export interface FirebaseAuthController
  extends AuthController<
    firebase.auth.IdTokenResult,
    firebase.auth.AuthProvider
  > {}

export interface FirebaseAuthServiceOptions<User, UserData> {
  auth?: firebase.auth.Auth

  buildUser: (firebaseUser: firebase.User, data: UserData) => User

  getDataService: (uid: string) => AuthUserDataService<UserData>

  languageCode?: null | string

  mergeProviderData?: (
    providerData: any,
    existingDataSnapshot?: { data: UserData; hasData: boolean },
  ) => UserData

  // Useful for telemetry.
  onSignInAttempt?: (user: User) => void
  onSignInSuccess?: (user: User) => void
  onSignInFailure?: (user: User) => void

  onSignUpAttempt?: (user: User) => void
  onSignUpSuccess?: (user: User) => void
  onSignUpFailure?: (user: User) => void

  onSignOut?: (user: User) => void
}

export function createFirestoreUserDataService<T>(
  collection: firebase.firestore.CollectionReference<T>,
  uid: string,
) {
  const doc = collection.doc(uid)
  const source = observe<firebase.firestore.DocumentSnapshot<T>>(
    (onNext, onError) =>
      doc.onSnapshot(onNext, (error) => {
        const auth = firebase.auth()
        if (auth.currentUser && auth.currentUser.uid === uid) {
          onError(error)
        }
      }),
  )
  return [
    source,
    (merge: Partial<T>) =>
      act(source, async () => {
        await doc.set(merge, { merge: true })
      }),
  ] as const
}

export function useFirebaseAuthService<User, UserData>(
  options: FirebaseAuthServiceOptions<User, UserData>,
) {
  return useMemo(
    () => createFirebaseAuthService(options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.keys(options),
  )
}

export function createFirebaseAuthService<User, UserData>(
  options: FirebaseAuthServiceOptions<User, UserData>,
): [
  Source<AuthSnapshot<User, UserData, firebase.User>>,
  FirebaseAuthController,
] {
  const {
    auth = firebase.auth(),
    buildUser,
    getDataService,
    languageCode = null,
    mergeProviderData,
  } = options

  auth.languageCode = languageCode

  const [userVersionSource, setUserVersion] = createState(1)
  const incrementUserVersion = () => setUserVersion((version) => version + 1)
  const rawFirebaseUserSource = observe<firebase.User | null>((controller) =>
    auth.onAuthStateChanged(controller),
  )

  const firebaseUserSource = fuse((use) => {
    use(userVersionSource)
    const user = use(rawFirebaseUserSource)
    return user && { ...user }
  })

  const updateProfile = (authProfileUpdate: AuthProfileUpdate) =>
    act(firebaseUserSource, async () => {
      try {
        incrementUserVersion()
        await auth.currentUser!.updateProfile(authProfileUpdate)
        return null
      } catch (error) {
        return { base: error.message }
      }
    })

  const dataServiceMemo = createMemo()

  const authSource = fuse<Omit<AuthSnapshot<User, UserData>, 'busy'>>(
    (use, effect) => {
      const firebaseUser = use(firebaseUserSource)

      // TODO: try getRedirectResult() and merge data if it works.

      if (firebaseUser === null) {
        effect(async () => {
          const { user: firebaseUser } = await auth.signInAnonymously()
          await wait(firebaseUserSource, (x) => x !== firebaseUser)
        })
        return {
          currentUser: null,
          data: null,
          providerUser: null,
        }
      } else {
        const [dataSource, update] = dataServiceMemo(
          () => getDataService(firebaseUser.uid),
          [firebaseUser.uid],
        )
        const dataSnapshot = use(dataSource)
        const isUserMissingData = dataSnapshot && !dataSnapshot.exists
        if (firebaseUser && isUserMissingData) {
          return effect(async () => {
            // TODO: call `mergeProviderData`
            await update({})
            await wait(dataSource, (x) => x !== dataSnapshot)
          })
        }

        return {
          currentUser: buildUser(firebaseUser, dataSnapshot.data()!),
          data: dataSnapshot,
          providerUser: firebaseUser,
        }
      }
    },
  )

  const authController: FirebaseAuthController = {
    createUserWithEmailAndPassword: (params) =>
      act(authSource, async () => {
        // TODO: if we have an anonymous user, then instead of using create user,
        // we instead want to link a username/password credential to the existing
        // user.
        try {
          // Note: ideally this would all take place on the server in a function
          // so that if the app closes halfway through creating a user, we don't
          // end up with an inconsistent state.
          const userCredential = await auth.createUserWithEmailAndPassword(
            params.email,
            params.password,
          )
          const user = userCredential.user!
          const [, update] = dataServiceMemo(() => getDataService(user.uid), [
            user.uid,
          ])
          await Promise.all([
            updateProfile({
              displayName: params.name,
            }),
            // TODO: call `mergeProviderData`
            update({}),
          ])

          user.sendEmailVerification()

          return null
        } catch (error) {
          return {
            base: error.message,
          }
        }
      }),

    signInWithEmailAndPassword: (params) =>
      act(authSource, async () => {
        try {
          await auth.signInWithEmailAndPassword(params.email, params.password)
          return null
        } catch (error) {
          return {
            base: error.message,
          }
        }
      }),

    signInWithRedirect(provider) {
      auth.signInWithRedirect(provider)
    },

    signOut: () => {
      // Don't wrap with act, as we want to see the intermediate states.
      return auth.signOut()
    },

    updateProfile,
  }

  return [
    addBusyFlag(authSource, (snapshot, busy) => ({ ...snapshot, busy })),
    authController,
  ]
}

const missingFlag = Symbol('missing')

export function addBusyFlag<T, U>(
  source: Source<T>,
  build: (snapshot: T, flag: boolean) => U,
): Source<U> {
  let fallback: [T] | [] = []
  return fuse((use) => {
    const value = use(source, ...fallback)
    const valueOrFlag = use(source, missingFlag)
    fallback = [value]
    return build(value, valueOrFlag === missingFlag)
  })
}
