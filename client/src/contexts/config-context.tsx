import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clearCircleUserCache } from '@/hooks/use-circle-auth';

type AppMode = 'dev' | 'prod';

interface ConfigContextType {
  mode: AppMode;
  toggleMode: () => void;
  setMode: (mode: AppMode) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

function clearAllAuthData() {
  localStorage.removeItem('session_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('session_timestamp');
  clearCircleUserCache();
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [mode, setModeState] = useState<AppMode>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('app_mode') as AppMode;
    if (stored === 'dev' || stored === 'prod') {
      return stored;
    }
    
    // Fallback to env var (embedded at build time)
    const envDevMode = import.meta.env.VITE_DEV_MODE === 'true';
    return envDevMode ? 'dev' : 'prod';
  });

  useEffect(() => {
    localStorage.setItem('app_mode', mode);
  }, [mode]);

  const setMode = (newMode: AppMode) => {
    const previousMode = mode;
    setModeState(newMode);
    
    // When switching modes, clear all auth data and reload
    if (previousMode !== newMode) {
      clearAllAuthData();
      setTimeout(() => window.location.reload(), 100);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'dev' ? 'prod' : 'dev';
    setMode(newMode);
  };

  return (
    <ConfigContext.Provider value={{ mode, toggleMode, setMode }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
}
