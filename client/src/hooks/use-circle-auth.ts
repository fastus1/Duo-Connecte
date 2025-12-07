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
    const requireCircleLogin = configData?.requireCircleLogin ?? true;
    
    // Determine if we need Circle.so handshake
    // We need it if either domain check OR login is required
    const needsCircleHandshake = requireCircleDomain || requireCircleLogin;

    console.log(`[Circle Auth] Config loaded - requireCircleDomain: ${requireCircleDomain}, requireCircleLogin: ${requireCircleLogin}, needsCircleHandshake: ${needsCircleHandshake}`);

    // Reset state when config changes
    setState({
      isLoading: needsCircleHandshake,
      userData: null,
      error: null,
    });

    // If neither domain nor login is required, no handshake needed
    if (!needsCircleHandshake) {
      console.log('[Circle Auth] No Circle handshake needed - both layers disabled');
      clearCircleUserCache();
      return;
    }

    if (!CIRCLE_ORIGIN) {
      console.log('[Circle Auth] VITE_CIRCLE_ORIGIN not configured');
      setState({
        isLoading: false,
        userData: null,
        error: 'Configuration manquante: VITE_CIRCLE_ORIGIN non défini.',
      });
      return;
    }

    console.log(`[Circle Auth] Starting Circle.so handshake with origin: ${CIRCLE_ORIGIN}`);

    // Check for cached user data first
    const cachedUser = getCachedUserData();
    if (cachedUser) {
      console.log('[Circle Auth] Found cached user data:', cachedUser.email);
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
      // Log all incoming messages for debugging
      console.log(`[Circle Auth] Received message from origin: ${event.origin}, expected: ${CIRCLE_ORIGIN}`);
      
      // Check if origin matches (with flexible matching for trailing slashes)
      const expectedOrigin = CIRCLE_ORIGIN.replace(/\/$/, '');
      const actualOrigin = event.origin.replace(/\/$/, '');
      
      if (actualOrigin !== expectedOrigin) {
        console.log(`[Circle Auth] Origin mismatch - ignoring message`);
        return;
      }

      try {
        console.log('[Circle Auth] Parsing message data:', event.data);
        const data = circleUserDataSchema.parse(event.data);
        
        if (data.type === 'CIRCLE_USER_AUTH') {
          messageReceived = true;
          console.log('[Circle Auth] Valid Circle user data received:', data.user.email);
          
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
      } catch (err) {
        console.log('[Circle Auth] Failed to parse message:', err);
        // Invalid data format - ignore
      }
    };

    window.addEventListener('message', handleMessage);

    // Only start retry mechanism if no cached data
    if (!cachedUser) {
      console.log('[Circle Auth] No cached data - starting retry mechanism');
      requestAuthFromParent();

      const retryInterval = setInterval(() => {
        if (messageReceived) {
          clearInterval(retryInterval);
          return;
        }
        
        retryCount++;
        console.log(`[Circle Auth] Retry ${retryCount}/${MAX_RETRIES}`);
        
        if (retryCount >= MAX_RETRIES) {
          clearInterval(retryInterval);
          console.log('[Circle Auth] Max retries reached - no valid Circle message received');
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
  }, [configData?.requireCircleDomain, configData?.requireCircleLogin, configLoading, requestAuthFromParent]);

  return state;
}
