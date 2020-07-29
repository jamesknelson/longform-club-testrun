import * as React from 'react'

import { Link } from 'utils/router'

export default function Landing() {
  return (
    <div>
      <div>
        <h1>Leave Outrage Behind</h1>
        <p>
          Deactivating your Twitter account is easy, but keeping it that way?
          Longform keeps you honest by tracking your social network downtime.
        </p>
        <Link href="/join">Join</Link>
      </div>
    </div>
  )
}
