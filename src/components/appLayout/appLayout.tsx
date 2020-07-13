import * as React from 'react'
import { css } from 'styled-components/macro'

import { UnstyledLinkControl } from 'components/link'

import { colors, shadows } from 'theme'

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
          box-shadow: ${shadows.drop()};
          color: ${colors.primary};
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
            <UnstyledLinkControl
              href="/"
              css={css`
                display: flex;
                align-items: center;
                font-size: 18px;
                line-height: 18px;
                font-weight: 700;
                padding: 1rem 0;
              `}>
              longform
            </UnstyledLinkControl>
            <div
              css={css`
                flex-grow: 1;
              `}
            />
            <UnstyledLinkControl
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
            </UnstyledLinkControl>
            <UnstyledLinkControl
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
              sign in
            </UnstyledLinkControl>
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
      <footer
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;

          background-color: ${colors.primary};
          box-shadow: ${shadows.drop()};
          color: rgba(255, 255, 255, 0.33);
          font-size: 10px;
          font-weight: 500;
          height: 50px;
          text-align: center;
          text-transform: uppercase;
        `}>
        Build longform yourself. Learn how with&nbsp;
        <UnstyledLinkControl
          href="/legal"
          css={css`
            text-decoration: underline;
          `}>
          React ＋ Bacon
        </UnstyledLinkControl>
        <span
          css={css`
            margin: 0 0.5rem;
          `}>
          &middot;
        </span>
        <UnstyledLinkControl
          href="/legal"
          css={css`
            text-decoration: underline;
          `}>
          Legal
        </UnstyledLinkControl>
      </footer>
    </div>
  )
}
