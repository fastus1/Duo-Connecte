import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Home, Shield, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DevModeIndicator } from '@/components/dev-mode-indicator';
import { Logo } from '@/components/logo';
import { getSessionToken } from '@/lib/auth';

export default function UserHome() {
  const [, setLocation] = useLocation();

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error('No session token');
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired');
        }
        throw new Error('Failed to fetch user data');
      }

      return response.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (error || !getSessionToken()) {
      handleLogout();
    }
  }, [error]);

  const handleLogout = () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('session_timestamp');
    setLocation('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <DevModeIndicator />
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-base text-muted-foreground">Chargement...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const firstName = userData?.name?.split(' ')[0] || 'Utilisateur';

  return (
    <div className="min-h-screen bg-background">
      <DevModeIndicator />
      
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <div>
              <h1 className="text-xl font-semibold">Espace Membre</h1>
              <p className="text-sm text-muted-foreground">Communauté Avancer Simplement</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {userData?.isAdmin && (
              <Button 
                variant="outline" 
                onClick={() => setLocation('/dashboard')}
                data-testid="button-dashboard"
              >
                <Shield className="h-4 w-4 mr-2" />
                Dashboard Admin
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
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
