import * as React from 'react'
import ReactDOM from 'react-dom/client'
// 确保从 'react-dom/client' 导入
import { BrowserRouter } from 'react-router-dom'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
