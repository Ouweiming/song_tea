import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

// 初始化函数，确保DOM与状态同步
const initializeTheme = () => {
  if (typeof window === 'undefined') return 'system'

  // 获取保存的主题
  const savedTheme = localStorage.getItem('vite-ui-theme') || 'system'

  // 确保DOM初始化时就应用正确的主题类
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')

  // 如果是系统主题，检查系统偏好
  if (savedTheme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'
    root.classList.add(systemTheme)
    return savedTheme
  } else {
    // 直接应用保存的主题
    root.classList.add(savedTheme)
    return savedTheme
  }
}

const useThemeStore = create(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        theme: initializeTheme(), // 使用初始化函数
        isChanging: false,
        setTheme: newTheme => {
          if (get().isChanging) return
          const resolvedTheme =
            typeof newTheme === 'function' ? newTheme(get().theme) : newTheme
          const cleanTheme = resolvedTheme.replace(/\s/g, '')
          set({ isChanging: true })
          localStorage.setItem('vite-ui-theme', cleanTheme)
          window.dispatchEvent(
            new CustomEvent('theme-changed', { detail: { theme: cleanTheme } })
          )
          requestAnimationFrame(() => {
            const root = window.document.documentElement
            const appliedTheme = updateThemeClasses(root, cleanTheme)
            set({ theme: cleanTheme })
            setTimeout(() => {
              set({ isChanging: false })
              window.dispatchEvent(
                new CustomEvent('theme-changed-complete', {
                  detail: { theme: appliedTheme },
                })
              )
            }, 100)
          })
        },
        handleSystemThemeChange: () => {
          if (get().theme !== 'system') return
          set({ isChanging: true })
          requestAnimationFrame(() => {
            const root = window.document.documentElement
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const systemTheme = mediaQuery.matches ? 'dark' : 'light'
            root.classList.remove('light', 'dark')
            root.classList.add(systemTheme)
            setTimeout(() => set({ isChanging: false }), 100)
          })
        },
      }),
      { name: 'theme-store' }
    )
  )
)

const updateThemeClasses = (root, newTheme) => {
  root.classList.remove('light', 'dark')
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

if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    useThemeStore.getState().handleSystemThemeChange()
  })
}

export default useThemeStore
