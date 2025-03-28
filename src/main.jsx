// 精简导入
import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'

import LoadingSpinner from './LoadingSpinner'

// 内联最小的CSS样式
const criticalCSS = `
.app-loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  z-index: 9999;
  transition: opacity 0.3s ease;
}
.dark .app-loading-container {
  background-color: #111827;
}`

// 注入关键CSS到页面头部
const injectCriticalCSS = () => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style')
    style.setAttribute('id', 'critical-css')
    style.innerHTML = criticalCSS
    document.head.appendChild(style)
  }
}

// 优化初始化函数 - 将App组件的导入延迟到DOM准备就绪
const initApp = () => {
  // 导入App组件并创建根节点
  import('./App')
    .then(({ default: App }) => {
      const root = document.getElementById('root')
      if (root) {
        ReactDOM.createRoot(root).render(
          <Suspense
            fallback={
              <div className='app-loading-container'>
                <LoadingSpinner size={40} />
              </div>
            }
          >
            <App />
          </Suspense>
        )
      }

      // 移除加载指示器
      removeSpinner()
    })
    .catch(err => {
      console.error('应用加载失败:', err)
      // 显示错误信息
      const root = document.getElementById('root')
      if (root) {
        root.innerHTML =
          '<div style="padding: 2rem; text-align: center;">应用加载出错，请刷新页面重试</div>'
      }
      removeSpinner()
    })
}

// 移除Spinner函数
let spinnerRemovalTimeout = null
const removeSpinner = () => {
  const spinnerContainer = document.getElementById('spinner-container')
  if (!spinnerContainer) return

  if (spinnerRemovalTimeout) {
    clearTimeout(spinnerRemovalTimeout)
  }

  spinnerContainer.style.opacity = '0'
  spinnerRemovalTimeout = setTimeout(() => {
    if (spinnerContainer.parentNode) {
      spinnerContainer.parentNode.removeChild(spinnerContainer)
    }
  }, 300)
}

// 使用更简单的方法初始化应用
const optimizeCriticalPath = () => {
  // 注入关键CSS
  injectCriticalCSS()

  // 简化requestIdleCallback polyfill
  if (!('requestIdleCallback' in window)) {
    window.requestIdleCallback = cb => setTimeout(() => cb(), 1)
    window.cancelIdleCallback = id => clearTimeout(id)
  }

  // 创建加载指示器容器
  const spinnerContainer = document.createElement('div')
  spinnerContainer.id = 'spinner-container'
  spinnerContainer.className = 'app-loading-container'

  // 确保root元素存在
  let rootElement = document.getElementById('root')
  if (!rootElement) {
    rootElement = document.createElement('div')
    rootElement.id = 'root'
    document.body.appendChild(rootElement)
  }

  // 添加spinner容器
  document.body.appendChild(spinnerContainer)

  // 渲染加载指示器
  const spinnerRoot = ReactDOM.createRoot(spinnerContainer)
  spinnerRoot.render(<LoadingSpinner size={50} />)

  // 在空闲时间初始化应用
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => initApp(), { timeout: 2000 })
  } else {
    // 兜底方案
    setTimeout(initApp, 100)
  }

  // 确保应用最终会加载，即使requestIdleCallback失败
  setTimeout(() => {
    const root = document.getElementById('root')
    if (!root.hasChildNodes()) {
      initApp()
    }
  }, 3000)
}

// 在页面加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', optimizeCriticalPath)
} else {
  optimizeCriticalPath()
}
