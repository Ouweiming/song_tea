import { createContext } from 'react'

const initialState = {
  theme: 'system',
  setTheme: () => null,
  isChanging: false,
}

export const ThemeProviderContext = createContext(initialState)
