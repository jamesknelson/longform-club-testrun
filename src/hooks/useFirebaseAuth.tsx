import * as React from 'react'
import { createContext, useContext } from 'react'
import { useSource } from 'use-source'

import {
  FirebaseAuthController,
  FirebaseAuthSnapshot,
  FirebaseAuthSource,
} from '../services/firebaseAuthService'

const AuthSourceContext = createContext<FirebaseAuthSource>(null as any)
const AuthControllerContext = createContext<FirebaseAuthController>(null as any)

export interface AuthProviderProps {
  children: React.ReactNode
  source: FirebaseAuthSource
  controller: FirebaseAuthController
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

export function useAuthController(): FirebaseAuthController {
  return useContext(AuthControllerContext)
}

export function useAuthSnapshot<User = any, DefaultSnapshot = User>(
  options: {
    defaultValue?: DefaultSnapshot
  } = {},
): FirebaseAuthSnapshot | DefaultSnapshot {
  const source = useContext(AuthSourceContext)
  const useSourceOptions = {} as {
    defaultValue?: readonly [DefaultSnapshot, boolean]
  }
  if (options.defaultValue) {
    useSourceOptions.defaultValue = [options.defaultValue, true] as const
  }
  const snapshot = useSource(source, useSourceOptions)
  return snapshot as FirebaseAuthSnapshot | DefaultSnapshot
}

export function useCurrentUser<User = any, DefaultUser = User>(
  options: {
    defaultValue?: DefaultUser
  } = {},
): User | DefaultUser | null {
  const snapshotOptions =
    'defaultValue' in options
      ? { defaultValue: { user: options.defaultValue } }
      : {}
  const snapshot = useAuthSnapshot(snapshotOptions) as FirebaseAuthSnapshot
  return (snapshot as any).user
}
