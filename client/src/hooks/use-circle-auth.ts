import { useEffect, useState } from 'react';
import { circleUserDataSchema, type CircleUserData } from '@shared/schema';
import { setThemeFromCircle } from '@/components/theme-provider';

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

    // Vérification critique de la configuration
    if (!circleOrigin) {
      console.error('❌ VITE_CIRCLE_ORIGIN is not configured!');
      setState({
        isListening: false,
        userData: null,
        error: 'Configuration manquante: VITE_CIRCLE_ORIGIN non défini. Vérifiez vos secrets de production.',
      });
      return;
    }

    console.log('🔍 Waiting for Circle.so message from:', circleOrigin);

    const handleMessage = (event: MessageEvent) => {
      console.log('📨 Message received from:', event.origin);
      
      if (event.origin !== circleOrigin) {
        console.error('❌ Unauthorized origin:', event.origin, '(expected:', circleOrigin + ')');
        setState(prev => ({
          ...prev,
          error: `Origine non autorisée: ${event.origin}. Attendu: ${circleOrigin}`,
        }));
        return;
      }

      try {
        const data = circleUserDataSchema.parse(event.data);
        
        if (data.type === 'CIRCLE_USER_AUTH') {
          console.log('✅ Circle.so user data received');
          
          // Apply theme from Circle.so if provided
          if (data.theme) {
            console.log('🎨 Applying Circle.so theme:', data.theme);
            setThemeFromCircle(data.theme);
          }
          
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
