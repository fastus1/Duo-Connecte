import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { queryClient } from '@/lib/queryClient';

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

function clearAuthDataAndReload() {
  localStorage.removeItem('session_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('session_timestamp');
  localStorage.setItem('app_mode', 'prod');
  queryClient.clear();
  console.log('🔒 PROD MODE: Auth data cleared, reloading...');
  window.location.href = '/';
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [mode, setModeState] = useState<AppMode>(() => {
    const stored = localStorage.getItem('app_mode') as AppMode;
    if (stored === 'dev' || stored === 'prod') {
      return stored;
    }
    
    const envDevMode = import.meta.env.VITE_DEV_MODE === 'true';
    return envDevMode ? 'dev' : 'prod';
  });

  useEffect(() => {
    localStorage.setItem('app_mode', mode);
    console.log(`🔧 App mode set to: ${mode.toUpperCase()}`);
  }, [mode]);

  const setMode = (newMode: AppMode) => {
    if (newMode === 'prod' && mode !== 'prod') {
      clearAuthDataAndReload();
      return;
    }
    setModeState(newMode);
  };

  const toggleMode = () => {
    const newMode = mode === 'dev' ? 'prod' : 'dev';
    if (newMode === 'prod') {
      clearAuthDataAndReload();
      return;
    }
    setModeState(newMode);
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
