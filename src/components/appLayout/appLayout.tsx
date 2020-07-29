import * as React from 'react'

import { Link } from 'utils/router'

export interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout(props: AppLayoutProps) {
  const { children } = props

  return (
    <div className="AppLayout">
      <header>
        <Link href="/">
          <strong>longform</strong>
        </Link>
        <nav>
          <Link href="/settings">settings</Link>{' '}
          <Link href="/login">sign in</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        Build longform yourself. Learn how with&nbsp;
        <Link href="/legal">React ＋ Bacon</Link>
        &nbsp;&middot;&nbsp;
        <Link href="/legal">Legal</Link>
      </footer>
    </div>
  )
}
