import './globalStyles.css'

import { createBrowserHistory } from 'history'
import React from 'react'
import ReactDOM from 'react-dom'

import { normalizeLocation } from 'utils/normalizeLocation'

import App from './App'

const history = createBrowserHistory()
const normalizedLocation = normalizeLocation(history.location)

if (normalizedLocation !== history.location) {
  history.replace(normalizedLocation)
}

ReactDOM.render(
  <React.StrictMode>
    <App history={history} />
  </React.StrictMode>,
  document.getElementById('root'),
)
