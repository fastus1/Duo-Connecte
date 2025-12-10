import { Loader2, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
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

interface SecurityTabProps {
  configData: AppConfig | undefined;
  configLoading: boolean;
  updateConfigMutation: UseMutationResult<any, Error, Partial<AppConfig>, unknown>;
}

export function SecurityTab({ configData, configLoading, updateConfigMutation }: SecurityTabProps) {
  return (
    <Card data-testid="card-security-config">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-violet-500/10">
            <Shield className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <CardTitle className="text-lg">Couches de sécurité</CardTitle>
            <CardDescription>
              Activez ou désactivez les couches de protection selon vos besoins
            </CardDescription>
          </div>
        </div>
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
  );
}
