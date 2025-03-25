import * as React from 'react'
import ReactDOM from 'react-dom/client'

// 优先导入必要的性能优化工具和加载组件
import './utils/performanceUtils'
import LoadingSpinner from './LoadingSpinner'

// 延迟导入非关键资源
const lazyInit = () => {
  import('./App').then(({ default: App }) => {
    const root = ReactDOM.createRoot(document.getElementById('root'))
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    
    // App 渲染后立即触发移除 spinner 的操作
    removeSpinner()
  })
}

// 创建一个独立的函数来移除 spinner
let spinnerRemovalTimeout = null
const removeSpinner = () => {
  const spinnerContainer = document.getElementById('spinner-container')
  if (!spinnerContainer) return
  
  // 清除之前的超时，确保不会重复执行
  if (spinnerRemovalTimeout) {
    clearTimeout(spinnerRemovalTimeout)
  }
  
  // 添加淡出效果
  spinnerContainer.style.opacity = '0'
  
  // 设置一个延迟，在淡出动画完成后移除元素
  spinnerRemovalTimeout = setTimeout(() => {
    if (spinnerContainer.parentNode) {
      spinnerContainer.parentNode.removeChild(spinnerContainer)
    }
  }, 300)
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

  // 创建一个容器用于渲染LoadingSpinner
  const spinnerContainer = document.createElement('div')
  spinnerContainer.id = 'spinner-container'
  spinnerContainer.style.position = 'fixed'
  spinnerContainer.style.top = '0'
  spinnerContainer.style.left = '0'
  spinnerContainer.style.width = '100%'
  spinnerContainer.style.height = '100%'
  spinnerContainer.style.zIndex = '9999'
  spinnerContainer.style.transition = 'opacity 0.3s ease'

  // 检查root是否存在，不存在就创建
  let rootElement = document.getElementById('root')
  if (!rootElement) {
    rootElement = document.createElement('div')
    rootElement.id = 'root'
    document.body.appendChild(rootElement)
  }

  // 添加spinner容器到body
  document.body.appendChild(spinnerContainer)
  
  // 渲染LoadingSpinner到容器
  const spinnerRoot = ReactDOM.createRoot(spinnerContainer)
  spinnerRoot.render(<LoadingSpinner size={50} />)

  // 使用requestIdleCallback延迟初始化应用
  requestIdleCallback(
    () => {
      lazyInit()

      // 添加多重保障确保spinner被移除
      
      // 1. 监听 DOMContentLoaded 事件（如果尚未触发）
      if (document.readyState !== 'loading') {
        // 如果DOM已加载，设置一个延迟移除
        setTimeout(removeSpinner, 2000);
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          setTimeout(removeSpinner, 2000);
        });
      }
      
      // 2. 监听 load 事件
      window.addEventListener('load', () => {
        setTimeout(removeSpinner, 1000);
      });
      
      // 3. 设置一个最终保障的超时
      setTimeout(removeSpinner, 5000);
    },
    { timeout: 1000 }
  )
}

// 执行优化
optimizeCriticalPath()
