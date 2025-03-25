import * as React from 'react'
import ReactDOM from 'react-dom/client'

// 优先导入必要的性能优化工具
import './utils/performanceUtils'

// 延迟导入非关键资源
const lazyInit = () => {
  import('./App').then(({ default: App }) => {
    const root = ReactDOM.createRoot(document.getElementById('root'))
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  })
}

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

  // 检测浏览器支持
  const isBrowserSupported =
    'querySelector' in document &&
    'addEventListener' in window &&
    'localStorage' in window

  if (!isBrowserSupported) {
    // 在不支持的浏览器上使用简化版本
    console.warn('Browser not fully supported, using fallback mode')
    lazyInit()
    return
  }

  // 使用更小的初始渲染
  const preloader = document.createElement('div')
  preloader.className = 'app-preloader'
  preloader.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; 
                background: linear-gradient(135deg, #f6f2e9 0%, #8ed4ca 100%);">
      <div style="text-align: center;">
        <svg width="60" height="60" viewBox="0 0 24 24" style="margin-bottom: 16px;">
          <path fill="#10b981" d="M12 21C7 17 2 13 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3 1 4.5 3C13.5 4 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 4.5-5 8.5-10 12.5z"></path>
        </svg>
        <div style="font-family: system-ui, sans-serif; color: #065f46; font-size: 18px; font-weight: 600;">
          后花园宋茶
        </div>
      </div>
    </div>
  `

  // 检查root是否存在，不存在就创建
  let rootElement = document.getElementById('root')
  if (!rootElement) {
    rootElement = document.createElement('div')
    rootElement.id = 'root'
    document.body.appendChild(rootElement)
  }

  // 先显示静态加载界面
  rootElement.appendChild(preloader)

  // 使用requestIdleCallback延迟初始化应用
  requestIdleCallback(
    () => {
      lazyInit()

      // 在应用加载后，移除预加载器
      window.addEventListener('load', () => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            preloader.style.opacity = '0'
            preloader.style.transition = 'opacity 0.3s ease'

            setTimeout(() => {
              if (preloader.parentNode === rootElement) {
                rootElement.removeChild(preloader)
              }
            }, 300)
          }, 300)
        })
      })
    },
    { timeout: 1000 }
  )
}

// 执行优化
optimizeCriticalPath()
