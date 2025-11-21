import { useEffect, useState } from 'react';
import { circleUserDataSchema, type CircleUserData } from '@shared/schema';

interface CircleAuthState {
  isListening: boolean;
  userData: CircleUserData['user'] | null;
  error: string | null;
}

export function useCircleAuth() {
  const [state, setState] = useState<CircleAuthState>({
    isListening: false,
    userData: null,
    error: null,
  });

  useEffect(() => {
    const devMode = import.meta.env.VITE_DEV_MODE === 'true';
    const circleOrigin = import.meta.env.VITE_CIRCLE_ORIGIN;

    if (devMode) {
      console.log('🔧 DEV MODE: Circle.so authentication bypassed');
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (circleOrigin && event.origin !== circleOrigin) {
        console.error('❌ Unauthorized origin:', event.origin);
        setState(prev => ({
          ...prev,
          error: 'Origine non autorisée',
        }));
        return;
      }

      try {
        const data = circleUserDataSchema.parse(event.data);
        
        if (data.type === 'CIRCLE_USER_AUTH') {
          console.log('✅ Circle.so user data received');
          setState({
            isListening: true,
            userData: data.user,
            error: null,
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

    return () => {
      window.removeEventListener('message', handleMessage);
      setState(prev => ({ ...prev, isListening: false }));
    };
  }, []);

  return state;
}
