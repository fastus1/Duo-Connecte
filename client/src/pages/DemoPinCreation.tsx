import { Lock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DemoPinCreation() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg" data-testid="card-pin-creation-demo">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold text-center">
            Bienvenue, Profile !
          </CardTitle>
          <CardDescription className="text-center text-base">
            Créez un NIP de 4 à 6 chiffres pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-base font-medium">
                  Nouveau NIP <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Entrez 4-6 chiffres"
                    className="pr-10 text-lg tracking-widest"
                    data-testid="input-new-pin"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPin" className="text-base font-medium">
                  Confirmer le NIP <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPin"
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Confirmez votre NIP"
                    className="pr-10 text-lg tracking-widest"
                    data-testid="input-confirm-pin"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <Alert className="bg-muted/50 border-muted">
              <AlertDescription className="text-sm">
                <span className="font-medium text-primary">Conseil de sécurité :</span>{' '}
                Choisissez un NIP que vous pourrez mémoriser facilement, mais qui ne soit pas évident (évitez 1234, votre année de naissance, etc.)
              </AlertDescription>
            </Alert>

            <Button 
              className="w-full h-12 text-base font-medium"
              data-testid="button-create-pin"
            >
              Créer mon NIP
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
