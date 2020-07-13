import * as React from 'react'

import { Link } from 'components/link'

export interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout(props: AppLayoutProps) {
  const { children } = props

  return (
    <div className="AppLayout">
      <header>
        <strong>longform</strong>
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
