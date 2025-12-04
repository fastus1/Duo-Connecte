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

const CIRCLE_AUTH_TIMEOUT_MS = 5000; // 5 seconds timeout (fallback only)
const AUTH_REQUEST_RETRY_MS = 500; // Retry request every 500ms
const MAX_RETRIES = 10; // Max retries before timeout

export function useCircleAuth() {
  const { mode } = useConfig();
  const [state, setState] = useState<CircleAuthState>({
    isListening: false,
    userData: null,
    error: null,
    timedOut: false,
  });
  const messageReceived = useRef(false);
  const retryCount = useRef(0);

  useEffect(() => {
    const devMode = mode === 'dev';
    const circleOrigin = import.meta.env.VITE_CIRCLE_ORIGIN;

    // Reset state when mode changes
    messageReceived.current = false;
    retryCount.current = 0;
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

    console.log('🔍 Setting up Circle.so auth listener for:', circleOrigin);

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

    // Request auth data from Circle.so parent (handshake)
    const requestAuthFromParent = () => {
      if (messageReceived.current) return;
      
      retryCount.current++;
      console.log(`📤 Requesting auth from Circle.so (attempt ${retryCount.current}/${MAX_RETRIES})...`);
      
      try {
        window.parent.postMessage({ type: 'CIRCLE_AUTH_REQUEST' }, circleOrigin);
      } catch (e) {
        console.error('❌ Failed to send auth request to parent:', e);
      }
    };

    // Initial request
    requestAuthFromParent();

    // Retry interval
    const retryInterval = setInterval(() => {
      if (messageReceived.current) {
        clearInterval(retryInterval);
        return;
      }
      
      if (retryCount.current >= MAX_RETRIES) {
        clearInterval(retryInterval);
        console.error('⏱️ Timeout: No Circle.so response after', MAX_RETRIES, 'attempts');
        setState(prev => ({
          ...prev,
          timedOut: true,
          error: 'Cette application doit être accédée depuis Circle.so. Veuillez vous connecter à votre communauté Circle.so.',
        }));
        return;
      }
      
      requestAuthFromParent();
    }, AUTH_REQUEST_RETRY_MS);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(retryInterval);
      setState(prev => ({ ...prev, isListening: false }));
    };
  }, [mode]);

  return state;
}
