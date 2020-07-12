import * as React from 'react'
import { css } from 'styled-components/macro'

import { colors } from 'theme'

export interface ButtonBodyProps {
  children: React.ReactNode
}

export function ButtonBody(props: ButtonBodyProps) {
  const { children } = props

  return (
    <span
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;

        background-color: ${colors.primary};
        border: 0;
        border-radius: 99px;
        color: white;
        font-family: Roboto, sans-serif;
        font-size: 16px;
        padding: 0.75rem 1.5rem;
      `}>
      {children}
    </span>
  )
}
