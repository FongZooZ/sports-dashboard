import React from 'react'
import { render } from 'react-dom'

import Dashboard from './views/dashboard'

const dashboardContainer = document.getElementById('dashboard-container')
if (dashboardContainer) {
  render(<Dashboard />, dashboardContainer)
}