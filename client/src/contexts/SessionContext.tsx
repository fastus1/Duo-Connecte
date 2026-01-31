import { createContext, useContext, useState, ReactNode } from 'react';
import { type SessionState } from '@shared/schema';

interface SessionContextType {
  session: SessionState;
  updateSession: (updates: Partial<SessionState>) => void;
  resetSession: () => void;
  goToStep: (step: number) => void;
  goBack: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const defaultSession: SessionState = {
  currentStep: 0,
  lastUpdated: new Date().toISOString(),
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>(defaultSession);

  const updateSession = (updates: Partial<SessionState>) => {
    setSession(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const resetSession = () => {
    setSession(defaultSession);
  };

  const goToStep = (step: number) => {
    updateSession({ currentStep: step });
  };

  const goBack = () => {
    if (session.currentStep > 0) {
      goToStep(session.currentStep - 1);
    }
  };

  return (
    <SessionContext.Provider value={{ session, updateSession, resetSession, goToStep, goBack }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
