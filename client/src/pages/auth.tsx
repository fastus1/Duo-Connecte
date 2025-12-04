import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Loader2, AlertCircle } from 'lucide-react';
import { useCircleAuth } from '@/hooks/use-circle-auth';
import { useConfig } from '@/contexts/config-context';
import { PinCreationForm } from '@/components/pin-creation-form';
import { PinLoginForm } from '@/components/pin-login-form';
import { ModeToggle } from '@/components/mode-toggle';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type AuthStep = 'waiting' | 'validating' | 'new_user' | 'existing_user' | 'error';

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { mode } = useConfig();
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

  const devMode = mode === 'dev';

  useEffect(() => {
    if (devMode) {
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

    if (circleError) {
      setError(circleError);
      setAuthStep('error');
      return;
    }

    if (userData) {
      validateCircleData(userData);
    }
  }, [userData, circleError, devMode]);

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

      setValidatedData({
        public_uid: result.user_id,
        email: dataToValidate.email,
        name: dataToValidate.name,
        is_admin: result.is_admin || false,
        validationToken: result.validation_token,
      });

      if (result.status === 'new_user') {
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

  const handleAuthSuccess = (sessionToken: string, userId: string, isAdmin?: boolean) => {
    localStorage.setItem('session_token', sessionToken);
    localStorage.setItem('user_id', userId);
    localStorage.setItem('session_timestamp', Date.now().toString());
    
    // Route based on user role
    if (isAdmin) {
      setLocation('/dashboard');
    } else {
      setLocation('/user-home');
    }
  };

  const handleError = (message: string) => {
    setError(message);
  };

  // Show error message if Circle.so auth failed
  if (circleError && !devMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <ModeToggle />
        <Card className="w-full max-w-md shadow-lg" data-testid="card-timeout">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-amber-500/10">
              <AlertCircle className="h-6 w-6 text-amber-500" />
            </div>
            <CardTitle className="text-2xl font-semibold text-center">
              Accès restreint
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-amber-500/10 border-amber-500/20">
              <AlertDescription data-testid="text-timeout-message">
                {circleError}
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

  if ((authStep === 'waiting' || isValidating || isLoading) && !circleError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <ModeToggle />
        <Card className="w-full max-w-md shadow-lg" data-testid="card-loading">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-base text-muted-foreground">
              {devMode ? 'Initialisation du mode développement...' : 'Connexion en cours...'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authStep === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <ModeToggle />
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ModeToggle />
      
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
