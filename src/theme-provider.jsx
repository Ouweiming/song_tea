import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ThemeProviderContext } from './theme-context'

// 优化DOM批量更新，减少重排
const updateThemeClasses = (root, newTheme) => {
  // 移除所有主题类
  root.classList.remove('light', 'dark')

  // 应用新主题 - 不再强制重新计算样式
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

  // 添加禁止动画状态
  const [disableTransitions, setDisableTransitions] = useState(false)
  const timeoutRef = useRef(null)

  // 优化主题变更处理，使用更高效的DOM操作
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const root = window.document.documentElement

    // 只有当主题真正改变时才执行
    if (prevThemeRef.current !== theme) {
      // 清除任何空格
      const updatedTheme = theme.replace(/\s/g, '')

      // 临时禁用所有CSS过渡
      setDisableTransitions(true)
      root.setAttribute('data-theme-switching', 'true')

      // 使用单一rAF调用进行批处理
      requestAnimationFrame(() => {
        // 更新类并获取实际应用的主题
        const appliedTheme = updateThemeClasses(root, updatedTheme)

        // 使用较短的超时恢复过渡
        timeoutRef.current = setTimeout(() => {
          // 恢复过渡
          setDisableTransitions(false)
          root.removeAttribute('data-theme-switching')

          // 发送事件通知主题已完成切换
          window.dispatchEvent(
            new CustomEvent('theme-changed-complete', {
              detail: { theme: appliedTheme },
            })
          )
        }, 100) // 减少到100ms，足够等待DOM更新但不会感到明显延迟
      })

      // 更新前一个主题引用
      prevThemeRef.current = theme
    }

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        // 使用相同的批处理优化系统主题变化
        setDisableTransitions(true)
        requestAnimationFrame(() => {
          const systemTheme = mediaQuery.matches ? 'dark' : 'light'
          root.classList.remove('light', 'dark')
          root.classList.add(systemTheme)

          timeoutRef.current = setTimeout(() => {
            setDisableTransitions(false)
          }, 100)
        })
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

  // 优化setTheme函数，使用防抖和引用比较
  const setTheme = useCallback(
    newTheme => {
      // 防止连续切换
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 处理函数式更新
      const resolvedTheme =
        typeof newTheme === 'function'
          ? newTheme(prevThemeRef.current || theme)
          : newTheme

      // 只有在主题真正改变时才更新
      if (resolvedTheme !== theme) {
        localStorage.setItem(storageKey, resolvedTheme)
        setThemeState(resolvedTheme)

        // 触发主题开始更改事件
        window.dispatchEvent(
          new CustomEvent('theme-changed', {
            detail: { theme: resolvedTheme },
          })
        )
      }
    },
    [theme, storageKey]
  )

  // 缓存context值，避免不必要的重渲染
  const value = useMemo(
    () => ({
      theme,
      setTheme,
      isChanging: disableTransitions,
    }),
    [theme, setTheme, disableTransitions]
  )

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
