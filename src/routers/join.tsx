import * as React from 'react'
import { useState } from 'react'
import { Link } from 'react-routing-library'

import { AuthLayout } from 'components/authLayout'
import { Input } from 'components/input'

export default function Join() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    alert(`hi}, welcome onboard!`)
  }

  return (
    <AuthLayout title="Join in">
      <p>Every journey starts with a single step.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <br />
          <Input type="email" onChange={setEmail} value={email} />
        </label>
        <label>
          Password
          <br />
          <Input type="password" onChange={setPassword} value={password} />
        </label>
        <button type="submit">Join</button>
      </form>
      <hr />
      <Link to="/login">Sign In</Link>{' '}
      <Link to="/recover">Recover Account</Link>
    </AuthLayout>
  )
}
