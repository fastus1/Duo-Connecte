import { Loader2, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UseMutationResult } from '@tanstack/react-query';

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

interface PaywallTabProps {
  paywallTitle: string;
  setPaywallTitle: (value: string) => void;
  paywallMessage: string;
  setPaywallMessage: (value: string) => void;
  paywallPurchaseUrl: string;
  setPaywallPurchaseUrl: (value: string) => void;
  paywallInfoUrl: string;
  setPaywallInfoUrl: (value: string) => void;
  updateConfigMutation: UseMutationResult<any, Error, Partial<AppConfig>, unknown>;
  onSave: () => void;
}

export function PaywallTab({
  paywallTitle,
  setPaywallTitle,
  paywallMessage,
  setPaywallMessage,
  paywallPurchaseUrl,
  setPaywallPurchaseUrl,
  paywallInfoUrl,
  setPaywallInfoUrl,
  updateConfigMutation,
  onSave,
}: PaywallTabProps) {
  return (
    <Card data-testid="card-paywall-config">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-amber-500/10">
            <Lock className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <CardTitle className="text-lg">Configuration du Paywall</CardTitle>
            <CardDescription>
              Personnalisez l'écran affiché aux membres non-payants
            </CardDescription>
          </div>
        </div>
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
            placeholder="https://..."
            value={paywallPurchaseUrl}
            onChange={(e) => setPaywallPurchaseUrl(e.target.value)}
            data-testid="input-paywall-purchase-url"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paywall-info-url">URL d'information (optionnel)</Label>
          <Input
            id="paywall-info-url"
            placeholder="https://..."
            value={paywallInfoUrl}
            onChange={(e) => setPaywallInfoUrl(e.target.value)}
            data-testid="input-paywall-info-url"
          />
          <p className="text-xs text-muted-foreground">
            Lien vers une page explicative (optionnel)
          </p>
        </div>
        <Button
          onClick={onSave}
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
  );
}
