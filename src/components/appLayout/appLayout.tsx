import * as React from 'react'
import { Link } from 'react-routing-library'

export interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout(props: AppLayoutProps) {
  const { children } = props

  return (
    <div className="AppLayout">
      <header>
        <Link to="/">
          <strong>longform</strong>
        </Link>
        <nav>
          <Link to="/settings">settings</Link>{' '}
          <Link to="/login">sign in</Link>
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
