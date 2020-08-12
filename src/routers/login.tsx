import * as React from 'react'
import { Link } from 'react-routing-library'

import { AuthLayout } from 'components/authLayout'

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
      <Link to="/join">Create New Account</Link>{' '}
      <Link to="/recover">Recover Account</Link>
    </AuthLayout>
  )
}
