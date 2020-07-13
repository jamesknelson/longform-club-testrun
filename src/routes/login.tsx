import * as React from 'react'

import { AuthLayout, AuthLayoutLinks } from 'components/authLayout'
import { UnstyledLinkControl } from 'components/link'

export default function Login() {
  return (
    <AuthLayout title="Sign in">
      <form>
        <label>
          Your email
          <input type="email" value="" />
        </label>
      </form>
      <AuthLayoutLinks>
        <UnstyledLinkControl href="/join">
          Create New Account
        </UnstyledLinkControl>
        <UnstyledLinkControl href="/recover">
          Recover Account
        </UnstyledLinkControl>
      </AuthLayoutLinks>
    </AuthLayout>
  )
}
