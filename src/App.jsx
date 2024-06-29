// App.jsx
import React from 'react';
import Router from './router';
import { ThemeProvider } from './theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router />
    </ThemeProvider>
  );
}

export default App;
