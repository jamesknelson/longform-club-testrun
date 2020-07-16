import * as React from 'react'

import { mount } from 'utils/routing'

import ConnectTwitter from './connectTwitter'
import Payment from './payment'
import Thankyou from './thankyou'

export default mount({
  './connect-twitter': <ConnectTwitter />,
  './payment': <Payment />,
  './thankyou': <Thankyou />,
})
