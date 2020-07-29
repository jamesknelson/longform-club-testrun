import * as React from 'react'

import { createRouter } from 'utils/router'

import ConnectTwitter from './connectTwitter'
import Payment from './payment'
import Thankyou from './thankyou'

export default createRouter({
  './connect-twitter': <ConnectTwitter />,
  './payment': <Payment />,
  './thankyou': <Thankyou />,
})
