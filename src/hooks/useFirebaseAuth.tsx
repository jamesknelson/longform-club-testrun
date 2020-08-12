import firebase from 'firebase/app'
import memoizeOne from 'memoize-one'
import * as React from 'react'
import { createContext, useContext, useMemo } from 'react'
import {
  Source,
  createStateService,
  fuse,
  observe,
  useSource,
  wait,
} from 'retil'

import { Issues } from 'utils/issues'

export interface AuthProfileUpdate {
  displayName?: string | null
  photoURL?: string | null
}

export type AuthService<
  User,
  UserData,
  Token = any,
  AuthProvider = any
> = readonly [AuthSource<User, UserData>, AuthController<Token, AuthProvider>]

export interface AuthSnapshot<User, UserData = any> {
  currentUser: User
  data: DataSnapshot<UserData>
  providerUser: firebase.User | null
}

export type AuthSource<User, UserData = any> = Source<
  AuthSnapshot<User, UserData>
>

export interface AuthController<Token, AuthProvider> {
  // TODO:
  // - updatePassword
  //   * if no password, e.g. due to signing in with facebook,
  //     auth.currentUser.linkWithCredential(firebase.auth.EmailAuthProvider.credential(auth.currentUser.email, 'password'))
  // - updateEmail
  // - unlink(providerId)
  // - reauthenticateWithEmailAndPassword
  //   auth.currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(auth.currentUser.email, 'password'))
  // - reauthenticateWithRedirect
  // - verify email / verify reset password (checkActionCode)
  // - how to list known providers?

  // createUserWithEmailAndPassword(data: {
  //   name: string
  //   email: string
  //   password: string
  // }): Promise<null | Issues>

  // delete(): Promise<null | Issues>

  // // doesn't update state
  // getIdToken(forceRefresh?: boolean): Promise<Token>

  // // doesn't update state
  // // https://firebase.google.com/docs/auth/web/account-linking
  // linkWithRedirect(provider: AuthProvider): Promise<null | Issues>

  // updateProfile(data: AuthProfileUpdate): Promise<null | Issues>

  // // doesn't update state
  // sendEmailVerification(options?: { url: string }): Promise<void>

  // // doesn't update state
  // sendPasswordResetEmail(
  //   email: string,
  //   options?: {
  //     url: string
  //   },
  // ): Promise<null | Issues>

  signInWithEmailAndPassword(data: {
    email: string
    password: string
  }): Promise<null | Issues>

  // // doesn't update state (actually)
  // signInWithRedirect(provider: AuthProvider): void

  // signOut(): void
}

export interface FirebaseAuthController
  extends AuthController<
    firebase.auth.IdTokenResult,
    firebase.auth.AuthProvider
  > {}

export type DataSnapshot<T> = { data: () => T | undefined; exists: boolean }
export type DataUpdater<T> = (merge: Partial<T>) => Promise<void>
export type DataService<T> = readonly [Source<DataSnapshot<T>>, DataUpdater<T>]

export interface FirebaseAuthServiceOptions<User, UserData> {
  auth?: firebase.auth.Auth

  buildUser: (firebaseUser: firebase.User, data: UserData) => User

  getDataService: (firebaseUser: firebase.User) => DataService<UserData>

  languageCode?: null | string

  mergeProviderData?: (
    providerData: any,
    existingDataSnapshot?: { data: UserData; hasData: boolean },
  ) => UserData

