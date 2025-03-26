import useThemeStore from './stores/themeStore'

export const useTheme = () => {
  const theme = useThemeStore(state => state.theme)
  const isChanging = useThemeStore(state => state.isChanging)
  const setTheme = useThemeStore(state => state.setTheme)

  return {
    theme,
    setTheme,
    isChangingTheme: isChanging,
  }
}
