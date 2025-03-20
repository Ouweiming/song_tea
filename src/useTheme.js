import { useContext, useEffect, useState } from 'react'

import { ThemeProviderContext } from './theme-context'

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  const [themeState, setThemeState] = useState(context.theme)

  useEffect(() => {
    // 同步外部主题变化
    setThemeState(context.theme)

    // 监听主题变化事件
    const handleThemeChange = e => {
      setThemeState(e.detail.theme)
    }

    window.addEventListener('theme-changed', handleThemeChange)
    return () => {
      window.removeEventListener('theme-changed', handleThemeChange)
    }
  }, [context.theme])

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  // 确保返回最新状态
  return { ...context, theme: themeState }
}
