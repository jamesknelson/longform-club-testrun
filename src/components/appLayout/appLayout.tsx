import * as React from 'react'
import { Link } from 'retil-router'

import { useAuthController, useCurrentUser } from 'hooks/useFirebaseAuth'

export interface AppLayoutProps {
  children: React.ReactNode
}

export const LoadingUser = { loading: true }

export function AppLayout(props: AppLayoutProps) {
  const { children } = props
  const { signOut } = useAuthController()
  const currentUser = useCurrentUser({ defaultValue: LoadingUser })

  return (
    <div className="AppLayout">
      <header>
        <Link to="/">
          <strong>longform</strong>
        </Link>
        <nav>
          {currentUser !== LoadingUser &&
            (currentUser && !currentUser.isAnonymous ? (
              <>
                <Link to="/settings">settings</Link> &nbsp;
                <button onClick={signOut}>logout</button>
              </>
            ) : (
              <>
                <Link to="/login">sign in</Link>
                &nbsp;
                <Link to="/join">join</Link>{' '}
              </>
            ))}
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        Build longform yourself. Learn how with&nbsp;
        <Link to="/legal">React ＋ Bacon</Link>
        &nbsp;&middot;&nbsp;
        <Link to="/legal">Legal</Link>
      </footer>
    </div>
  )
}
