// App.jsx


// 移除不存在的导入
// import { optimizeCssLoading } from './cssLoader'
// 更新路由导入路径
import Router from './router'
import { ThemeProvider } from './theme-provider'

function App() {
  // 如果不需要CSS优化功能，可以移除或注释这段代码
  /*
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => optimizeCssLoading())
      } else {
        setTimeout(optimizeCssLoading, 200)
      }
    }
  }, [])
  */

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Router />
    </ThemeProvider>
  )
}

export default App
