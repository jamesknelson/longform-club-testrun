import * as React from 'react'
import { Link } from 'retil-router'

import { AuthLayout } from 'components/authLayout'

import { requireNoAuth } from 'utils/routing'

function RecoverAccount() {
  return (
    <AuthLayout title="Recover Account">
      <form>
        <label>
          Your email
          <input type="email" value="" />
        </label>
      </form>
      <hr />
      <Link to="/join">Create New Account</Link>{' '}
      <Link to="/login">Sign In</Link>
    </AuthLayout>
  )
}

export default requireNoAuth(() => <RecoverAccount />, '/dashboard')
