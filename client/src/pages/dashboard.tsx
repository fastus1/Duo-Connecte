import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { LogOut, Shield, Clock, Loader2, Home, Lock, Users, Code, Ticket, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSessionToken, clearAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

import { AdminFeedbacks } from '@/components/admin/AdminFeedbacks';
import { AdminSupportTickets } from '@/components/admin/AdminSupportTickets';
import { SecurityTab } from '@/components/admin/SecurityTab';
import { PaywallTab } from '@/components/admin/PaywallTab';
import { MembersTab } from '@/components/admin/MembersTab';
import { WebhookTab } from '@/components/admin/WebhookTab';

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

interface PaidMember {
  id: string;
  email: string;
  paymentDate: string;
  paymentPlan: string | null;
  amountPaid: string | null;
  couponUsed: string | null;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

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

  const [paywallTitle, setPaywallTitle] = useState('');
  const [paywallMessage, setPaywallMessage] = useState('');
  const [paywallPurchaseUrl, setPaywallPurchaseUrl] = useState('');
  const [paywallInfoUrl, setPaywallInfoUrl] = useState('');
  const [paywallSettingsLoaded, setPaywallSettingsLoaded] = useState(false);

  const [webhookAppUrl, setWebhookAppUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [webhookSettingsLoaded, setWebhookSettingsLoaded] = useState(false);

  const [newMemberEmail, setNewMemberEmail] = useState('');

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

  const savePaywallSettings = () => {
    updateConfigMutation.mutate({
      paywallTitle,
      paywallMessage,
      paywallPurchaseUrl,
      paywallInfoUrl,
    });
  };

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
      toast({ title: 'Accès révoqué', description: 'L\'accès payant a été retiré. L\'utilisateur existe toujours.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const deleteUserCompleteMutation = useMutation({
    mutationFn: async (email: string) => {
      const token = getSessionToken();
      const response = await fetch(`/api/admin/delete-user/${encodeURIComponent(email)}`, {
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
      toast({ title: 'Utilisateur supprimé', description: 'L\'utilisateur et toutes ses données ont été supprimés.' });
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold mb-2">Tableau de bord</h2>
              <p className="text-muted-foreground">
                Gérez votre application avec l'authentification à 4 couches
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setLocation('/admin/blocks')}
              data-testid="button-design-system"
            >
              <Palette className="h-4 w-4 mr-2" />
              Design
            </Button>
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
              <TabsTrigger value="support" className="flex-1 min-w-fit" data-testid="tab-support">
                <Ticket className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Support</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="accueil" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-emerald-500/10">
                        <Clock className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Session démarrée</p>
                        <p className="text-xs text-muted-foreground">
                          {sessionStart ? sessionStart.toLocaleString('fr-FR') : 'Non disponible'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-500/10">
                        <Shield className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Expiration</p>
                        <p className="text-xs text-muted-foreground">60 min d'inactivité</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Bienvenue, {userData?.name || 'Administrateur'}</CardTitle>
                      <CardDescription>
                        Vous êtes connecté en tant qu'administrateur
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Utilisez les onglets ci-dessus pour naviguer entre les différentes sections de configuration.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="securite" className="space-y-6">
              <SecurityTab
                configData={configData}
                configLoading={configLoading}
                updateConfigMutation={updateConfigMutation}
              />
            </TabsContent>

            <TabsContent value="paywall" className="space-y-6">
              <PaywallTab
                paywallTitle={paywallTitle}
                setPaywallTitle={setPaywallTitle}
                paywallMessage={paywallMessage}
                setPaywallMessage={setPaywallMessage}
                paywallPurchaseUrl={paywallPurchaseUrl}
                setPaywallPurchaseUrl={setPaywallPurchaseUrl}
                paywallInfoUrl={paywallInfoUrl}
                setPaywallInfoUrl={setPaywallInfoUrl}
                updateConfigMutation={updateConfigMutation}
                onSave={savePaywallSettings}
              />
            </TabsContent>

            <TabsContent value="membres" className="space-y-6">
              <MembersTab
                paidMembersData={paidMembersData}
                paidMembersLoading={paidMembersLoading}
                newMemberEmail={newMemberEmail}
                setNewMemberEmail={setNewMemberEmail}
                addMemberMutation={addMemberMutation}
                deleteMemberMutation={deleteMemberMutation}
                deleteUserCompleteMutation={deleteUserCompleteMutation}
                onAddMember={handleAddMember}
              />
            </TabsContent>

            <TabsContent value="webhook" className="space-y-6">
              <WebhookTab
                webhookAppUrl={webhookAppUrl}
                setWebhookAppUrl={setWebhookAppUrl}
                webhookSecret={webhookSecret}
                setWebhookSecret={setWebhookSecret}
                updateConfigMutation={updateConfigMutation}
              />
            </TabsContent>

            <TabsContent value="feedbacks" className="space-y-6">
              <AdminFeedbacks />
            </TabsContent>

            <TabsContent value="support" className="space-y-6">
              <AdminSupportTickets />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