  // Useful for telemetry.
  onSignIn?: (user: User) => void
  onSignUp?: (user: User) => void
  onSignOut?: (user: User) => void
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
): [Source<AuthSnapshot<User, UserData>>, FirebaseAuthController] {
  const {
    auth = firebase.auth(),
    buildUser,
    getDataService,
    languageCode,
    mergeProviderData,

    onSignIn,
    onSignUp,
    onSignOut,
  } = options

  const [userVersionSource, setUserVersion] = createStateService(1)
  const incrementUserVersion = () => setUserVersion((version) => version + 1)
  const rawFirebaseUserSource = observe<firebase.User | null>((controller) =>
    auth.onAuthStateChanged(controller),
  )
  const firebaseUserSource = fuse((use) => {
    use(userVersionSource)
    const user = use(rawFirebaseUserSource)
    return user && { ...user }
  })
  const actOnFirebaseUser = firebaseUserSource[2]
  const updateProfile = (authProfileUpdate: AuthProfileUpdate) =>
    actOnFirebaseUser(async () => {
      incrementUserVersion()
      await auth.currentUser!.updateProfile(authProfileUpdate)
    })

  const memoizedGetDataService = memoizeOne(getDataService)

  const authSource = fuse<AuthSnapshot<User, UserData>>((use, act) => {
    const firebaseUser = use(firebaseUserSource)

    if (firebaseUser === null) {
      throw act(async () => {
        const { user: firebaseUser } = await auth.signInAnonymously()
        await wait(firebaseUserSource, (x) => x !== firebaseUser)
      })
    }

    const [dataSource, update] = memoizedGetDataService(firebaseUser)
    const data = use(dataSource)

    const isUserMissingData = data && !data.exists
    if (isUserMissingData) {
      throw act(async () => {
        // TODO: call `mergeProviderData`
        await update({ anonymous: true } as any)
        await wait(dataSource, (x) => x !== data)
      })
    }

    return {
      currentUser: buildUser(firebaseUser, data.data()!),
      data,
      providerUser: firebaseUser,
    }
  })

  const actOnAuth = authSource[2]

  const authController: FirebaseAuthController = {
    // async createUserWithEmailAndPassword(params): Promise<null | Issues> {
    //   try {
    //     // Note: ideally this would all take place on the server in a function
    //     // so that if the app closes halfway through creating a user, we don't
    //     // end up with an inconsistent state.
    //     const userCredential = await auth.createUserWithEmailAndPassword(
    //       params.email,
    //       params.password,
    //     )
    //     const user = userCredential.user!
    //     await Promise.all([
    //       user.sendEmailVerification(),
    //       user.updateProfile({
    //         displayName: params.name,
    //       }),
    //       users.doc(user.uid).set({}, { merge: true }),
    //     ])

    //     creatingUserRef.current = false

    //     return null
    //   } catch (error) {
    //     return {
    //       base: error.message,
    //     }
    //   }
    // },

    async signInWithEmailAndPassword(params): Promise<null | Issues> {
      try {
        await auth.signInWithEmailAndPassword(params.email, params.password)
        return null
      } catch (error) {
        return {
          base: error.message,
        }
      }
    },

    // signOut(): void {
    //   auth.signOut()
    //   setState({ dbUser: null, firebaseAuthUser: null })
    // },
  }

  return [authSource, authController]
}

const AuthSourceContext = createContext<AuthSource<any, any>>(null as any)
const AuthControllerContext = createContext<AuthController<any, any>>(
  null as any,
)

export interface AuthProviderProps {
  children: React.ReactNode
  service: AuthService<any, any>
}

export function AuthProvider({
  children,
  service: [source, controller],
}: AuthProviderProps) {
  return (
    <AuthSourceContext.Provider value={source}>
      <AuthControllerContext.Provider value={controller}>
        {children}
      </AuthControllerContext.Provider>
    </AuthSourceContext.Provider>
  )
}

export function useAuthController<
  Token = any,
  AuthProvider = any
>(): AuthController<Token, AuthProvider> {
  return useContext(AuthControllerContext)
}

export function useAuthSnapshot<User, UserData, DefaultSnapshot = User>(
  defaultSnapshot?: DefaultSnapshot,
): AuthSnapshot<User, UserData> | DefaultSnapshot {
  const hasDefaultUser = arguments.length > 0
  const source = useContext(AuthSourceContext)
  const snapshot = useSource.apply(
    null,
    hasDefaultUser ? [source, defaultSnapshot!] : [source],
  )
  return snapshot as AuthSnapshot<User, UserData> | DefaultSnapshot
}

export function useAuthSource<User = any, UserData = any>(): AuthSource<
  User,
  UserData
> {
  return useContext(AuthSourceContext)
}

export function useCurrentUser<User, DefaultUser = User>(
  defaultUser?: DefaultUser,
): User | DefaultUser {
  const hasDefaultUser = arguments.length > 0
  const snapshot = useAuthSnapshot.apply(
    null,
    hasDefaultUser ? [{ currentUser: defaultUser! }] : [],
  ) as AuthSnapshot<User | DefaultUser>
  return snapshot.currentUser
}

// export function createFirebaseAuth<User, UserData>() {
//   return {
//     AuthProvider: AuthProvider as (
//       props: FirebaseAuthServiceOptions<User, UserData>,
//     ) => JSX.Element,
//     useAuthController: useAuthController as () => FirebaseAuthController,
//     useAuthSource: useAuthSource as () => AuthSource<User, UserData>,
//     useAuthSnapshot: useAuthSnapshot as <DefaultUser>(
//       defaultUser?: DefaultUser,
//     ) => AuthSnapshot<User | DefaultUser, UserData>,
//     useCurrentUser: useCurrentUser as <DefaultUser>(
//       defaultUser?: DefaultUser,
//     ) => User | DefaultUser,
//   }
// }
