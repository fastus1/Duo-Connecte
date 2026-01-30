import { useState } from 'react';
import { Loader2, Code, Shield, Copy, Check, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UseMutationResult } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

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

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
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

interface WebhookTabProps {
  webhookAppUrl: string;
  setWebhookAppUrl: (value: string) => void;
  webhookSecret: string;
  setWebhookSecret: (value: string) => void;
  updateConfigMutation: UseMutationResult<any, Error, Partial<AppConfig>, unknown>;
}

export function WebhookTab({
  webhookAppUrl,
  setWebhookAppUrl,
  webhookSecret,
  setWebhookSecret,
  updateConfigMutation,
}: WebhookTabProps) {
  const { toast } = useToast();
  const [scriptCopied, setScriptCopied] = useState(false);

  const webhookScript = `<script>
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

  const authScript = `<script>
// Script d'authentification Circle.so -> Railway Apps v3
// A placer dans: Settings -> Code Snippets -> JavaScript
(function() {
  function getTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
  
  function buildPayload() {
    // Circle.so expose automatiquement window.circleUser
    if (!window.circleUser || !window.circleUser.email) return null;
    return {
      type: 'CIRCLE_USER_AUTH',
      user: {
        publicUid: window.circleUser.publicUid || '',
        email: window.circleUser.email,
        name: window.circleUser.name || 'Membre',
        isAdmin: window.circleUser.is_admin === true,
        timestamp: Date.now()
      },
      theme: getTheme()
    };
  }
  
  function sendToAllIframes() {
    var iframes = document.querySelectorAll('iframe[src*=".railway.app"], iframe[src*=".up.railway.app"]');
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
    if (event.data && event.data.type === 'CIRCLE_AUTH_REQUEST') {
      var payload = buildPayload();
      if (payload && event.source) {
        event.source.postMessage(payload, '*');
      }
    }
  });
  
  // Attendre que circleUser soit disponible puis envoyer
  function tryToSend() {
    if (window.circleUser && window.circleUser.email) {
      sendToAllIframes();
      return true;
    }
    return false;
  }
  
  // Essayer immédiatement puis toutes les 500ms pendant 10s
  if (!tryToSend()) {
    var attempts = 0;
    var interval = setInterval(function() {
      attempts++;
      if (tryToSend() || attempts >= 20) {
        clearInterval(interval);
      }
    }, 500);
  }
  
  // Aussi envoyer après chargement complet
  window.addEventListener('load', function() {
    setTimeout(sendToAllIframes, 100);
    setTimeout(sendToAllIframes, 1000);
  });
})();
</script>`;

  const handleCopyWebhookScript = async () => {
    const success = await copyToClipboard(webhookScript);
    if (success) {
      setScriptCopied(true);
      setTimeout(() => setScriptCopied(false), 2000);
      toast({ title: 'Copié !', description: 'Le script a été copié dans le presse-papiers.' });
    } else {
      toast({ title: 'Erreur', description: 'Impossible de copier. Sélectionnez manuellement le texte.', variant: 'destructive' });
    }
  };

  const handleCopyAuthScript = async () => {
    const success = await copyToClipboard(authScript);
    if (success) {
      toast({ title: 'Copié !', description: 'Le script d\'authentification complet a été copié.' });
    } else {
      toast({ title: 'Erreur', description: 'Impossible de copier. Sélectionnez manuellement le texte.', variant: 'destructive' });
    }
  };

  return (
    <>
      <Card data-testid="card-webhook-generator">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-orange-500/10">
              <Code className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Générateur de Script Webhook</CardTitle>
              <CardDescription>
                Générez le script à coller dans le Custom Code de votre paywall Circle.so
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-app-url">URL de l'application</Label>
            <Input
              id="webhook-app-url"
              placeholder="https://votre-app.railway.app"
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
                {webhookScript}
              </div>
              <Button
                onClick={handleCopyWebhookScript}
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

      <Card data-testid="card-auth-script-generator">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-indigo-500/10">
              <Shield className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Code Snippet Circle - Script d'Authentification</CardTitle>
              <CardDescription>
                Script à placer dans Settings → Code Snippets → JavaScript
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Script complet (définit circleUser + répond aux demandes d'auth)</Label>
            <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all max-h-64 overflow-y-auto">
              {authScript}
            </div>
            <Button
              onClick={handleCopyAuthScript}
              className="w-full"
              data-testid="button-copy-auth-script"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copier le script complet
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
