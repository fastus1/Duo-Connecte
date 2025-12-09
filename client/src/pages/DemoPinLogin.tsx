import { Lock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DemoPinLogin() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg" data-testid="card-pin-login-demo">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold text-center">
            Bon retour !
          </CardTitle>
          <CardDescription className="text-center text-base">
            Entrez votre NIP pour accéder à l'application
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="login-pin" className="text-base font-medium">
                Votre NIP <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="login-pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Entrez votre NIP"
                  className="pr-10 text-lg tracking-widest"
                  data-testid="input-login-pin"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>

            <Button 
              className="w-full h-12 text-base font-medium"
              data-testid="button-login-pin"
            >
              Se connecter
            </Button>

            <div className="text-center">
              <button
                type="button"
                className="text-primary hover:underline text-sm font-medium"
                data-testid="link-forgot-pin"
              >
                NIP oublié ?
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
