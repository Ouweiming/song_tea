import { useContext, useEffect, useRef, useState } from 'react'

import { ThemeProviderContext } from './theme-context'

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  const [themeState, setThemeState] = useState(context.theme)
  const [isChanging, setIsChanging] = useState(false)
  const stateRef = useRef(context.theme)

  // 加入防抖逻辑，避免频繁状态更新
  useEffect(() => {
    // 如果提供者状态已经变化，同步到本地状态
    if (context.theme !== stateRef.current) {
      stateRef.current = context.theme
      setThemeState(context.theme)
    }

    // 同步切换中状态
    setIsChanging(context.isChanging || false)

    // 监听主题变化事件
    const handleThemeChange = e => {
      const newTheme = e.detail.theme
      if (newTheme !== stateRef.current) {
        stateRef.current = newTheme
        setThemeState(newTheme)
        setIsChanging(true)
      }
    }

    // 监听主题变化完成事件
    const handleThemeChangeComplete = () => {
      setIsChanging(false)
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

  // 返回增强的状态，包含切换中标志
  return {
    ...context,
    theme: themeState,
    isChangingTheme: isChanging,
  }
}
