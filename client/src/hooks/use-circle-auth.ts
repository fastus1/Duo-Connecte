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
  const normalizedOrigin = origin.replace(/\/$/, '').toLowerCase();
  
  // Accept configured origin
  if (CIRCLE_ORIGIN) {
    const normalizedConfigured = CIRCLE_ORIGIN.replace(/\/$/, '').toLowerCase();
    if (normalizedOrigin === normalizedConfigured) {
      return true;
    }
  }
  
  // Accept common Circle.so domains
  const allowedPatterns = [
    /^https:\/\/[a-z0-9-]+\.circle\.so$/,
    /^https:\/\/app\.circle\.so$/,
    /^https:\/\/communaute\.avancersimplement\.com$/,
  ];
  
  return allowedPatterns.some(pattern => pattern.test(normalizedOrigin));
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

  // Detect parent origin from referrer or use configured value
  const parentOrigin = useMemo(() => {
    const detected = getParentOrigin();
    console.log(`[Circle Auth] Detected parent origin: ${detected}, configured: ${CIRCLE_ORIGIN}`);
    return detected || CIRCLE_ORIGIN || null;
  }, []);

  const requestAuthFromParent = useCallback(() => {
    if (!parentOrigin) {
      console.log('[Circle Auth] No parent origin available for postMessage');
      return;
    }
    
    try {
      console.log(`[Circle Auth] Sending CIRCLE_AUTH_REQUEST to ${parentOrigin}`);
      window.parent.postMessage({ type: 'CIRCLE_AUTH_REQUEST' }, parentOrigin);
    } catch (err) {
      console.log('[Circle Auth] Failed to send postMessage:', err);
    }
  }, [parentOrigin]);

  useEffect(() => {
    // Wait for config to load
    if (configLoading) return;
    
    const requireCircleDomain = configData?.requireCircleDomain ?? true;
    const requireCircleLogin = configData?.requireCircleLogin ?? true;
    
    // We need Circle handshake if domain OR login is required
    const needsCircleHandshake = requireCircleDomain || requireCircleLogin;

    console.log(`[Circle Auth] Config - requireCircleDomain: ${requireCircleDomain}, requireCircleLogin: ${requireCircleLogin}, needsHandshake: ${needsCircleHandshake}`);

    // Reset state
    setState({
      isLoading: needsCircleHandshake,
      userData: null,
      error: null,
    });

    if (!needsCircleHandshake) {
      console.log('[Circle Auth] No handshake needed - layers disabled');
      clearCircleUserCache();
      return;
    }

    if (!parentOrigin && !CIRCLE_ORIGIN) {
      console.log('[Circle Auth] No Circle origin available');
      setState({
        isLoading: false,
        userData: null,
        error: 'Configuration manquante: origine Circle.so non détectée.',
      });
      return;
    }

    console.log(`[Circle Auth] Starting handshake, parent: ${parentOrigin}`);

    // Check cache first
    const cachedUser = getCachedUserData();
    if (cachedUser) {
      console.log('[Circle Auth] Using cached user:', cachedUser.email);
      setState({
        isLoading: false,
        userData: cachedUser,
        error: null,
      });
      requestAuthFromParent();
    }

    let messageReceived = false;
    let retryCount = 0;
    const MAX_RETRIES = 10;
    const RETRY_INTERVAL = 500;

    const handleMessage = (event: MessageEvent) => {
      console.log(`[Circle Auth] Message from: ${event.origin}`);
      
      // Validate origin - accept any valid Circle domain
      if (!isValidCircleOrigin(event.origin)) {
        console.log(`[Circle Auth] Origin ${event.origin} not recognized as Circle - ignoring`);
        return;
      }

      console.log('[Circle Auth] Valid Circle origin, parsing data:', typeof event.data);

      try {
        const data = circleUserDataSchema.parse(event.data);
        
        if (data.type === 'CIRCLE_USER_AUTH') {
          messageReceived = true;
          console.log('[Circle Auth] Received user data:', data.user.email);
          
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
        console.log('[Circle Auth] Parse error:', err);
      }
    };

    window.addEventListener('message', handleMessage);

    if (!cachedUser) {
      console.log('[Circle Auth] Starting retry loop');
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
          console.log('[Circle Auth] Timeout - no Circle response');
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
