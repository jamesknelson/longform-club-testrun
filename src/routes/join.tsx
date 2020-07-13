import * as React from 'react'
import { useState } from 'react'
import { css } from 'styled-components/macro'

import { AuthLayout, AuthLayoutLinks } from 'components/authLayout'
import { ButtonBody, UnstyledButtonControl } from 'components/button'
import { Field, FieldInput, FieldLabel } from 'components/field'
import { UnstyledLinkControl } from 'components/link'

import { colors } from 'theme'

export default function Join() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    alert(`hi ${name}, welcome onboard!`)
  }

  return (
    <AuthLayout title="Join in">
      <p
        css={css`
          color: ${colors.text.default};
          margin-top: 1.5rem;
          text-align: center;
        `}>
        Every journey starts with a single step.
      </p>
      <form onSubmit={handleSubmit}>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <FieldInput onChange={setName} value={name} />
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldInput type="email" onChange={setEmail} value={email} />
        </Field>
        <Field>
          <FieldLabel>Password</FieldLabel>
          <FieldInput type="password" onChange={setPassword} value={password} />
        </Field>
        <UnstyledButtonControl
          type="submit"
          css={css`
            margin-top: 1rem;
          `}>
          <ButtonBody>Join</ButtonBody>
        </UnstyledButtonControl>
      </form>
      <AuthLayoutLinks>
        <UnstyledLinkControl href="/login">Sign In</UnstyledLinkControl>
        <UnstyledLinkControl href="/recover">
          Recover Account
        </UnstyledLinkControl>
      </AuthLayoutLinks>
    </AuthLayout>
  )
}
