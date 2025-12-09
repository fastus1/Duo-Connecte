import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const CIRCLE_THEME_EVENT = 'circle-theme-change';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

function getInitialTheme(storedTheme: Theme | null, defaultTheme: Theme): 'light' | 'dark' {
  const theme = storedTheme || defaultTheme;
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || defaultTheme;
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return getInitialTheme(stored, defaultTheme);
  });

  useEffect(() => {
    const handleCircleTheme = (event: CustomEvent<{ theme: 'light' | 'dark' }>) => {
      const newTheme = event.detail.theme;
      localStorage.setItem('theme', newTheme);
      setThemeState(newTheme);
    };

    window.addEventListener(CIRCLE_THEME_EVENT, handleCircleTheme as EventListener);
    return () => window.removeEventListener(CIRCLE_THEME_EVENT, handleCircleTheme as EventListener);
  }, []);

  useEffect(() => {
    const handleGlobalMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CIRCLE_USER_AUTH' && event.data?.theme) {
        const newTheme = event.data.theme as 'light' | 'dark';
        localStorage.setItem('theme', newTheme);
        setThemeState(newTheme);
      }
    };

    window.addEventListener('message', handleGlobalMessage);
    return () => window.removeEventListener('message', handleGlobalMessage);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
        setActualTheme('dark');
      } else {
        root.classList.remove('dark');
        setActualTheme('light');
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function setThemeFromCircle(circleTheme: 'light' | 'dark') {
  localStorage.setItem('theme', circleTheme);
  const root = document.documentElement;
  if (circleTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  window.dispatchEvent(new CustomEvent('circle-theme-change', { 
    detail: { theme: circleTheme } 
  }));
}
