import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    console.log(`🔧 App mode set to: ${mode.toUpperCase()}`);
  }, [mode]);

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
  };

  const toggleMode = () => {
    setModeState(prev => prev === 'dev' ? 'prod' : 'dev');
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
