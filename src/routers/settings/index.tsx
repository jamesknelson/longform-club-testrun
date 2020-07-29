import * as React from 'react'

import { createRouter } from 'utils/router'

import AccountDetails from './accountDetails'
import ChangePassword from './changePassword'

function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      <p>Blurb blurb blurb</p>
    </div>
  )
}

export default createRouter({
  './': <Settings />,
  './account-details': <AccountDetails />,
  './change-password': <ChangePassword />,
})
