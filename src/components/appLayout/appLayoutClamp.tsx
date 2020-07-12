import * as React from 'react'
import { css } from 'styled-components/macro'

export interface AppLayoutClampProps {
  children: React.ReactNode
}

export function AppLayoutClamp(props: AppLayoutClampProps) {
  const { children } = props

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: stretch;
        margin: 0 1rem;
        max-width: 740px;
        width: 100%;
      `}>
      {children}
    </div>
  )
}
