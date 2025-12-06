import { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { circleUserDataSchema, type CircleUserData } from '@shared/schema';
import { setThemeFromCircle } from '@/components/theme-provider';

interface CircleAuthState {
  isLoading: boolean;
  userData: CircleUserData['user'] | null;
  error: string | null;
}

interface AppConfig {
  requireCircleDomain: boolean;
  requireCircleLogin: boolean;
  requirePin: boolean;
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
    // Silent fail - cache not critical
  }
}

export function clearCircleUserCache(): void {
  localStorage.removeItem(CIRCLE_USER_STORAGE_KEY);
  localStorage.removeItem(CIRCLE_USER_TIMESTAMP_KEY);
}

export function useCircleAuth() {
  const { data: configData, isLoading: configLoading } = useQuery<AppConfig>({
    queryKey: ['/api/config'],
  });
  
  const [state, setState] = useState<CircleAuthState>({
    isLoading: true,
    userData: null,
    error: null,
  });

  const requestAuthFromParent = useCallback(() => {
    if (!CIRCLE_ORIGIN) return;
    
    try {
      window.parent.postMessage({ type: 'CIRCLE_AUTH_REQUEST' }, CIRCLE_ORIGIN);
    } catch {
      // Silent fail - parent may not be available
    }
  }, []);

  useEffect(() => {
    // Wait for config to load
    if (configLoading) return;
    
    const requireCircleDomain = configData?.requireCircleDomain ?? true;

    // Reset state when config changes
    setState({
      isLoading: requireCircleDomain,
      userData: null,
      error: null,
    });

    if (!requireCircleDomain) {
      clearCircleUserCache();
      return;
    }

    if (!CIRCLE_ORIGIN) {
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
      setState({
        isLoading: false,
        userData: cachedUser,
        error: null,
      });
      // Still request fresh data in background
      requestAuthFromParent();
    }

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
          messageReceived = true;
          
          // Cache the user data for future refreshes
          setCachedUserData(data.user);
          
          if (data.theme) {
            setThemeFromCircle(data.theme);
          }
          
          setState({
            isLoading: false,
            userData: data.user,
            error: null,
          });
        }
      } catch {
        // Invalid data format - ignore
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
          setState({
            isLoading: false,
            userData: null,
            error: 'Accès depuis Circle.so requis. Veuillez vous connecter à votre communauté.',
          });
          return;
        }
        
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
  }, [configData?.requireCircleDomain, configLoading, requestAuthFromParent]);

  return state;
}
