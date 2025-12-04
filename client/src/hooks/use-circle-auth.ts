import { useEffect, useState, useRef } from 'react';
import { circleUserDataSchema, type CircleUserData } from '@shared/schema';
import { setThemeFromCircle } from '@/components/theme-provider';
import { useConfig } from '@/contexts/config-context';

interface CircleAuthState {
  isListening: boolean;
  userData: CircleUserData['user'] | null;
  error: string | null;
  timedOut: boolean;
}

const CIRCLE_AUTH_TIMEOUT_MS = 3000; // 3 seconds timeout

export function useCircleAuth() {
  const { mode } = useConfig();
  const [state, setState] = useState<CircleAuthState>({
    isListening: false,
    userData: null,
    error: null,
    timedOut: false,
  });
  const messageReceived = useRef(false);

  useEffect(() => {
    const devMode = mode === 'dev';
    const circleOrigin = import.meta.env.VITE_CIRCLE_ORIGIN;

    // Reset state when mode changes
    messageReceived.current = false;
    setState({
      isListening: false,
      userData: null,
      error: null,
      timedOut: false,
    });

    if (devMode) {
      console.log('🔧 DEV MODE: Circle.so authentication bypassed');
      return;
    }

    // Vérification critique de la configuration
    if (!circleOrigin) {
      console.error('❌ VITE_CIRCLE_ORIGIN is not configured!');
      setState({
        isListening: false,
        userData: null,
        error: 'Configuration manquante: VITE_CIRCLE_ORIGIN non défini. Vérifiez vos secrets de production.',
        timedOut: false,
      });
      return;
    }

    console.log('🔍 Waiting for Circle.so message from:', circleOrigin);
    console.log('⏱️ Timeout set to', CIRCLE_AUTH_TIMEOUT_MS, 'ms');

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
          messageReceived.current = true;
          
          // Apply theme from Circle.so if provided
          if (data.theme) {
            console.log('🎨 Applying Circle.so theme:', data.theme);
            setThemeFromCircle(data.theme);
          }
          
          setState({
            isListening: true,
            userData: data.user,
            error: null,
            timedOut: false,
          });
        }
      } catch (error) {
        console.error('❌ Invalid Circle.so data:', error);
        setState(prev => ({
          ...prev,
          error: 'Données invalides reçues de Circle.so',
        }));
      }
    };

    window.addEventListener('message', handleMessage);
    setState(prev => ({ ...prev, isListening: true }));

    // Timeout: if no message received after CIRCLE_AUTH_TIMEOUT_MS, show error
    const timeoutId = setTimeout(() => {
      if (!messageReceived.current) {
        console.error('⏱️ Timeout: No Circle.so message received after', CIRCLE_AUTH_TIMEOUT_MS, 'ms');
        console.error('🚫 Access blocked: App must be accessed from Circle.so iframe');
        setState(prev => ({
          ...prev,
          timedOut: true,
          error: 'Cette application doit être accédée depuis Circle.so. Veuillez vous connecter à votre communauté Circle.so.',
        }));
      }
    }, CIRCLE_AUTH_TIMEOUT_MS);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timeoutId);
      setState(prev => ({ ...prev, isListening: false }));
    };
  }, [mode]);

  return state;
}
