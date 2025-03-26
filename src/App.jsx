// App.jsx
import Router from './router'
import { ThemeInitializer } from './ThemeInitializer'

function App() {
  return (
    <ThemeInitializer defaultTheme='dark' storageKey='vite-ui-theme'>
      <Router />
    </ThemeInitializer>
  )
}

export default App
