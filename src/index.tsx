import './globalStyles.css'

import React from 'react'
import { unstable_createRoot as createRoot } from 'react-dom'

import App from './App'

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
const node = document.getElementById('root')!

createRoot(node).render(app)
