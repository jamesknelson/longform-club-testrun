import * as React from 'react'
import { css } from 'styled-components/macro'

import { AppLayoutClamp } from 'components/appLayout'

import { colors } from 'theme'

export default function NotFound() {
  return (
    <AppLayoutClamp>
      <h1
        css={css`
          color: ${colors.primary};
          font-size: 2rem;
          line-height: 2.3rem;
          margin: 2rem 0 1rem;
        `}>
        Your Page Seems To Have Gone For A Walk Or Something
      </h1>
      <p>404 - not found</p>
    </AppLayoutClamp>
  )
}
