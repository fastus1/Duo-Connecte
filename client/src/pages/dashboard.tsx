import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { LogOut, Shield, Clock, Loader2, Home, Settings, Lock, AlertTriangle, Users, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { getSessionToken, clearAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

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

  const { data: configData, isLoading: configLoading } = useQuery<AppConfig>({
    queryKey: ['/api/config'],
  });

  // Local state for paywall settings
  const [paywallTitle, setPaywallTitle] = useState('');
  const [paywallMessage, setPaywallMessage] = useState('');
  const [paywallPurchaseUrl, setPaywallPurchaseUrl] = useState('');
  const [paywallInfoUrl, setPaywallInfoUrl] = useState('');
  const [paywallSettingsLoaded, setPaywallSettingsLoaded] = useState(false);

  // Load paywall settings when config is fetched
  useEffect(() => {
    if (configData && !paywallSettingsLoaded) {
      setPaywallTitle(configData.paywallTitle || '');
      setPaywallMessage(configData.paywallMessage || '');
      setPaywallPurchaseUrl(configData.paywallPurchaseUrl || '');
      setPaywallInfoUrl(configData.paywallInfoUrl || '');
      setPaywallSettingsLoaded(true);
    }
  }, [configData, paywallSettingsLoaded]);

  const updateConfigMutation = useMutation({
    mutationFn: async (config: Partial<AppConfig>) => {
      const token = getSessionToken();
      const response = await fetch('/api/config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/config'] });
      toast({
        title: 'Configuration mise à jour',
        description: 'Les paramètres de sécurité ont été enregistrés.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de mettre à jour la configuration.',
        variant: 'destructive',
      });
    },
  });

  // Save paywall settings
  const savePaywallSettings = () => {
    updateConfigMutation.mutate({
      paywallTitle,
      paywallMessage,
      paywallPurchaseUrl,
      paywallInfoUrl,
    });
  };

  // Paid members management
  interface PaidMember {
    id: string;
    email: string;
    paymentDate: string;
    paymentPlan: string | null;
    amountPaid: string | null;
    couponUsed: string | null;
  }

  const [newMemberEmail, setNewMemberEmail] = useState('');

  const { data: paidMembersData, isLoading: paidMembersLoading } = useQuery<{ members: PaidMember[] }>({
    queryKey: ['/api/admin/paid-members'],
    queryFn: async () => {
      const token = getSessionToken();
      const response = await fetch('/api/admin/paid-members', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch paid members');
      return response.json();
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: async (email: string) => {
      const token = getSessionToken();
      const response = await fetch('/api/admin/paid-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de l\'ajout');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/paid-members'] });
      setNewMemberEmail('');
      toast({ title: 'Membre ajouté', description: 'L\'email a été ajouté aux membres payants.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (email: string) => {
      const token = getSessionToken();
      const response = await fetch(`/api/admin/paid-members/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/paid-members'] });
      toast({ title: 'Membre supprimé', description: 'L\'accès a été révoqué.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const handleAddMember = () => {
    if (newMemberEmail.trim()) {
      addMemberMutation.mutate(newMemberEmail.trim().toLowerCase());
    }
  };

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

  useEffect(() => {
    if (userData && !userData.isAdmin) {
      setLocation('/user-home');
    }
  }, [userData, setLocation]);

  const handleLogout = () => {
    clearAuth();
    setLocation('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <div>
              <h1 className="text-xl font-semibold">Dashboard Admin</h1>
              <p className="text-sm text-muted-foreground">Espace d'administration</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={() => setLocation('/user-home')}
              data-testid="button-user-home"
            >
              <Home className="h-4 w-4 mr-2" />
              Page d'accueil
            </Button>
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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-3xl font-semibold mb-2">Tableau de bord</h2>
            <p className="text-muted-foreground">
              Vous êtes connecté de manière sécurisée avec l'authentification à 4 couches
            </p>
          </div>

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

          <Card data-testid="card-security-config">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Configuration de sécurité</CardTitle>
              </div>
              <CardDescription>
                Activez ou désactivez les couches de protection selon vos besoins
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <Label htmlFor="require-circle-domain" className="text-sm font-medium">
                    Couche 1 : Exiger le domaine Circle.so
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Si désactivé, l'app peut être accédée directement (mode développement)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {updateConfigMutation.isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  <Switch
                    id="require-circle-domain"
                    checked={configData?.requireCircleDomain ?? true}
                    onCheckedChange={(checked) => updateConfigMutation.mutate({ requireCircleDomain: checked })}
                    disabled={updateConfigMutation.isPending || configLoading}
                    data-testid="switch-require-circle-domain"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <Label htmlFor="require-circle-login" className="text-sm font-medium">
                    Couche 2 : Exiger la connexion Circle.so
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Si désactivé, les visiteurs non-connectés peuvent voir l'app
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {updateConfigMutation.isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  <Switch
                    id="require-circle-login"
                    checked={configData?.requireCircleLogin ?? true}
                    onCheckedChange={(checked) => updateConfigMutation.mutate({ requireCircleLogin: checked })}
                    disabled={updateConfigMutation.isPending || configLoading}
                    data-testid="switch-require-circle-login"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <Label htmlFor="require-paywall" className="text-sm font-medium">
                    Couche 3 : Exiger le paiement (Paywall)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Si activé, seuls les membres payants peuvent accéder à l'app
                  </p>
                  {configData?.requirePaywall && !configData?.requireCircleLogin && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Le paywall nécessite que la Couche 2 (Connexion Circle.so) soit activée.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {updateConfigMutation.isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  <Switch
                    id="require-paywall"
                    checked={configData?.requirePaywall ?? false}
                    onCheckedChange={(checked) => updateConfigMutation.mutate({ requirePaywall: checked })}
                    disabled={updateConfigMutation.isPending || configLoading || !configData?.requireCircleLogin}
                    data-testid="switch-require-paywall"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <Label htmlFor="require-pin" className="text-sm font-medium">
                    Couche 4 : Exiger le NIP personnel
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Si désactivé, pas besoin de NIP pour accéder à l'app
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {updateConfigMutation.isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  <Switch
                    id="require-pin"
                    checked={configData?.requirePin ?? true}
                    onCheckedChange={(checked) => updateConfigMutation.mutate({ requirePin: checked })}
                    disabled={updateConfigMutation.isPending || configLoading}
                    data-testid="switch-require-pin"
                  />
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  <strong>Note :</strong> Désactiver la Couche 1 permet de tester l'app sans être dans Circle.so. À réactiver en production.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Paywall Configuration Card */}
          <Card data-testid="card-paywall-config">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Configuration du Paywall</CardTitle>
              </div>
              <CardDescription>
                Personnalisez l'écran affiché aux membres non-payants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paywall-title">Titre de l'écran de blocage</Label>
                <Input
                  id="paywall-title"
                  placeholder="Accès Réservé"
                  value={paywallTitle}
                  onChange={(e) => setPaywallTitle(e.target.value)}
                  data-testid="input-paywall-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paywall-message">Message explicatif</Label>
                <Textarea
                  id="paywall-message"
                  placeholder="Cette application est réservée aux membres payants de la communauté."
                  value={paywallMessage}
                  onChange={(e) => setPaywallMessage(e.target.value)}
                  rows={3}
                  data-testid="input-paywall-message"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paywall-purchase-url">URL d'achat (bouton principal)</Label>
                <Input
                  id="paywall-purchase-url"
                  placeholder="https://votre-communaute.circle.so/c/acheter"
                  value={paywallPurchaseUrl}
                  onChange={(e) => setPaywallPurchaseUrl(e.target.value)}
                  data-testid="input-paywall-purchase-url"
                />
                <p className="text-xs text-muted-foreground">
                  Lien vers la page d'achat Circle.so ou Stripe
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paywall-info-url">URL d'information (bouton secondaire)</Label>
                <Input
                  id="paywall-info-url"
                  placeholder="https://votre-communaute.circle.so/c/info"
                  value={paywallInfoUrl}
                  onChange={(e) => setPaywallInfoUrl(e.target.value)}
                  data-testid="input-paywall-info-url"
                />
                <p className="text-xs text-muted-foreground">
                  Lien vers une page explicative (optionnel)
                </p>
              </div>
              <Button
                onClick={savePaywallSettings}
                disabled={updateConfigMutation.isPending}
                className="w-full"
                data-testid="button-save-paywall-settings"
              >
                {updateConfigMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer les paramètres du paywall'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Paid Members Management Card */}
          <Card data-testid="card-paid-members">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Membres Payants</CardTitle>
              </div>
              <CardDescription>
                Gérez manuellement les accès payants (le webhook Circle.so ajoute automatiquement les nouveaux paiements)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new member */}
              <div className="flex gap-2">
                <Input
                  placeholder="email@exemple.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                  data-testid="input-new-member-email"
                />
                <Button
                  onClick={handleAddMember}
                  disabled={addMemberMutation.isPending || !newMemberEmail.trim()}
                  data-testid="button-add-member"
                >
                  {addMemberMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Members list */}
              <div className="border rounded-md divide-y max-h-64 overflow-y-auto">
                {paidMembersLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  </div>
                ) : paidMembersData?.members?.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Aucun membre payant enregistré
                  </div>
                ) : (
                  paidMembersData?.members?.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 gap-2" data-testid={`row-member-${member.id}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.email}</p>
                        <div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
                          <span>{member.paymentPlan || 'Ajout manuel'}</span>
                          {member.amountPaid && <span>• {member.amountPaid}</span>}
                          {member.couponUsed && <span>• Code: {member.couponUsed}</span>}
                          <span>• {new Date(member.paymentDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMemberMutation.mutate(member.email)}
                        disabled={deleteMemberMutation.isPending}
                        data-testid={`button-delete-member-${member.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                <strong>Secret Webhook :</strong> Configurez l'en-tête <code className="bg-muted px-1 rounded">X-Webhook-Secret</code> dans votre script Circle.so pour sécuriser les paiements automatiques.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
