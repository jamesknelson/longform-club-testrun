import * as React from 'react'

import { AuthLayout, AuthLayoutLinks } from 'components/authLayout'
import { UnstyledLinkControl } from 'components/link'

export default function RecoverAccount() {
  return (
    <AuthLayout title="Recover Account">
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
        <UnstyledLinkControl href="/login">Sign In</UnstyledLinkControl>
      </AuthLayoutLinks>
    </AuthLayout>
  )
}
