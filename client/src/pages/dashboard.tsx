import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { LogOut, Shield, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DevModeIndicator } from '@/components/dev-mode-indicator';
import { getSessionToken } from '@/lib/auth';

export default function Dashboard() {
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
            <p className="text-base text-muted-foreground">Chargement de vos données...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sessionTimestamp = localStorage.getItem('session_timestamp');
  const sessionStart = sessionTimestamp ? new Date(parseInt(sessionTimestamp)) : null;

  return (
    <div className="min-h-screen bg-background">
      <DevModeIndicator />
      
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Application Sécurisée</h1>
              <p className="text-sm text-muted-foreground">Authentification Circle.so</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-3xl font-semibold mb-2">Tableau de bord</h2>
            <p className="text-muted-foreground">
              Vous êtes connecté de manière sécurisée avec l'authentification à 3 couches
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card data-testid="card-security-status">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Statut de sécurité</CardTitle>
                  <Badge variant="default" className="bg-success text-success-foreground">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Actif
                  </Badge>
                </div>
                <CardDescription>
                  Authentification Defense in Depth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/10">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Couche 1: Circle.so</p>
                    <p className="text-xs text-muted-foreground">Authentification membre validée</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/10">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Couche 2: Validation PostMessage</p>
                    <p className="text-xs text-muted-foreground">Données vérifiées et validées</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/10">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Couche 3: NIP Personnel</p>
                    <p className="text-xs text-muted-foreground">Authentification réussie</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-session-info">
              <CardHeader>
                <CardTitle className="text-lg">Informations de session</CardTitle>
                <CardDescription>
                  Détails de votre connexion actuelle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Session démarrée</p>
                    <p className="text-xs text-muted-foreground">
                      {sessionStart ? sessionStart.toLocaleString('fr-FR') : 'Non disponible'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Expiration automatique</p>
                    <p className="text-xs text-muted-foreground">
                      60 minutes d'inactivité
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card data-testid="card-welcome">
            <CardHeader>
              <CardTitle>Bienvenue dans votre application sécurisée</CardTitle>
              <CardDescription>
                Cette template utilise un système d'authentification "Defense in Depth" à 3 couches
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Votre application est maintenant protégée par un système de sécurité robuste qui combine :
              </p>
              <ul>
                <li><strong>L'authentification Circle.so</strong> - Seuls les membres de votre communauté peuvent accéder</li>
                <li><strong>La validation PostMessage</strong> - Les données sont vérifiées et validées côté serveur</li>
                <li><strong>Le NIP personnel</strong> - Une couche d'authentification supplémentaire unique à chaque utilisateur</li>
              </ul>
              <p>
                Vous pouvez maintenant personnaliser cette page et ajouter vos propres fonctionnalités !
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
