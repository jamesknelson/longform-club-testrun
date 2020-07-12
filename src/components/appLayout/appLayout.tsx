import * as React from 'react'
import { css } from 'styled-components/macro'

import { Link } from 'components/link'

import { colors } from 'theme'

import { AppLayoutClamp } from './appLayoutClamp'

export interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout(props: AppLayoutProps) {
  const { children } = props

  return (
    <div
      css={css`
        background-color: ${colors.wash};
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      `}>
      <header
        css={css`
          background-color: white;
          box-shadow: 0 1px 3px 2px rgba(0, 0, 0, 0.03);
          display: flex;
          justify-content: center;
        `}>
        <AppLayoutClamp>
          <div
            css={css`
              display: flex;
              align-items: stretch;
              height: 50px;
              width: 100%;
            `}>
            <Link
              href="/"
              css={css`
                color: ${colors.primary};
                display: flex;
                align-items: center;
                font-size: 18px;
                line-height: 18px;
                font-weight: 700;
                padding: 1rem 0;
              `}>
              longform
            </Link>
            <div
              css={css`
                flex-grow: 1;
              `}
            />
            <Link
              href="/settings"
              css={css`
                display: flex;
                align-items: center;
                font-size: 14px;
                line-height: 14px;
                font-weight: 500;
                padding: 1rem 0;
                margin-right: 1rem;

                :hover {
                  text-decoration: underline;
                }
              `}>
              settings
            </Link>
            <Link
              href="/login"
              css={css`
                display: flex;
                align-items: center;
                font-size: 14px;
                line-height: 14px;
                font-weight: 500;
                padding: 1rem 0;

                :hover {
                  text-decoration: underline;
                }
              `}>
              login
            </Link>
          </div>
        </AppLayoutClamp>
      </header>
      <main
        css={css`
          display: flex;
          justify-content: center;
          width: 100%;
        `}>
        {children}
      </main>
    </div>
  )
}
