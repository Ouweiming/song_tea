import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './index.css'
// 添加 ESLint 忽略特定规则的注释
// eslint-disable-next-line react-refresh/only-export-components
import './preload'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
