import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Shield, LogOut, Home, LogIn } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { getSessionToken } from '@/lib/auth';

interface AppConfig {
  requireCircleDomain: boolean;
  requireCircleLogin: boolean;
  requirePin: boolean;
  isPublicMode: boolean;
}

export default function UserHome() {
  const [, setLocation] = useLocation();
  const sessionToken = getSessionToken();
  const isLoggedIn = !!sessionToken;

  const { data: appConfig, isLoading: configLoading } = useQuery<AppConfig>({
    queryKey: ['/api/config'],
  });

  const isPublicMode = appConfig?.isPublicMode ?? false;

  // Redirect to auth page if not logged in and not in public mode
  useEffect(() => {
    if (!configLoading && appConfig && !isPublicMode && !isLoggedIn) {
      setLocation('/');
    }
  }, [configLoading, appConfig, isPublicMode, isLoggedIn, setLocation]);

  const { data: userData, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        return null;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      return response.json();
    },
    enabled: isLoggedIn,
    retry: false,
  });

  const handleLogout = () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('session_timestamp');
    if (isPublicMode) {
      window.location.reload();
    } else {
      setLocation('/');
    }
  };

  if (isLoading && isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-base text-muted-foreground">Chargement...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const firstName = userData?.name?.split(' ')[0] || 'Visiteur';
  const isAdmin = userData?.isAdmin || false;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <div>
              <h1 className="text-xl font-semibold">Espace Membre</h1>
              <p className="text-sm text-muted-foreground">Communauté Avancer Simplement</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAdmin && (
              <Button 
                variant="outline" 
                onClick={() => setLocation('/dashboard')}
                data-testid="button-dashboard"
              >
                <Shield className="h-4 w-4 mr-2" />
                Dashboard Admin
              </Button>
            )}
            {isLoggedIn ? (
              <Button 
                variant="outline" 
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            ) : (
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/admin-login')}
                data-testid="button-admin-login"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-2 pb-8">
              <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/10">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">
                Bonjour {firstName} !
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6 pb-8">
              <p className="text-lg text-muted-foreground">
                Nos applications sont en cours de production.
              </p>
              <p className="text-lg text-muted-foreground">
                Vous pourrez en profiter bientôt !
              </p>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground/70">
                  Nous vous tiendrons informé dès que nos outils seront disponibles.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
