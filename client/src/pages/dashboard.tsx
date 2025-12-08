import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { LogOut, Shield, Clock, Loader2, Home, Settings, Lock, AlertTriangle, Users, Plus, Trash2, Code, Copy, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { getSessionToken, clearAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

import { AdminFeedbacks } from '@/components/admin/AdminFeedbacks';

// Helper function to copy text with fallback
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for insecure contexts or when clipboard API is not available
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

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
    webhookAppUrl: string;
  }

  type Environment = 'development' | 'production';

  interface SettingsData {
    environment: Environment;
    circleOnlyMode: boolean;
  }

  const { data: configData, isLoading: configLoading } = useQuery<AppConfig>({
    queryKey: ['/api/config'],
  });

  const { data: settingsData, isLoading: settingsLoading } = useQuery<SettingsData>({
    queryKey: ['/api/settings'],
    queryFn: async () => {
      const response = await fetch("/api/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    }
  });

  const environment = settingsData?.environment ?? 'development';

  // Local state for paywall settings
  const [paywallTitle, setPaywallTitle] = useState('');
  const [paywallMessage, setPaywallMessage] = useState('');
  const [paywallPurchaseUrl, setPaywallPurchaseUrl] = useState('');
  const [paywallInfoUrl, setPaywallInfoUrl] = useState('');
  const [paywallSettingsLoaded, setPaywallSettingsLoaded] = useState(false);

  // Local state for webhook script generator
  const [webhookAppUrl, setWebhookAppUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [webhookSettingsLoaded, setWebhookSettingsLoaded] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);

  // Load paywall and webhook settings when config is fetched
  useEffect(() => {
    if (configData && !paywallSettingsLoaded) {
      setPaywallTitle(configData.paywallTitle || '');
      setPaywallMessage(configData.paywallMessage || '');
      setPaywallPurchaseUrl(configData.paywallPurchaseUrl || '');
      setPaywallInfoUrl(configData.paywallInfoUrl || '');
      setPaywallSettingsLoaded(true);
    }
    if (configData && !webhookSettingsLoaded) {
      setWebhookAppUrl(configData.webhookAppUrl || '');
      setWebhookSettingsLoaded(true);
    }
  }, [configData, paywallSettingsLoaded, webhookSettingsLoaded]);

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
        description: 'Les paramètres ont été enregistrés.',
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

  const environmentMutation = useMutation({
    mutationFn: async (newEnvironment: Environment) => {
      const token = getSessionToken();
      const response = await fetch("/api/admin/settings/environment", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ environment: newEnvironment }),
      });

      if (!response.ok) {
        throw new Error("Impossible de changer l'environnement");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Environnement modifié",
        description: `Mode ${data.environment === 'development' ? 'Développement' : 'Production'} activé`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
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
      setLocation('/welcome');
    }
  }, [userData, setLocation]);

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/';
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
    <div className="min-h-screen bg-background pb-12">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2 className="text-3xl font-semibold mb-2">Tableau de bord</h2>
            <p className="text-muted-foreground">
              Gérez votre application avec l'authentification à 4 couches
            </p>
          </div>

          <Tabs defaultValue="accueil" className="w-full">
            <TabsList className="flex w-full overflow-x-auto" data-testid="tabs-navigation">
              <TabsTrigger value="accueil" className="flex-1 min-w-fit" data-testid="tab-accueil">
                <Home className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Accueil</span>
              </TabsTrigger>
              <TabsTrigger value="securite" className="flex-1 min-w-fit" data-testid="tab-securite">
                <Shield className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Sécurité</span>
              </TabsTrigger>
              <TabsTrigger value="paywall" className="flex-1 min-w-fit" data-testid="tab-paywall">
                <Lock className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Paywall</span>
              </TabsTrigger>
              <TabsTrigger value="membres" className="flex-1 min-w-fit" data-testid="tab-membres">
                <Users className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Membres</span>
              </TabsTrigger>
              <TabsTrigger value="webhook" className="flex-1 min-w-fit" data-testid="tab-webhook">
                <Code className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Webhook</span>
              </TabsTrigger>
              <TabsTrigger value="feedbacks" className="flex-1 min-w-fit" data-testid="tab-feedbacks">
                <Users className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Feedbacks</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab: Feedbacks */}
            <TabsContent value="feedbacks" className="space-y-6">
              <AdminFeedbacks />
            </TabsContent>

            {/* Tab: Accueil */}
            <TabsContent value="accueil" className="space-y-6">
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bienvenue, {userData?.name || 'Administrateur'}</CardTitle>
                  <CardDescription>
                    Vous êtes connecté en tant qu'administrateur
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Utilisez les onglets ci-dessus pour naviguer entre les différentes sections de configuration.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Sécurité */}
            <TabsContent value="securite" className="space-y-6">
              <Card data-testid="card-security-config">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">Couches de sécurité</CardTitle>
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
                        {!(configData?.requireCircleDomain) 
                          ? "Requiert la Couche 1 (Circle.so envoie les infos utilisateur)"
                          : "Si désactivé, les visiteurs non-connectés peuvent voir l'app"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {updateConfigMutation.isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                      <Switch
                        id="require-circle-login"
                        checked={configData?.requireCircleLogin ?? true}
                        onCheckedChange={(checked) => {
                          // Layer 2 requires Layer 1 - auto-enable it
                          if (checked && !configData?.requireCircleDomain) {
                            updateConfigMutation.mutate({ requireCircleDomain: true, requireCircleLogin: true });
                          } else {
                            updateConfigMutation.mutate({ requireCircleLogin: checked });
                          }
                        }}
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
                        {!(configData?.requireCircleDomain && configData?.requireCircleLogin)
                          ? "Requiert les Couches 1 et 2 (pour vérifier le courriel)"
                          : "Si activé, seuls les membres payants peuvent accéder à l'app"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {updateConfigMutation.isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                      <Switch
                        id="require-paywall"
                        checked={configData?.requirePaywall ?? false}
                        onCheckedChange={(checked) => {
                          // Layer 3 requires Layers 1 and 2
                          if (checked && (!configData?.requireCircleDomain || !configData?.requireCircleLogin)) {
                            updateConfigMutation.mutate({ 
                              requireCircleDomain: true, 
                              requireCircleLogin: true, 
                              requirePaywall: true 
                            });
                          } else {
                            updateConfigMutation.mutate({ requirePaywall: checked });
                          }
                        }}
                        disabled={updateConfigMutation.isPending || configLoading}
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
            </TabsContent>

            {/* Tab: Paywall */}
            <TabsContent value="paywall" className="space-y-6">
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
            </TabsContent>

            {/* Tab: Membres */}
            <TabsContent value="membres" className="space-y-6">
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

                  <div className="border rounded-md divide-y max-h-96 overflow-y-auto">
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Webhook */}
            <TabsContent value="webhook" className="space-y-6">
              <Card data-testid="card-auth-script-generator">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">Script d'Authentification Circle.so</CardTitle>
                  </div>
                  <CardDescription>
                    Script COMPLET à coller dans Circle.so (Settings &gt; Custom Code &gt; Footer)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Script complet (définit circleUser + répond aux demandes d'auth)</Label>
                    <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
                      {`<script>
// PARTIE 1 : Définir window.circleUser avec les données Liquid
window.circleUser = {
  publicUid: '{{member.public_uid}}',
  email: '{{member.email}}',
  name: '{{member.name}}',
  isAdmin: {{member.admin}}
};

// PARTIE 2 : Répondre aux demandes d'authentification des iframes
(function() {
  var ALLOWED_ORIGINS = /\\.replit\\.app$/;
  
  function getTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
  
  function buildPayload() {
    if (!window.circleUser || !window.circleUser.email) return null;
    return {
      type: 'CIRCLE_USER_AUTH',
      user: {
        publicUid: window.circleUser.publicUid || '',
        email: window.circleUser.email,
        name: window.circleUser.name || 'Membre',
        isAdmin: window.circleUser.isAdmin === true || window.circleUser.isAdmin === 'true',
        timestamp: Date.now()
      },
      theme: getTheme()
    };
  }
  
  function sendToAllIframes() {
    var iframes = document.querySelectorAll('iframe[src*=".replit.app"]');
    var payload = buildPayload();
    if (payload) {
      iframes.forEach(function(iframe) {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(payload, '*');
        }
      });
    }
  }
  
  // Écouter les demandes d'auth des iframes
  window.addEventListener('message', function(event) {
    if (ALLOWED_ORIGINS.test(event.origin) && event.data && event.data.type === 'CIRCLE_AUTH_REQUEST') {
      var payload = buildPayload();
      if (payload && event.source) {
        event.source.postMessage(payload, event.origin);
      }
    }
  });
  
  // Envoyer automatiquement les données au chargement
  var sent = false;
  var interval = setInterval(function() {
    if (window.circleUser && window.circleUser.email && !sent) {
      sendToAllIframes();
      sent = true;
      clearInterval(interval);
    }
  }, 500);
  
  setTimeout(function() { clearInterval(interval); }, 30000);
})();
</script>`}
                    </div>
                    <Button
                      onClick={async () => {
                        const authScript = `<script>
// PARTIE 1 : Définir window.circleUser avec les données Liquid
window.circleUser = {
  publicUid: '{{member.public_uid}}',
  email: '{{member.email}}',
  name: '{{member.name}}',
  isAdmin: {{member.admin}}
};

// PARTIE 2 : Répondre aux demandes d'authentification des iframes
(function() {
  var ALLOWED_ORIGINS = /\\.replit\\.app$/;
  
  function getTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
  
  function buildPayload() {
    if (!window.circleUser || !window.circleUser.email) return null;
    return {
      type: 'CIRCLE_USER_AUTH',
      user: {
        publicUid: window.circleUser.publicUid || '',
        email: window.circleUser.email,
        name: window.circleUser.name || 'Membre',
        isAdmin: window.circleUser.isAdmin === true || window.circleUser.isAdmin === 'true',
        timestamp: Date.now()
      },
      theme: getTheme()
    };
  }
  
  function sendToAllIframes() {
    var iframes = document.querySelectorAll('iframe[src*=".replit.app"]');
    var payload = buildPayload();
    if (payload) {
      iframes.forEach(function(iframe) {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(payload, '*');
        }
      });
    }
  }
  
  // Écouter les demandes d'auth des iframes
  window.addEventListener('message', function(event) {
    if (ALLOWED_ORIGINS.test(event.origin) && event.data && event.data.type === 'CIRCLE_AUTH_REQUEST') {
      var payload = buildPayload();
      if (payload && event.source) {
        event.source.postMessage(payload, event.origin);
      }
    }
  });
  
  // Envoyer automatiquement les données au chargement
  var sent = false;
  var interval = setInterval(function() {
    if (window.circleUser && window.circleUser.email && !sent) {
      sendToAllIframes();
      sent = true;
      clearInterval(interval);
    }
  }, 500);
  
  setTimeout(function() { clearInterval(interval); }, 30000);
})();
</script>`;
                        const success = await copyToClipboard(authScript);
                        if (success) {
                          toast({ title: 'Copié !', description: 'Le script d\'authentification complet a été copié.' });
                        } else {
                          toast({ title: 'Erreur', description: 'Impossible de copier. Sélectionnez manuellement le texte.', variant: 'destructive' });
                        }
                      }}
                      className="w-full"
                      data-testid="button-copy-auth-script"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copier le script complet
                    </Button>
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important :</strong> Ce script définit <code>window.circleUser</code> avec les variables Liquid de Circle.so, 
                      puis répond aux demandes d'authentification de l'app. Remplacez votre ancien script par celui-ci.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card data-testid="card-webhook-generator">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">Générateur de Script Webhook</CardTitle>
                  </div>
                  <CardDescription>
                    Générez le script à coller dans le Custom Code de votre paywall Circle.so
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-app-url">URL de l'application</Label>
                    <Input
                      id="webhook-app-url"
                      placeholder="https://votre-app.replit.app"
                      value={webhookAppUrl}
                      onChange={(e) => setWebhookAppUrl(e.target.value)}
                      data-testid="input-webhook-app-url"
                    />
                    <p className="text-xs text-muted-foreground">
                      L'URL complète du webhook sera : {webhookAppUrl ? `${webhookAppUrl}/webhooks/circle-payment` : '...'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-secret">Secret du webhook</Label>
                    <Input
                      id="webhook-secret"
                      placeholder="votre-secret-securise"
                      value={webhookSecret}
                      onChange={(e) => setWebhookSecret(e.target.value)}
                      data-testid="input-webhook-secret"
                    />
                    <p className="text-xs text-muted-foreground">
                      Ce secret doit correspondre à la variable d'environnement <code className="bg-muted px-1 rounded">WEBHOOK_SECRET</code>
                    </p>
                  </div>

                  <Button
                    onClick={() => updateConfigMutation.mutate({ webhookAppUrl })}
                    disabled={updateConfigMutation.isPending || !webhookAppUrl.trim()}
                    variant="outline"
                    className="w-full"
                    data-testid="button-save-webhook-url"
                  >
                    {updateConfigMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Sauvegarder l'URL
                  </Button>

                  {webhookAppUrl && webhookSecret && (
                    <div className="space-y-2">
                      <Label>Script à copier dans Circle.so</Label>
                      <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
                        {`<script>
const WEBHOOK_SECRET = '${webhookSecret}';
fetch('${webhookAppUrl}/webhooks/circle-payment', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'X-Webhook-Secret': WEBHOOK_SECRET
  },
  body: JSON.stringify({
    event: 'payment_received',
    user: { 
      email: '{member_email}', 
      timestamp: Math.floor(Date.now() / 1000) 
    },
    payment: {
      paywall_display_name: '{paywall_display_name}',
      amount_paid: '{amount_paid}',
      coupon_code: '{coupon_code}'
    }
  })
});
</script>`}
                      </div>
                      <Button
                        onClick={async () => {
                          const script = `<script>
const WEBHOOK_SECRET = '${webhookSecret}';
fetch('${webhookAppUrl}/webhooks/circle-payment', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'X-Webhook-Secret': WEBHOOK_SECRET
  },
  body: JSON.stringify({
    event: 'payment_received',
    user: { 
      email: '{member_email}', 
      timestamp: Math.floor(Date.now() / 1000) 
    },
    payment: {
      paywall_display_name: '{paywall_display_name}',
      amount_paid: '{amount_paid}',
      coupon_code: '{coupon_code}'
    }
  })
});
</script>`;
                          const success = await copyToClipboard(script);
                          if (success) {
                            setScriptCopied(true);
                            setTimeout(() => setScriptCopied(false), 2000);
                            toast({ title: 'Copié !', description: 'Le script a été copié dans le presse-papiers.' });
                          } else {
                            toast({ title: 'Erreur', description: 'Impossible de copier. Sélectionnez manuellement le texte.', variant: 'destructive' });
                          }
                        }}
                        className="w-full"
                        data-testid="button-copy-script"
                      >
                        {scriptCopied ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copié !
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copier le script
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {(!webhookAppUrl || !webhookSecret) && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Remplissez l'URL de l'application et le secret pour générer le script.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
