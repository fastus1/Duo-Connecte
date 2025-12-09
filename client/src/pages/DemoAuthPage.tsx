import { useState } from 'react';
import { Loader2, AlertCircle, Shield, LogIn, Lock, ExternalLink, Info } from 'lucide-react';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DemoAuthPage() {
  const [activeDemo, setActiveDemo] = useState<'waiting' | 'pin_login' | 'pin_create'>('waiting');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <Logo size="lg" className="mb-8" />

        <div className="mb-4 text-xs text-muted-foreground bg-orange-500/10 px-3 py-1 rounded-full">
          Aperçu - Page de connexion
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="flex gap-2 justify-center mb-6">
            <Button
              variant={activeDemo === 'waiting' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveDemo('waiting')}
            >
              Attente Circle.so
            </Button>
            <Button
              variant={activeDemo === 'pin_login' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveDemo('pin_login')}
            >
              Connexion NIP
            </Button>
            <Button
              variant={activeDemo === 'pin_create' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveDemo('pin_create')}
            >
              Création NIP
            </Button>
          </div>

          {activeDemo === 'waiting' && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  Connexion en cours
                </CardTitle>
                <CardDescription>
                  En attente des données Circle.so...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Authentification Circle.so</AlertTitle>
                  <AlertDescription>
                    Cette page attend les données d'authentification de Circle.so via postMessage.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {activeDemo === 'pin_login' && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Entrez votre NIP</CardTitle>
                <CardDescription>
                  Bonjour <strong>Jean Dupont</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Input
                      key={i}
                      type="password"
                      maxLength={1}
                      className="w-10 h-12 text-center text-lg"
                      defaultValue={i <= 4 ? "•" : ""}
                    />
                  ))}
                </div>
                <Button className="w-full" data-testid="button-validate-pin">
                  <LogIn className="w-4 h-4 mr-2" />
                  Valider
                </Button>
              </CardContent>
            </Card>
          )}

          {activeDemo === 'pin_create' && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
                <CardTitle>Créez votre NIP</CardTitle>
                <CardDescription>
                  Bienvenue <strong>Marie Martin</strong> ! Créez un code personnel de 4 à 6 chiffres.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nouveau NIP</Label>
                  <Input type="password" placeholder="••••••" />
                </div>
                <div className="space-y-2">
                  <Label>Confirmer le NIP</Label>
                  <Input type="password" placeholder="••••••" />
                </div>
                <Button className="w-full" data-testid="button-create-pin">
                  <Shield className="w-4 h-4 mr-2" />
                  Créer mon NIP
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
