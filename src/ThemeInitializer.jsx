import PropTypes from 'prop-types'
import { useEffect } from 'react'

import useThemeStore from './stores/themeStore'

export function ThemeInitializer({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
}) {
  const setTheme = useThemeStore(state => state.setTheme)

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey)
    if (!savedTheme && defaultTheme !== 'system') {
      setTheme(defaultTheme)
    }
  }, [defaultTheme, storageKey, setTheme])

  return children
}

ThemeInitializer.propTypes = {
  children: PropTypes.node.isRequired,
  defaultTheme: PropTypes.string,
  storageKey: PropTypes.string,
}
