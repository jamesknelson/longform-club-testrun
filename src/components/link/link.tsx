import * as React from 'react'
import { useContext } from 'react'
import styled, { css } from 'styled-components/macro'

import { NavigationContext } from 'contexts/navigationContext'

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  href: string
}

export function Link(props: LinkProps) {
  const { children, href, ...rest } = props

  const { navigate } = useContext(NavigationContext)

  const handleClick = (event: React.MouseEvent) => {
    // Don't hijack navigation when a modifier is being pressed,
    // e.g. to open the link in a new tab
    if (
      event.button !== 0 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return
    }

    event.preventDefault()

    navigate(href)
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      css={css`
        color: inherit;
        text-decoration: none;
      `}
      {...rest}>
      {children}
    </a>
  )
}

export const LinkControl = styled(Link)`
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;

  appearance: none;
  color: inherit;
  cursor: pointer;
  outline: none;
  text-decoration: none;
`
