import * as React from 'react'
import { createContext, useContext, useMemo } from 'react'
import { css } from 'styled-components/macro'

import { Input, InputProps } from 'components/input'

import { IdFactoryContext } from 'contexts/idFactoryContext'

import { colors } from 'theme'

interface FieldContext {
  id: string
}

const FieldContext = createContext<FieldContext>(undefined as any)

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  id?: string
}

export function Field(props: FieldProps) {
  const idFactory = useContext(IdFactoryContext)
  const defaultId = idFactory('field')

  const { children, id = defaultId, ...rest } = props

  const fieldContext = useMemo(
    () => ({
      id,
    }),
    [id],
  )

  return (
    <FieldContext.Provider value={fieldContext}>
      <div
        css={css`
          margin: 0.5rem 0;
        `}
        {...rest}>
        {children}
      </div>
    </FieldContext.Provider>
  )
}

export interface FieldInputProps extends Omit<InputProps, 'name'> {}

export function FieldInput(props: FieldInputProps) {
  const { id: name } = useContext(FieldContext)

  return <Input {...props} id={name} />
}

export interface FieldLabelProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> {}

export function FieldLabel(props: FieldLabelProps) {
  const { id: name } = useContext(FieldContext)

  return (
    <label
      {...props}
      htmlFor={name}
      css={css`
        color: ${colors.text.alt};
        display: flex;
        flex-direction: column;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
      `}
    />
  )
}
