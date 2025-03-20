import * as React from 'react'
import ReactDOM from 'react-dom/client'

// 确保React先加载

import App from './App'
import './index.css'
import './preload'

// 预加载关键资源
const preloadResources = () => {
  // 创建资源预加载 hint
  const links = [
    // 预加载logo和关键图片资源
    { rel: 'preload', href: '/src/assets/logo.svg', as: 'image' },
    // 视频预获取 (比预加载优先级低，不会阻塞关键资源)
    { rel: 'prefetch', href: '/src/assets/video.mp4', as: 'video' },
    { rel: 'prefetch', href: '/src/assets/video.webm', as: 'video' },
  ]

  // 动态添加预加载标记
  links.forEach(linkProps => {
    const link = document.createElement('link')
    Object.entries(linkProps).forEach(([key, value]) => {
      link[key] = value
    })
    document.head.appendChild(link)
  })
}

// 在适当时机调用预加载函数
if (typeof window !== 'undefined') {
  // 使用 requestIdleCallback 在浏览器空闲时执行
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(preloadResources)
  } else {
    // 回退方案
    setTimeout(preloadResources, 1)
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
