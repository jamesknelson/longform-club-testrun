import * as React from 'react'

import { AuthLayout } from 'components/authLayout'
import { Link } from 'components/link'

export default function RecoverAccount() {
  return (
    <AuthLayout title="Recover Account">
      <form>
        <label>
          Your email
          <input type="email" value="" />
        </label>
      </form>
      <hr />
      <Link href="/join">Create New Account</Link>{' '}
      <Link href="/login">Sign In</Link>
    </AuthLayout>
  )
}
