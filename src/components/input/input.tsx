import * as React from 'react'
import { useCallback } from 'react'
import { css } from 'styled-components/macro'

import { colors, shadows } from 'theme'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  inline?: boolean
  onChange?: (text: string) => void
}

export function Input(props: InputProps) {
  const { className, hidden, inline, style, onChange, ...rest } = props

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.value)
      }
    },
    [onChange],
  )

  return (
    <div
      className={className}
      hidden={hidden}
      style={style}
      css={css`
        border: 1px solid ${colors.border.field};
        border-radius: 3px;
        display: ${inline ? 'inline-' : ''}flex;
        padding: 3px;
        transition: box-shadow 150ms ease-out;
        box-shadow: ${shadows.sunk()};

        :focus-within {
          box-shadow: ${shadows.sunk()}, ${shadows.beacon()};
        }
      `}>
      <input
        {...rest}
        css={css`
          border-width: 0;
          border-radius: 3px;
          color: ${colors.primary};
          font-size: 15px;
          padding: 0.5rem 0.75rem;
          outline: 0;
          width: 100%;
        `}
        onChange={handleChange}
      />
    </div>
  )
}
