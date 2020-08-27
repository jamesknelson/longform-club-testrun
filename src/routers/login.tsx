import * as React from 'react'
import { useState } from 'react'
import { Link } from 'retil-router'

import { useAuthController } from 'auth'
import { AuthLayout } from 'components/authLayout'
import { Input } from 'components/input'

export default function Login() {
  const { signInWithEmailAndPassword } = useAuthController()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // - I want an operation hook, but I don't want to have to pass the
  //   operations to the hook -- I want it to return a function that
  //   I can call or something.

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    signInWithEmailAndPassword({
      email,
      password,
    })
  }

  return (
    <AuthLayout title="Sign in">
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
        <button type="submit">Sign in</button>
      </form>
      <hr />
      <Link to="/join">Create New Account</Link>{' '}
      <Link to="/recover">Recover Account</Link>
    </AuthLayout>
  )
}
