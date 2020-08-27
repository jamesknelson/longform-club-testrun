import * as React from 'react'
import { createContext, useContext } from 'react'
import { Source } from 'retil-source'
import { useSource } from 'use-source'

import { Issues } from './utils/issues'

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

export interface AuthSnapshot<User, UserData = any, ProviderUser = any> {
  busy: boolean
  currentUser: User | null
  data: AuthUserDataSnapshot<UserData> | null
  providerUser: ProviderUser | null
}

export type AuthSource<User, UserData = any> = Source<
  AuthSnapshot<User, UserData>
>

export type AuthUserDataSnapshot<T> = {
  data: () => T | undefined
  exists: boolean
}
export type AuthUserDataUpdater<T> = (merge: Partial<T>) => Promise<void>
export type AuthUserDataService<T> = readonly [
  Source<AuthUserDataSnapshot<T>>,
  AuthUserDataUpdater<T>,
]

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

  createUserWithEmailAndPassword(data: {
    name: string
    email: string
    password: string
  }): Promise<null | Issues>

  // delete(): Promise<null | Issues>

  // // doesn't update state
  // getIdToken(forceRefresh?: boolean): Promise<Token>

  // // doesn't update state
  // // https://firebase.google.com/docs/auth/web/account-linking
  // linkWithRedirect(provider: AuthProvider): Promise<null | Issues>

  updateProfile(data: AuthProfileUpdate): Promise<null | Issues>

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

  signInWithRedirect(provider: AuthProvider): void

  signOut(): void
}

const AuthSourceContext = createContext<AuthSource<any, any>>(null as any)
const AuthControllerContext = createContext<AuthController<any, any>>(
  null as any,
)

export interface AuthProviderProps {
  children: React.ReactNode
  source: AuthSource<any, any>
  controller: AuthController<any, any>
}

export function AuthProvider({
  children,
  source,
  controller,
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
  options: {
    defaultValue?: DefaultSnapshot
  } = {},
): AuthSnapshot<User, UserData> | DefaultSnapshot {
  const source = useContext(AuthSourceContext)
  const snapshot = useSource(source, options)
  return snapshot as AuthSnapshot<User, UserData> | DefaultSnapshot
}

export function useAuthSource<User = any, UserData = any>(): AuthSource<
  User,
  UserData
> {
  return useContext(AuthSourceContext)
}

export function useCurrentUser<User, DefaultUser = User>(
  options: {
    defaultValue?: DefaultUser
  } = {},
): User | DefaultUser | null {
  const snapshotOptions =
    'defaultValue' in options
      ? { defaultValue: { currentUser: options.defaultValue } }
      : {}
  const snapshot = useAuthSnapshot(snapshotOptions) as AuthSnapshot<
    User | DefaultUser
  >
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
