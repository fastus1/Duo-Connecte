import { useState } from 'react';
import { useLocation } from 'wouter';
import { LogIn, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ThemeToggle } from '@/components/theme-toggle';
import { PageContainer } from '@/components/LoadingScreen';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      localStorage.setItem('session_token', data.session_token);
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('is_admin', String(data.is_admin));
      localStorage.setItem('session_timestamp', String(Date.now()));

      setLocation('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer className="flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-lg" data-testid="card-admin-login">
        <CardHeader className="text-center space-y-4">
          <Logo size="lg" className="mx-auto" />
          <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Connexion
          </CardTitle>
          <CardDescription>
            Accédez à votre espace membre
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription data-testid="text-error">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin">NIP (4-6 chiffres)</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                required
                disabled={isLoading}
                data-testid="input-pin"
              />
            </div>

            <Button
              onClick={(e) => handleSubmit(e)}
              className="w-full h-12"
              disabled={isLoading || !email || pin.length < 4}
              data-testid="button-submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Se connecter
                </>
              )}
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setLocation('/')}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
