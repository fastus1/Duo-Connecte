import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { circleUserDataSchema, type CircleUserData } from '@shared/schema';
import { setThemeFromCircle } from '@/components/theme-provider';
import { useConfig } from '@/contexts/config-context';

type BlockedReason = 'origin' | null;

interface CircleAuthState {
  userData: CircleUserData['user'] | null;
  error: string | null;
  blocked: BlockedReason;
  isLoading: boolean;
  theme: 'light' | 'dark' | null;
}

const TIMEOUT_MS = 3000;

const CircleAuthContext = createContext<CircleAuthState | undefined>(undefined);

interface CircleAuthProviderProps {
  children: ReactNode;
}

export function CircleAuthProvider({ children }: CircleAuthProviderProps) {
  const { mode } = useConfig();
  const [state, setState] = useState<CircleAuthState>({
    userData: null,
    error: null,
    blocked: null,
    isLoading: true,
    theme: null,
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageReceivedRef = useRef(false);

  useEffect(() => {
    messageReceivedRef.current = false;
    
    setState({
      userData: null,
      error: null,
      blocked: null,
      isLoading: true,
      theme: null,
    });

    const devMode = mode === 'dev';
    const circleOrigin = import.meta.env.VITE_CIRCLE_ORIGIN;

    if (devMode) {
      console.log('🔧 DEV MODE: Circle.so authentication bypassed');
      const mockUserData = {
        publicUid: 'dev123',
        email: 'dev@example.com',
        name: 'Dev User',
        firstName: 'Dev',
        lastName: 'User',
        isAdmin: true,
        timestamp: Date.now(),
      };
      setState({
        userData: mockUserData,
        error: null,
        blocked: null,
        isLoading: false,
        theme: null,
      });
      return;
    }

    if (!circleOrigin) {
      console.error('❌ VITE_CIRCLE_ORIGIN is not configured!');
      setState({
        userData: null,
        error: 'Configuration manquante: VITE_CIRCLE_ORIGIN non défini.',
        blocked: 'origin',
        isLoading: false,
        theme: null,
      });
      return;
    }

    console.log('🔍 Waiting for Circle.so message from:', circleOrigin);
    console.log('⏱️ Timeout set to', TIMEOUT_MS, 'ms');

    const handleMessage = (event: MessageEvent) => {
      console.log('📨 Message received from:', event.origin);
      
      if (event.origin !== circleOrigin) {
        console.error('❌ Unauthorized origin:', event.origin, '(expected:', circleOrigin + ')');
        return;
      }

      try {
        const data = circleUserDataSchema.parse(event.data);
        
        if (data.type === 'CIRCLE_USER_AUTH') {
          console.log('✅ Circle.so user data received');
          messageReceivedRef.current = true;
          
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          
          if (data.theme) {
            console.log('🎨 Applying Circle.so theme:', data.theme);
            setThemeFromCircle(data.theme);
          }
          
          setState({
            userData: data.user,
            error: null,
            blocked: null,
            isLoading: false,
            theme: data.theme || null,
          });
        }
      } catch (error) {
        console.error('❌ Invalid Circle.so data:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    timeoutRef.current = setTimeout(() => {
      if (!messageReceivedRef.current) {
        console.error('⏱️ Timeout: No Circle.so message received after', TIMEOUT_MS, 'ms');
        console.error('🚫 Access blocked: App must be accessed from Circle.so iframe');
        setState(prev => ({
          ...prev,
          blocked: 'origin',
          isLoading: false,
          error: 'Cette application est accessible uniquement depuis Circle.so',
        }));
      }
    }, TIMEOUT_MS);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      messageReceivedRef.current = false;
    };
  }, [mode]);

  return (
    <CircleAuthContext.Provider value={state}>
      {children}
    </CircleAuthContext.Provider>
  );
}

export function useCircleAuth() {
  const context = useContext(CircleAuthContext);
  if (!context) {
    throw new Error('useCircleAuth must be used within CircleAuthProvider');
  }
  return context;
}
