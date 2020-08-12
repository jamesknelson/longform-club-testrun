import * as React from 'react'
import { createPatternRouter } from 'react-routing-library'

import ConnectTwitter from './connectTwitter'
import Payment from './payment'
import Thankyou from './thankyou'

export default createPatternRouter({
  './connect-twitter': <ConnectTwitter />,
  './payment': <Payment />,
  './thankyou': <Thankyou />,
})
