import * as React from 'react'
import ReactDOM from 'react-dom/client'

// 确保React先加载
import App from './App'
import './index.css'
import './preload'
import './utils/domTools.js'
import './utils/initPerformance'

// 创建一个加载优先级管理器
const optimizeCriticalPath = () => {
  // 立即添加requestIdleCallback polyfill
  if (!('requestIdleCallback' in window)) {
    window.requestIdleCallback = cb => {
      const start = Date.now()
      return setTimeout(() => {
        cb({
          didTimeout: false,
          timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
        })
      }, 1)
    }
    window.cancelIdleCallback = id => clearTimeout(id)
  }

  // 先渲染应用
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )

  // 在空闲时间预加载关键资源
  requestIdleCallback(
    () => {
      // 预加载常用资源
      const assets = [
        { href: '/src/assets/logo.svg', as: 'image' },
        { href: '/src/assets/video.webm', as: 'video' },
      ]

      assets.forEach(asset => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = asset.href
        link.as = asset.as
        document.head.appendChild(link)
      })
    },
    { timeout: 3000 }
  )
}

// 执行优化
optimizeCriticalPath()
