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

        box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2),
          1px 1px 1px rgba(255, 255, 255, 0.12) inset,
          -1px -1px 1px rgba(0, 0, 0, 0.08) inset;
        :active {
          box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.08),
            -1px -1px 1px rgba(255, 255, 255, 0.2) inset,
            1px 1px 1px rgba(0, 0, 0, 0.1) inset;
        }

        background-color: ${colors.primary};
        border: 0;
        border-radius: 99px;
        color: white;
        font-family: Roboto, sans-serif;
        font-size: 14px;
        line-height: 1em;
        padding: 0.66rem 1.5rem;
        text-transform: uppercase;

        transition: box-shadow 150ms ease-out;
      `}>
      {children}
    </span>
  )
}
