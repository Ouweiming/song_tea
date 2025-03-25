// App.jsx
import { useEffect } from 'react'

import { optimizeCssLoading } from './cssLoader'
// 更新路由导入路径
import Router from './router'
import { ThemeProvider } from './theme-provider'

function App() {
  // 在App挂载时优化CSS加载
  useEffect(() => {
    // 确保首屏渲染后再加载非关键CSS
    if (typeof window !== 'undefined') {
      // 使用requestIdleCallback在浏览器空闲时执行
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => optimizeCssLoading())
      } else {
        // 回退方案
        setTimeout(optimizeCssLoading, 200)
      }
    }
  }, [])

  return (
    // 只使用ThemeProvider，不要嵌套其他路由相关组件
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Router />
    </ThemeProvider>
  )
}

export default App
