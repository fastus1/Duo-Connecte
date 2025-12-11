import { useSession } from '@/contexts/SessionContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageLayout } from '@/components/PageLayout';

export default function SoloPresentation() {
  const { updateSession } = useSession();
  const [, setLocation] = useLocation();

  const handleBack = () => {
    updateSession({ appType: 'solo', currentStep: 0 });
    setLocation('/welcome');
  };

  return (
    <PageLayout showBackButton={true}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Présentation</h1>
          <p className="text-muted-foreground">Parcours Solo</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                Contenu du parcours Solo à venir...
              </p>
              <p className="text-sm text-muted-foreground">
                Cette page est en cours de développement.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleBack}
            data-testid="button-back-welcome"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
