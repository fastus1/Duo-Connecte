import { useEffect, useState, useCallback } from 'react';
import { circleUserDataSchema, type CircleUserData } from '@shared/schema';
import { setThemeFromCircle } from '@/components/theme-provider';
import { useConfig } from '@/contexts/config-context';

interface CircleAuthState {
  isLoading: boolean;
  userData: CircleUserData['user'] | null;
  error: string | null;
}

const CIRCLE_ORIGIN = import.meta.env.VITE_CIRCLE_ORIGIN;

export function useCircleAuth() {
  const { mode } = useConfig();
  const [state, setState] = useState<CircleAuthState>({
    isLoading: true,
    userData: null,
    error: null,
  });

  const requestAuthFromParent = useCallback(() => {
    if (!CIRCLE_ORIGIN) return;
    
    try {
      console.log('📤 Requesting auth from Circle.so parent...');
      window.parent.postMessage({ type: 'CIRCLE_AUTH_REQUEST' }, CIRCLE_ORIGIN);
    } catch (e) {
      console.error('❌ Failed to send auth request:', e);
    }
  }, []);

  useEffect(() => {
    const devMode = mode === 'dev';

    // Reset state when mode changes
    setState({
      isLoading: !devMode,
      userData: null,
      error: null,
    });

    if (devMode) {
      console.log('🔧 DEV MODE: Circle.so authentication bypassed');
      return;
    }

    if (!CIRCLE_ORIGIN) {
      console.error('❌ VITE_CIRCLE_ORIGIN is not configured!');
      setState({
        isLoading: false,
        userData: null,
        error: 'Configuration manquante: VITE_CIRCLE_ORIGIN non défini.',
      });
      return;
    }

    console.log('🔍 Setting up Circle.so auth listener for:', CIRCLE_ORIGIN);

    let messageReceived = false;
    let retryCount = 0;
    const MAX_RETRIES = 10;
    const RETRY_INTERVAL = 500;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== CIRCLE_ORIGIN) {
        return;
      }

      try {
        const data = circleUserDataSchema.parse(event.data);
        
        if (data.type === 'CIRCLE_USER_AUTH') {
          console.log('✅ Circle.so user data received');
          messageReceived = true;
          
          if (data.theme) {
            console.log('🎨 Applying Circle.so theme:', data.theme);
            setThemeFromCircle(data.theme);
          }
          
          setState({
            isLoading: false,
            userData: data.user,
            error: null,
          });
        }
      } catch (error) {
        console.error('❌ Invalid Circle.so data:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    // Request auth data immediately
    requestAuthFromParent();

    // Retry mechanism
    const retryInterval = setInterval(() => {
      if (messageReceived) {
        clearInterval(retryInterval);
        return;
      }
      
      retryCount++;
      
      if (retryCount >= MAX_RETRIES) {
        clearInterval(retryInterval);
        console.error('⏱️ Timeout: No Circle.so response after', MAX_RETRIES, 'attempts');
        setState({
          isLoading: false,
          userData: null,
          error: 'Accès depuis Circle.so requis. Veuillez vous connecter à votre communauté.',
        });
        return;
      }
      
      console.log(`📤 Retry ${retryCount}/${MAX_RETRIES}...`);
      requestAuthFromParent();
    }, RETRY_INTERVAL);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(retryInterval);
    };
  }, [mode, requestAuthFromParent]);

  return state;
}
