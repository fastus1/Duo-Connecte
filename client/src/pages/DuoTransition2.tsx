import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Transition2() {
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Lightbulb className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Passons au besoin!
        </h1>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              Êtes-vous prêts à passer à l'étape suivante?
            </h2>

            <p className="text-base md:text-lg text-foreground leading-relaxed">
              Vous allez maintenant aborder la question des besoins et des demandes. C'est le moment de formuler ce qui pourrait améliorer la situation.
            </p>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Continuez à prendre votre temps et à écouter avec bienveillance.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => transitionToStep(18)}
                disabled={isTransitioning}
                className="min-w-48"
                data-testid="button-continue"
              >
                Oui, on continue
              </Button>
            </div>
            
            {isTransitioning && (
              <div className="flex justify-center">
                <Progress value={progress} className="w-full md:w-48" />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
