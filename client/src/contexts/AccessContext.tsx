import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

type AccessStatus = 'loading' | 'granted' | 'denied' | 'origin_invalid';

interface AccessContextType {
  accessStatus: AccessStatus;
  userEmail: string | null;
  circleIsAdmin: boolean;
  appEnvironment: 'development' | 'production';
  circleOnlyMode: boolean;
  isBootstrapped: boolean;
  checkAccess: () => Promise<void>;
  refreshEnvironment: () => Promise<'development' | 'production'>;
  forceRecheck: () => void;
}

const ALLOWED_ORIGIN = 'https://communaute.avancersimplement.com';

interface CircleUserMessage {
  type: 'CIRCLE_USER_AUTH';
  theme?: string;
  user?: {
    email?: string;
    name?: string;
    isAdmin?: boolean;
  };
}

declare global {
  interface Window {
    __CIRCLE_USER_EMAIL__: string | null;
    __CIRCLE_ORIGIN_VALIDATED__: boolean;
  }
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

const USER_EMAIL_KEY = 'duo-connecte-user-email';

function getStoredEmail(): string | null {
  try {
    return localStorage.getItem(USER_EMAIL_KEY);
  } catch {
    return null;
  }
}

function storeEmail(email: string) {
  try {
    localStorage.setItem(USER_EMAIL_KEY, email);
  } catch {
    // localStorage non disponible
  }
}

export function AccessProvider({ children }: { children: ReactNode }) {
  const [accessStatus, setAccessStatus] = useState<AccessStatus>('loading');
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return window.__CIRCLE_USER_EMAIL__ ?? getStoredEmail();
  });
  const [circleIsAdmin, setCircleIsAdmin] = useState<boolean>(false);
  const [appEnvironment, setAppEnvironment] = useState<'development' | 'production'>('development');
  const [circleOnlyMode, setCircleOnlyMode] = useState<boolean>(false);
  const [originValidated, setOriginValidated] = useState<boolean>(() => {
    return window.__CIRCLE_ORIGIN_VALIDATED__ ?? false;
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [recheckTrigger, setRecheckTrigger] = useState(0);
  const lastProcessedEmailRef = useRef<string | null>(null);
  const circleOnlyModeRef = useRef<boolean>(false);
  const originTimeoutRef = useRef<number | null>(null);

  // Garder la ref synchronisée avec l'état
  circleOnlyModeRef.current = circleOnlyMode;

  // Récupérer l'environnement de l'app depuis le backend
  const refreshEnvironment = useCallback(async (): Promise<'development' | 'production'> => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        const env = data.environment || 'development';
        const circleOnly = data.circleOnlyMode ?? false;
        setAppEnvironment(env);
        setCircleOnlyMode(circleOnly);
        circleOnlyModeRef.current = circleOnly;
        setSettingsLoaded(true);
        return env;
      }
    } catch (error) {
      console.error('Error fetching app settings:', error);
    }
    setSettingsLoaded(true);
    return 'development';
  }, []);

  // Vérifier l'accès
  const checkAccess = useCallback(async () => {
    setAccessStatus('loading');

    // Récupérer l'environnement actuel
    const currentEnv = await refreshEnvironment();

    // Si mode Circle.so uniquement et origine non validée
    if (circleOnlyModeRef.current && !originValidated && !window.__CIRCLE_ORIGIN_VALIDATED__) {
      // L'accès sera refusé après le timeout si aucun message Circle.so valide n'est reçu
      setAccessStatus('loading');
      setIsInitialized(true);
      return;
    }

    // Si pas d'email
    if (!userEmail) {
      // En mode développement sans email, accorder l'accès par défaut
      if (currentEnv === 'development') {
        setAccessStatus('granted');
      } else {
        // En mode production sans email, refuser l'accès
        setAccessStatus('denied');
      }
      setIsInitialized(true);
      return;
    }

    // Avec email, vérifier l'accès via le backend
    try {
      const response = await fetch('/api/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessStatus(data.hasAccess ? 'granted' : 'denied');
        setAppEnvironment(data.mode || 'development');
      } else {
        setAccessStatus('denied');
      }
    } catch (error) {
      console.error('Error checking access:', error);
      // En cas d'erreur, refuser l'accès
      setAccessStatus('denied');
    }

    setIsInitialized(true);
  }, [userEmail, refreshEnvironment, originValidated]);

  // Écouter les messages de Circle.so pour recevoir l'email
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as CircleUserMessage;

      // Vérifier si c'est un message de type CIRCLE_USER_AUTH
      if (data?.type !== 'CIRCLE_USER_AUTH') {
        return;
      }

      // Vérifier l'origine si le mode Circle uniquement est activé
      if (circleOnlyModeRef.current) {
        if (event.origin !== ALLOWED_ORIGIN) {
          return;
        } else {
          // Origine valide - marquer comme validée
          setOriginValidated(true);
          window.__CIRCLE_ORIGIN_VALIDATED__ = true;

          // Annuler le timeout de rejet
          if (originTimeoutRef.current) {
            clearTimeout(originTimeoutRef.current);
            originTimeoutRef.current = null;
          }
        }
      }

      if (data.user?.email) {
        const email = data.user.email;

        // Ignorer les messages dupliqués avec le même email
        if (email === lastProcessedEmailRef.current) {
          return;
        }

        lastProcessedEmailRef.current = email;
        setUserEmail(email);
        storeEmail(email);
        window.__CIRCLE_USER_EMAIL__ = email;
        
        // Stocker le statut admin de Circle.so
        if (data.user.isAdmin === true) {
          setCircleIsAdmin(true);
        }
      }

      // Forcer une re-vérification immédiate
      setRecheckTrigger(prev => prev + 1);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Timeout pour rejeter l'accès si aucun message Circle.so valide n'est reçu
  useEffect(() => {
    if (settingsLoaded && circleOnlyMode && !originValidated && !window.__CIRCLE_ORIGIN_VALIDATED__) {
      // Donner 3 secondes pour recevoir un message Circle.so valide
      originTimeoutRef.current = window.setTimeout(() => {
        if (!originValidated && !window.__CIRCLE_ORIGIN_VALIDATED__) {
          setAccessStatus('origin_invalid');
        }
      }, 3000);

      return () => {
        if (originTimeoutRef.current) {
          clearTimeout(originTimeoutRef.current);
        }
      };
    }
  }, [settingsLoaded, circleOnlyMode, originValidated]);

  // Fonction pour forcer une re-vérification de l'accès
  const forceRecheck = useCallback(() => {
    setRecheckTrigger(prev => prev + 1);
  }, []);

  // Vérifier l'accès au chargement, quand l'email change, ou quand une re-vérification est demandée
  useEffect(() => {
    checkAccess();
  }, [checkAccess, recheckTrigger, originValidated]);

  // isBootstrapped est true quand l'état d'accès est déterminé (pas loading)
  const isBootstrapped = accessStatus !== 'loading';

  return (
    <AccessContext.Provider value={{
      accessStatus,
      userEmail,
      circleIsAdmin,
      appEnvironment,
      circleOnlyMode,
      isBootstrapped,
      checkAccess,
      refreshEnvironment,
      forceRecheck,
    }}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess() {
  const context = useContext(AccessContext);
  if (context === undefined) {
    throw new Error('useAccess must be used within an AccessProvider');
  }
  return context;
}
