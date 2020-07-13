import * as React from 'react'
import { useState } from 'react'

import { AuthLayout } from 'components/authLayout'
import { Input } from 'components/input'
import { Link } from 'components/link'

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
      <p>Every journey starts with a single step.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <br />
          <Input onChange={setName} value={name} />
        </label>
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
      <Link href="/login">Sign In</Link>{' '}
      <Link href="/recover">Recover Account</Link>
    </AuthLayout>
  )
}
