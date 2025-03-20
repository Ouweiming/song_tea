import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'

import { ThemeProviderContext } from './theme-context'

// 批量更新DOM，减少重排
const updateThemeClasses = (root, oldTheme, newTheme) => {
  // 一次性移除所有主题类，避免类累积
  root.classList.remove('light', 'dark')

  // 强制重新计算样式，解决持久化样式问题
  // eslint-disable-next-line no-unused-expressions
  window.getComputedStyle(root).backgroundColor

  // 应用新类
  if (newTheme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'
    root.classList.add(systemTheme)
  } else {
    // 应用新主题
    root.classList.add(newTheme)
  }
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(storageKey) || defaultTheme
  })

  // 优化主题变更处理，避免组件树频繁重渲染
  useEffect(() => {
    const root = window.document.documentElement

    // 删除空格-这只需要做一次
    const updatedTheme = theme.replace(/\s/g, '')

    // 暂停过渡效果，避免中间状态
    root.style.transition = 'none'

    // 标记主题切换状态，帮助CSS选择器识别切换过程
    root.setAttribute('data-theme-switching', 'true')

    // 使用requestAnimationFrame确保DOM批量更新
    requestAnimationFrame(() => {
      updateThemeClasses(root, null, updatedTheme)

      // 确保更新已应用后再恢复过渡
      requestAnimationFrame(() => {
        // 恢复过渡效果
        root.style.transition = ''

        // 移除切换状态标记
        root.removeAttribute('data-theme-switching')
      })
    })

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        const newSystemTheme = mediaQuery.matches ? 'dark' : 'light'
        root.classList.remove('light', 'dark')

        // 添加短暂延迟，确保DOM有时间处理类移除
        setTimeout(() => {
          root.classList.add(newSystemTheme)
        }, 5)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  // 优化setTheme函数，使用useCallback提高性能并添加防抖
  const setTheme = useCallback(
    newTheme => {
      // 防止快速连续切换导致状态紊乱
      const currentTheme = localStorage.getItem(storageKey)

      if (typeof newTheme === 'function') {
        newTheme = newTheme(currentTheme || defaultTheme)
      }

      if (newTheme !== currentTheme) {
        localStorage.setItem(storageKey, newTheme)
        setThemeState(newTheme)

        // 触发自定义事件通知应用主题已更改
        window.dispatchEvent(
          new CustomEvent('theme-changed', {
            detail: { theme: newTheme },
          })
        )
      }
    },
    [storageKey, defaultTheme]
  )

  // 使用useMemo缓存context值
  const value = { theme, setTheme }

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
