import * as React from 'react'
import { css } from 'styled-components/macro'

import { UnstyledLinkControl } from 'components/link'

import { colors, shadows } from 'theme'

export interface AppLayoutProps {
  children: React.ReactNode
  title: string
}

export function AuthLayout(props: AppLayoutProps) {
  const { children, title } = props

  return (
    <div
      css={css`
        margin: 0 1rem;
        max-width: 380px;
        width: 100%;
        background-color: white;
        border-radius: 6px;
        box-shadow: ${shadows.drop()};
        flex-grow: 1;
        margin: 2rem;
        padding: 2rem;
      `}>
      <h1
        css={css`
          font-size: 24px;
          font-weight: 900;
          text-align: center;
          margin-bottom: 0rem;
        `}>
        {title}
      </h1>
      {children}
    </div>
  )
}

export interface AuthLayoutLinksProps {
  children: React.ReactNode
}

export function AuthLayoutLinks(props: AuthLayoutLinksProps) {
  const { children } = props

  return (
    <div
      css={css`
        display: flex;
        align-items: stretch;
        flex-wrap: wrap;
        justify-content: space-between;

        margin-top: 2rem;

        color: ${colors.primary};
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;

        ${UnstyledLinkControl}:hover {
          text-decoration: underline;
        }
      `}>
      {children}
    </div>
  )
}
