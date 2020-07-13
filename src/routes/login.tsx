import * as React from 'react'

import { AuthLayout } from 'components/authLayout'
import { Link } from 'components/link'

export default function Login() {
  return (
    <AuthLayout title="Sign in">
      <form>
        <label>
          Your email
          <input type="email" value="" />
        </label>
      </form>
      <hr />
      <Link href="/join">Create New Account</Link>{' '}
      <Link href="/recover">Recover Account</Link>
    </AuthLayout>
  )
}
