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
const CIRCLE_USER_STORAGE_KEY = 'circle_user_data';
const CIRCLE_USER_TIMESTAMP_KEY = 'circle_user_timestamp';
const MAX_CACHE_AGE_MS = 60 * 60 * 1000; // 1 hour max cache

function getCachedUserData(): CircleUserData['user'] | null {
  try {
    const timestamp = localStorage.getItem(CIRCLE_USER_TIMESTAMP_KEY);
    const data = localStorage.getItem(CIRCLE_USER_STORAGE_KEY);
    
    if (!timestamp || !data) return null;
    
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > MAX_CACHE_AGE_MS) {
      localStorage.removeItem(CIRCLE_USER_STORAGE_KEY);
      localStorage.removeItem(CIRCLE_USER_TIMESTAMP_KEY);
      return null;
    }
    
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function setCachedUserData(userData: CircleUserData['user']): void {
  try {
    localStorage.setItem(CIRCLE_USER_STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(CIRCLE_USER_TIMESTAMP_KEY, Date.now().toString());
  } catch {
    console.error('Failed to cache Circle.so user data');
  }
}

export function clearCircleUserCache(): void {
  localStorage.removeItem(CIRCLE_USER_STORAGE_KEY);
  localStorage.removeItem(CIRCLE_USER_TIMESTAMP_KEY);
}

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
      clearCircleUserCache();
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

    // Check for cached user data first
    const cachedUser = getCachedUserData();
    if (cachedUser) {
      console.log('📦 Using cached Circle.so user data');
      setState({
        isLoading: false,
        userData: cachedUser,
        error: null,
      });
      // Still request fresh data in background
      requestAuthFromParent();
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
          console.log('✅ Circle.so user data received (fresh)');
          messageReceived = true;
          
          // Cache the user data for future refreshes
          setCachedUserData(data.user);
          
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

    // Only start retry mechanism if no cached data
    if (!cachedUser) {
      requestAuthFromParent();

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
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [mode, requestAuthFromParent]);

  return state;
}
