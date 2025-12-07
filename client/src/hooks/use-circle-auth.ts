import { useEffect, useState, useCallback, useMemo } from 'react';
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
const MAX_CACHE_AGE_MS = 60 * 60 * 1000;

function getParentOrigin(): string | null {
  try {
    if (document.referrer) {
      const url = new URL(document.referrer);
      return url.origin;
    }
  } catch {
    // Invalid referrer
  }
  return null;
}

function isValidCircleOrigin(origin: string): boolean {
  if (!origin) return false;
  
  const normalizedOrigin = origin.replace(/\/$/, '').toLowerCase();
  
  // Accept configured origin
  if (CIRCLE_ORIGIN) {
    const normalizedConfigured = CIRCLE_ORIGIN.replace(/\/$/, '').toLowerCase();
    if (normalizedOrigin === normalizedConfigured) {
      return true;
    }
  }
  
  // Accept any Circle.so domain (including custom subdomains)
  if (normalizedOrigin.includes('circle.so')) {
    return true;
  }
  
  // Accept communaute.avancersimplement.com
  if (normalizedOrigin.includes('avancersimplement.com')) {
    return true;
  }
  
  // In development, be more permissive
  if (import.meta.env.DEV) {
    return true;
  }
  
  return false;
}

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

  // Detect parent origin - use '*' as fallback to be permissive like the old app
  const parentOrigin = useMemo(() => {
    const detected = getParentOrigin();
    return detected || CIRCLE_ORIGIN || '*';
  }, []);

  const requestAuthFromParent = useCallback(() => {
    try {
      window.parent.postMessage({ type: 'CIRCLE_AUTH_REQUEST' }, parentOrigin);
    } catch {
      // Silent fail - parent may not be available
    }
  }, [parentOrigin]);

  useEffect(() => {
    // Wait for config to load
    if (configLoading) return;
    
    const requireCircleDomain = configData?.requireCircleDomain ?? true;
    const requireCircleLogin = configData?.requireCircleLogin ?? true;
    
    // We need Circle handshake if domain OR login is required
    const needsCircleHandshake = requireCircleDomain || requireCircleLogin;

    // Reset state
    setState({
      isLoading: needsCircleHandshake,
      userData: null,
      error: null,
    });

    if (!needsCircleHandshake) {
      clearCircleUserCache();
      return;
    }

    // Check cache first
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
      // Be permissive with origin validation - accept if it looks like Circle data
      const hasCircleData = event.data && event.data.type === 'CIRCLE_USER_AUTH';
      
      if (!hasCircleData) {
        return;
      }
      
      try {
        const data = circleUserDataSchema.parse(event.data);
        
        if (data.type === 'CIRCLE_USER_AUTH') {
          messageReceived = true;
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
        // Try to extract email directly as fallback
        if (event.data?.user?.email) {
          const fallbackUser = {
            publicUid: event.data.user.publicUid || '',
            email: event.data.user.email,
            name: event.data.user.name || 'Membre',
            isAdmin: event.data.user.isAdmin === true || event.data.user.isAdmin === 'true',
            timestamp: Date.now(),
          };
          messageReceived = true;
          setCachedUserData(fallbackUser);
          setState({
            isLoading: false,
            userData: fallbackUser,
            error: null,
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);

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
  }, [configData?.requireCircleDomain, configData?.requireCircleLogin, configLoading, parentOrigin, requestAuthFromParent]);

  return state;
}
