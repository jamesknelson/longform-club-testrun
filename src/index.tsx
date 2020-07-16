import './globalStyles.css'

import { createBrowserHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom'

import { getRouteMatchAndRedirect } from 'utils/routing'

import App from './App'
import indexRouter from './routers'

const history = createBrowserHistory()
const [initialRoute, initialRedirect] = getRouteMatchAndRedirect(
  indexRouter,
  history.location,
  {
    currentUser: undefined,
  },
)

if (initialRedirect) {
  history.replace(initialRedirect)
}

ReactDOM.render(
  <React.StrictMode>
    <App history={history} initialRoute={initialRoute} />
  </React.StrictMode>,
  document.getElementById('root'),
)
