import { Location } from 'history'
import { createContext } from 'react'

export interface NavigationContext {
  location: Location
  navigate: (href: string) => void
}

export const NavigationContext = createContext(
  (undefined as any) as NavigationContext,
)
