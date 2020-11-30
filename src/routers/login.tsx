import * as React from 'react'
import { useState } from 'react'
import { Link, useWaitUntilNavigationCompletes } from 'retil-router'

import { AuthLayout } from 'components/authLayout'
import { Input } from 'components/input'
import { useAuthController } from 'hooks/useFirebaseAuth'
import { useOperation } from 'hooks/useOperation'
import { Issues } from 'types/issues'

const validateLogin = (data: any) => {
  return null
}

export default function Login() {
  const authController = useAuthController()
  const waitUntilNavigationCompletes = useWaitUntilNavigationCompletes()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [issues, setIssues] = useState<Issues | null>(null)

  const [login, loginPending] = useOperation(async (event: React.FormEvent) => {
    event.preventDefault()

    const data = { email, password }
    const issues = validateLogin({ email, password })

    if (issues) {
      setIssues(issues)
    } else {
      const issues = await authController.signInWithPassword(data)
      if (issues) {
        setIssues(issues)
      } else {
        return waitUntilNavigationCompletes()
      }
    }
  })

  return (
    <AuthLayout title="Sign in">
      <form onSubmit={login}>
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
        <button disabled={loginPending} type="submit">
          {loginPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <hr />
      <Link to="/join">Create New Account</Link>{' '}
      <Link to="/recover">Recover Account</Link>
    </AuthLayout>
  )
}
