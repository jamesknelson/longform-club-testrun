import * as React from 'react'
import { css } from 'styled-components/macro'

import { AppLayoutClamp } from 'components/appLayout'
import { ButtonBody } from 'components/buttonBody'
import { LinkControl } from 'components/link'

import { colors } from 'theme'

export default function Landing() {
  return (
    <AppLayoutClamp>
      <div
        css={css`
          padding-top: 1rem;
        `}>
        <h1
          css={css`
            color: ${colors.primary};
            font-size: 2rem;
            line-height: 2.3rem;
            margin: 2rem 0 1rem;
          `}>
          Leave Outrage Behind
        </h1>
        <p
          css={css`
            color: ${colors.text.default};
          `}>
          Deactivating your Twitter account is easy, but keeping it that way?
          Longform keeps you honest by tracking your social network downtime.
        </p>
        <div
          css={css`
            margin-bottom: 1.5rem;
          `}
        />
        <LinkControl href="/signup">
          <ButtonBody>Join</ButtonBody>
        </LinkControl>
      </div>
    </AppLayoutClamp>
  )
}
