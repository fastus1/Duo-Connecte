import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom event for Circle.so theme sync
const CIRCLE_THEME_EVENT = 'circle-theme-change';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || defaultTheme;
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Listen for Circle.so theme changes via internal custom event
  // This event is dispatched by setThemeFromCircle after Zod validation in useCircleAuth
  useEffect(() => {
    const handleCircleTheme = (event: CustomEvent<{ theme: 'light' | 'dark' }>) => {
      const newTheme = event.detail.theme;
      localStorage.setItem('theme', newTheme);
      setThemeState(newTheme);
    };

    window.addEventListener(CIRCLE_THEME_EVENT, handleCircleTheme as EventListener);
    return () => window.removeEventListener(CIRCLE_THEME_EVENT, handleCircleTheme as EventListener);
  }, []);

  // Global listener for Circle.so postMessage - accepts from any origin for theme sync
  useEffect(() => {
    const handleGlobalMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CIRCLE_USER_AUTH' && event.data?.theme) {
        console.log('🎨 ThemeProvider: Message reçu de', event.origin, '- theme:', event.data.theme);
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
  // Apply theme immediately to DOM (avoids race condition with React effects)
  localStorage.setItem('theme', circleTheme);
  const root = document.documentElement;
  if (circleTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Also dispatch custom event to sync with ThemeProvider React state
  window.dispatchEvent(new CustomEvent('circle-theme-change', { 
    detail: { theme: circleTheme } 
  }));
}
