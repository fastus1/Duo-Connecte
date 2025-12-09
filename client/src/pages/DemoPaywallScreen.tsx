import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, ExternalLink, Info } from 'lucide-react';

export default function DemoPaywallScreen() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Accès Réservé</CardTitle>
                    <CardDescription>
                        Cette application est réservée aux membres ayant souscrit à l'offre.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button className="w-full" data-testid="button-purchase">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Souscrire à l'offre
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-info">
                        <Info className="w-4 h-4 mr-2" />
                        En savoir plus
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                        Ceci est un aperçu de l'écran Paywall affiché aux utilisateurs non-membres.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
