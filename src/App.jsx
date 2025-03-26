// App.jsx
import DebugSection from './components/DebugSection'
import DebugTools from './components/DebugTools'
import Router from './router'
import { ThemeProvider } from './theme-provider'

function App() {
  const isDev = import.meta.env.DEV

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Router />
      {/* 只在开发环境显示调试工具 */}
      {isDev && (
        <>
          <DebugTools />
          <DebugSection />
        </>
      )}
    </ThemeProvider>
  )
}

export default App
