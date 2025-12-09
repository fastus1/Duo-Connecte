import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertCircle, Shield, LogIn, Lock, ExternalLink, Info } from 'lucide-react';
import { useCircleAuth } from '@/hooks/use-circle-auth';
import { PinCreationForm } from '@/components/pin-creation-form';
import { PinLoginForm } from '@/components/pin-login-form';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSessionToken } from '@/lib/auth';

type AuthStep = 'waiting' | 'validating' | 'new_user' | 'existing_user' | 'authenticated' | 'error' | 'public_landing' | 'paywall_blocked';

interface AppConfig {
  requireCircleDomain: boolean;
  requireCircleLogin: boolean;
  requirePaywall: boolean;
  requirePin: boolean;
  paywallPurchaseUrl: string;
  paywallInfoUrl: string;
  paywallTitle: string;
  paywallMessage: string;
}

interface PaywallInfo {
  paywallTitle: string;
  paywallMessage: string;
  paywallPurchaseUrl: string;
  paywallInfoUrl: string;
}

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { userData, error: circleError, isLoading } = useCircleAuth();
  const [authStep, setAuthStep] = useState<AuthStep>('waiting');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validatedData, setValidatedData] = useState<{
    public_uid?: string;
    email?: string;
    name?: string;
    is_admin?: boolean;
    validationToken?: string;
  } | null>(null);
  const [paywallInfo, setPaywallInfo] = useState<PaywallInfo | null>(null);
  const lastValidatedEmailRef = useRef<string | null>(null);

  // Fetch app security configuration
  const { data: appConfig, isLoading: configLoading } = useQuery<AppConfig>({
    queryKey: ['/api/config'],
  });

  // Dev mode is when Circle domain is NOT required
  const devMode = appConfig ? !appConfig.requireCircleDomain : false;

  // Helper functions defined before useEffect to avoid temporal dead zone errors
  
  const handleAuthSuccess = (sessionToken: string, userId: string, isAdmin?: boolean) => {
    localStorage.setItem('session_token', sessionToken);
    localStorage.setItem('user_id', userId);
    localStorage.setItem('session_timestamp', Date.now().toString());
    
    // Route based on user role - all users go to welcome page
    // Admins can access dashboard from the header
    setLocation('/welcome');
  };

  const handleError = (message: string) => {
    setError(message);
  };

  // Fetch paywall info directly (for paywall-only mode without Circle auth)
  const fetchPaywallInfo = async () => {
    try {
      const response = await fetch('/api/config');
      const config = await response.json();
      
      setPaywallInfo({
        paywallTitle: config.paywallTitle || 'Accès Réservé',
        paywallMessage: config.paywallMessage || 'Cette application est réservée aux membres payants.',
        paywallPurchaseUrl: config.paywallPurchaseUrl || '',
        paywallInfoUrl: config.paywallInfoUrl || '',
      });
      setAuthStep('paywall_blocked');
    } catch (err) {
      console.error('Error fetching paywall info:', err);
      setError('Erreur lors du chargement de la configuration');
      setAuthStep('error');
    }
  };

  // Check paywall access (Couche 3)
  const checkPaywallAccess = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/check-paywall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();

      if (!result.hasAccess) {
        setPaywallInfo({
          paywallTitle: result.paywallTitle || 'Accès Réservé',
          paywallMessage: result.paywallMessage || 'Cette application est réservée aux membres payants.',
          paywallPurchaseUrl: result.paywallPurchaseUrl || '',
          paywallInfoUrl: result.paywallInfoUrl || '',
        });
        setAuthStep('paywall_blocked');
        return false;
      }
      return true;
    } catch (err) {
      console.error('Paywall check error:', err);
      return true; // En cas d'erreur, on laisse passer (fail-open pour UX)
    }
  };

  const createUserWithoutPin = async (
    email: string,
    publicUid: string,
    name: string,
    validationToken: string,
    isAdmin: boolean
  ) => {
    try {
      const result = await fetch('/api/auth/create-user-no-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          public_uid: publicUid,
          name,
          validation_token: validationToken,
        }),
      }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la création du compte');
        }
        return data;
      });

      handleAuthSuccess(result.session_token, result.user_id, result.is_admin);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du compte');
      setAuthStep('error');
    }
  };

  const validateCircleData = async (userDataToValidate?: typeof userData) => {
    const dataToValidate = userDataToValidate || userData;
    if (!dataToValidate) return;

    setIsValidating(true);
    setError(null);

    try {
      const result = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: dataToValidate }),
      }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Erreur de validation');
        }
        return data;
      });

      // Check paywall (Couche 3) before continuing
      const paywallPassed = await checkPaywallAccess(dataToValidate.email);
      if (!paywallPassed) {
        return; // User blocked by paywall
      }

      // Auto-login: backend returns session token directly (PIN not required)
      if (result.status === 'auto_login' && result.session_token) {
        handleAuthSuccess(result.session_token, result.user_id, result.is_admin);
        return;
      }

      // Use name from result if available (for missing_pin case), otherwise from dataToValidate
      const userName = result.name || dataToValidate.name;
      
      setValidatedData({
        public_uid: result.user_id,
        email: result.email || dataToValidate.email,
        name: userName,
        is_admin: result.is_admin || false,
        validationToken: result.validation_token,
      });

      // New user without PIN requirement - auto-create account
      if (result.status === 'new_user' && result.requires_pin === false) {
        await createUserWithoutPin(
          dataToValidate.email,
          result.user_id,
          userName,
          result.validation_token,
          result.is_admin
        );
        return;
      }

      if (result.status === 'new_user' || result.status === 'missing_pin') {
        // Both new users and existing users without PIN need to create one
        setAuthStep('new_user');
      } else if (result.status === 'existing_user') {
        setAuthStep('existing_user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de validation');
      setAuthStep('error');
    } finally {
      setIsValidating(false);
    }
  };

  // Main authentication effect
  useEffect(() => {
    // Wait for config to load
    if (configLoading || !appConfig) return;

    // Check if user already has a valid session
    const existingToken = getSessionToken();
    if (existingToken) {
      // User is already logged in, redirect to welcome
      setLocation('/welcome');
      return;
    }

    // Public mode: all 4 layers disabled - go directly to welcome (no login required)
    const isPublicMode = !appConfig.requireCircleDomain && !appConfig.requireCircleLogin && !appConfig.requirePaywall && !appConfig.requirePin;
    if (isPublicMode) {
      setLocation('/welcome');
      return;
    }

    // Paywall-only mode: layers 1 and 2 disabled, but paywall enabled
    // Show paywall directly without Circle validation (no way to identify user)
    const isPaywallOnlyMode = !appConfig.requireCircleDomain && !appConfig.requireCircleLogin && appConfig.requirePaywall;
    if (isPaywallOnlyMode) {
      // Fetch paywall info and show paywall screen
      fetchPaywallInfo();
      return;
    }

    // Domain-only mode: only layer 1 enabled (requireCircleDomain = true)
    // User is on Circle domain but no login required - let them through
    const isDomainOnlyMode = appConfig.requireCircleDomain && !appConfig.requireCircleLogin && !appConfig.requirePaywall && !appConfig.requirePin;
    if (isDomainOnlyMode) {
      // User is on the Circle domain (otherwise they wouldn't reach this page via iframe)
      // No login required, just let them access the app
      setLocation('/welcome');
      return;
    }

    // Dev mode: Circle domain not required but Circle login is required - use mock data
    if (devMode && appConfig.requireCircleLogin) {
      const mockUserData = {
        publicUid: 'dev123',
        email: 'dev@example.com',
        name: 'Dev User',
        isAdmin: true,
        timestamp: Date.now(),
      };
      
      validateCircleData(mockUserData);
      return;
    }
    
    // Dev mode without Circle login - go directly to welcome
    if (devMode && !appConfig.requireCircleLogin && !appConfig.requirePaywall) {
      setLocation('/welcome');
      return;
    }

    if (circleError) {
      setError(circleError);
      setAuthStep('error');
      return;
    }

    if (userData) {
      // Prevent duplicate validation calls when Circle.so sends multiple messages
      if (lastValidatedEmailRef.current === userData.email) {
        return;
      }
      lastValidatedEmailRef.current = userData.email;
      validateCircleData(userData);
    }
  }, [userData, circleError, devMode, appConfig, configLoading]);

  // Show error message if Circle.so auth failed
  if (circleError && !devMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg" data-testid="card-timeout">
          <CardHeader className="text-center space-y-4">
            <Logo size="lg" className="mx-auto" />
            <CardTitle className="text-2xl font-semibold">
              Accès restreint
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground" data-testid="text-timeout-message">
              Vous devez accéder à cette page via la Plateforme Avancer Simplement
            </p>
            <Button
              asChild
              className="w-full h-12"
              data-testid="button-access-platform"
            >
              <a href="https://communaute.avancersimplement.com/" target="_top">
                Accéder à la plateforme
              </a>
            </Button>
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setLocation('/admin-login')}
                data-testid="button-admin-access"
              >
                <Shield className="h-4 w-4 mr-2" />
                Accès Administrateur
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if ((authStep === 'waiting' || isValidating || isLoading) && !circleError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg" data-testid="card-loading">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Logo size="lg" />
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-base text-muted-foreground">
              {devMode ? 'Initialisation du mode développement...' : 'Connexion en cours...'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Public landing page when all security layers are disabled
  if (authStep === 'public_landing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-md shadow-lg" data-testid="card-public-landing">
          <CardHeader className="text-center space-y-4">
            <Logo size="lg" className="mx-auto" />
            <CardTitle className="text-2xl font-semibold">
              Bienvenue
            </CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à votre espace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full h-12"
              onClick={() => setLocation('/admin-login')}
              data-testid="button-login"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Connexion
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authStep === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg" data-testid="card-error">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-semibold text-center">
              Erreur d'authentification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
              <AlertDescription data-testid="text-error-message">
                {error || 'Une erreur est survenue lors de la connexion'}
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full h-12"
              data-testid="button-retry"
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Paywall blocked screen (Couche 3)
  if (authStep === 'paywall_blocked' && paywallInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-md shadow-lg" data-testid="card-paywall">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold" data-testid="text-paywall-title">
              {paywallInfo.paywallTitle}
            </CardTitle>
            <CardDescription className="text-base" data-testid="text-paywall-message">
              {paywallInfo.paywallMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paywallInfo.paywallPurchaseUrl && (
              <Button
                asChild
                className="w-full h-12"
                data-testid="button-paywall-purchase"
              >
                <a href={paywallInfo.paywallPurchaseUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Acheter maintenant
                </a>
              </Button>
            )}
            {paywallInfo.paywallInfoUrl && (
              <Button
                asChild
                variant="outline"
                className="w-full h-12"
                data-testid="button-paywall-info"
              >
                <a href={paywallInfo.paywallInfoUrl} target="_blank" rel="noopener noreferrer">
                  <Info className="h-4 w-4 mr-2" />
                  Plus d'informations
                </a>
              </Button>
            )}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center">
                Vous avez déjà payé ? Rechargez la page après votre achat.
              </p>
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => window.location.reload()}
                data-testid="button-paywall-reload"
              >
                Actualiser
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40">
          <Alert variant="destructive" className="shadow-lg" data-testid="alert-error">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {authStep === 'new_user' && validatedData && (
        <PinCreationForm
          userName={validatedData.name || ''}
          userEmail={validatedData.email || ''}
          publicUid={validatedData.public_uid || ''}
          validationToken={validatedData.validationToken || ''}
          onSuccess={handleAuthSuccess}
          onError={handleError}
        />
      )}

      {authStep === 'existing_user' && validatedData && (
        <PinLoginForm
          userEmail={validatedData.email || ''}
          onSuccess={handleAuthSuccess}
          onError={handleError}
        />
      )}
    </div>
  );
}
