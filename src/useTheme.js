import { useContext, useEffect, useRef, useState } from 'react'

import { ThemeProviderContext } from './theme-context'

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  const [themeState, setThemeState] = useState(context.theme)
  const [localIsChanging, setLocalIsChanging] = useState(false)
  const stateRef = useRef(context.theme)

  // 确保状态同步
  useEffect(() => {
    // 同步context的主题到本地状态
    if (context.theme !== stateRef.current) {
      stateRef.current = context.theme
      setThemeState(context.theme)
    }

    setLocalIsChanging(context.isChanging || false)

    // 监听主题变化事件
    const handleThemeChange = e => {
      console.log('Theme change event detected', e.detail) // 添加日志
      const newTheme = e.detail.theme
      stateRef.current = newTheme
      setThemeState(newTheme)
      setLocalIsChanging(true)
    }

    // 监听主题变化完成事件
    const handleThemeChangeComplete = () => {
      setLocalIsChanging(false)
    }

    window.addEventListener('theme-changed', handleThemeChange)
    window.addEventListener('theme-changed-complete', handleThemeChangeComplete)

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange)
      window.removeEventListener(
        'theme-changed-complete',
        handleThemeChangeComplete
      )
    }
  }, [context.theme, context.isChanging])

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  // 确保返回最新状态
  return {
    theme: themeState,
    setTheme: context.setTheme,
    isChangingTheme: localIsChanging,
  }
}
