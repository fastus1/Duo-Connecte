import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Loader2, AlertCircle } from 'lucide-react';
import { useCircleAuth } from '@/hooks/use-circle-auth';
import { PinCreationForm } from '@/components/pin-creation-form';
import { PinLoginForm } from '@/components/pin-login-form';
import { DevModeIndicator } from '@/components/dev-mode-indicator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type AuthStep = 'waiting' | 'validating' | 'new_user' | 'existing_user' | 'error';

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { userData, error: circleError } = useCircleAuth();
  const [authStep, setAuthStep] = useState<AuthStep>('waiting');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validatedData, setValidatedData] = useState<{
    public_uid?: string;
    email?: string;
    name?: string;
    validationToken?: string;
  } | null>(null);

  const devMode = import.meta.env.VITE_DEV_MODE === 'true';

  useEffect(() => {
    if (devMode) {
      const mockUserEmail = 'dev@example.com';
      const mockPublicUid = 'dev123';
      const mockName = 'Dev User';
      
      setValidatedData({
        email: mockUserEmail,
        public_uid: mockPublicUid,
        name: mockName,
      });
      setAuthStep('new_user');
      return;
    }

    if (circleError) {
      setError(circleError);
      setAuthStep('error');
      return;
    }

    if (userData) {
      validateCircleData();
    }
  }, [userData, circleError, devMode]);

  const validateCircleData = async () => {
    if (!userData) return;

    setIsValidating(true);
    setError(null);

    try {
      const result = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userData }),
      }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Erreur de validation');
        }
        return data;
      });

      setValidatedData({
        public_uid: result.user_id,
        email: userData.email,
        name: userData.name,
        validationToken: result.validation_token, // Store validation token for secure account creation
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

  const handleAuthSuccess = (sessionToken: string, userId: string) => {
    localStorage.setItem('session_token', sessionToken);
    localStorage.setItem('user_id', userId);
    localStorage.setItem('session_timestamp', Date.now().toString());
    
    setLocation('/dashboard');
  };

  const handleError = (message: string) => {
    setError(message);
  };

  if (authStep === 'waiting' || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <DevModeIndicator />
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
        <DevModeIndicator />
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
      <DevModeIndicator />
      
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
