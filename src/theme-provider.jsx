import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ThemeProviderContext } from './theme-context'

// 简化DOM更新，减少重排
const updateThemeClasses = (root, newTheme) => {
  // 移除所有主题类
  root.classList.remove('light', 'dark')

  // 应用新主题 - 简单的类名切换
  if (newTheme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'
    root.classList.add(systemTheme)
    return systemTheme
  } else {
    root.classList.add(newTheme)
    return newTheme
  }
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}) {
  // 使用ref缓存上一个主题
  const prevThemeRef = useRef(null)
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(storageKey) || defaultTheme
  })

  // 简化为仅有一个状态指示主题是否正在变化
  const [isChanging, setIsChanging] = useState(false)
  const timeoutRef = useRef(null)

  // 简化主题变更处理
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const root = window.document.documentElement

    // 只有当主题真正改变时才执行
    if (prevThemeRef.current !== theme) {
      // 设置正在更改状态
      setIsChanging(true)

      // 清除任何空格
      const updatedTheme = theme.replace(/\s/g, '')

      // 应用新主题 - 简单地更改类名
      const appliedTheme = updateThemeClasses(root, updatedTheme)

      // 更新前一个主题引用
      prevThemeRef.current = theme

      // 短暂延迟后重置状态
      timeoutRef.current = setTimeout(() => {
        setIsChanging(false)

        // 触发主题已完成切换事件
        window.dispatchEvent(
          new CustomEvent('theme-changed-complete', {
            detail: { theme: appliedTheme },
          })
        )
      }, 100) // 使用较短的延迟
    }

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        // 设置正在更改状态
        setIsChanging(true)

        // 直接更新类名
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        root.classList.remove('light', 'dark')
        root.classList.add(systemTheme)

        // 短暂延迟后重置状态
        timeoutRef.current = setTimeout(() => {
          setIsChanging(false)
        }, 100)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  // 简化setTheme函数
  const setTheme = useCallback(
    newTheme => {
      console.log('setTheme called with:', newTheme) // 添加日志

      // 防止连续切换
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 简化处理逻辑，避免多余条件判断
      const resolvedTheme =
        typeof newTheme === 'function' ? newTheme(theme) : newTheme

      // 无论主题是否变化都更新状态和保存到localStorage
      localStorage.setItem(storageKey, resolvedTheme)
      setThemeState(resolvedTheme)

      // 触发主题开始更改事件
      window.dispatchEvent(
        new CustomEvent('theme-changed', {
          detail: { theme: resolvedTheme },
        })
      )
    },
    [theme, storageKey]
  )

  // 缓存context值，避免不必要的重渲染
  const value = useMemo(
    () => ({
      theme,
      setTheme,
      isChanging,
    }),
    [theme, setTheme, isChanging]
  )

  // 简单地返回Provider
  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultTheme: PropTypes.string,
  storageKey: PropTypes.string,
}
