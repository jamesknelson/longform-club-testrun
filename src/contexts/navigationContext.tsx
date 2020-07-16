import { Path } from 'history'
import { createContext } from 'react'

export interface NavigationContext {
  location: Path
  navigate: (href: string) => void
}

export const NavigationContext = createContext(
  (undefined as any) as NavigationContext,
)
