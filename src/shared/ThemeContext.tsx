import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { getThemeTokens } from './themeTokens'
import type { ThemeTokens } from './themeTokens'

export type Theme = 'spazio' | 'nasa' | 'mission'

const THEME_KEY = 'hermes-theme'

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'spazio',
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY) as Theme
      return saved === 'spazio' || saved === 'nasa' || saved === 'mission' ? saved : 'spazio'
    } catch {
      return 'spazio'
    }
  })

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext)
}

/**
 * Returns theme colors as plain JS values.
 * Web: works alongside CSS variables.
 * React Native migration: replace `style={{ color: 'var(--text-primary)' }}`
 *   with `style={{ color: tokens.textPrimary }}` — then drop CSS variables entirely.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useThemeTokens(): ThemeTokens {
  const { theme } = useContext(ThemeContext)
  return getThemeTokens(theme)
}
