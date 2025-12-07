import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  senderName: '',
  receiverName: '',
  currentStep: 0,
  lastUpdated: new Date().toISOString(),
};

// Charger les noms sauvegardés depuis localStorage
const loadSavedNames = (): Pick<SessionState, 'senderName' | 'receiverName'> => {
  try {
    const savedNames = localStorage.getItem('duo-connecte-names');
    if (savedNames) {
      const parsed = JSON.parse(savedNames);
      return {
        senderName: parsed.senderName || '',
        receiverName: parsed.receiverName || '',
      };
    }
  } catch (error) {
    console.error('Erreur lors du chargement des noms:', error);
  }
  return { senderName: '', receiverName: '' };
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const savedNames = loadSavedNames();
  const [session, setSession] = useState<SessionState>({
    ...defaultSession,
    ...savedNames,
  });

  const updateSession = (updates: Partial<SessionState>) => {
    setSession(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  };

  // Sauvegarder les noms dans localStorage quand ils changent
  useEffect(() => {
    if (session.senderName || session.receiverName) {
      try {
        localStorage.setItem('duo-connecte-names', JSON.stringify({
          senderName: session.senderName,
          receiverName: session.receiverName,
        }));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des noms:', error);
      }
    }
  }, [session.senderName, session.receiverName]);

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
