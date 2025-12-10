import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Play, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Transition1() {
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Play className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Prêts à continuer?
        </h1>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 space-y-4">
            <p className="text-lg leading-relaxed text-foreground">
              Vous allez maintenant entrer dans le vif du sujet. L'émetteur va partager son vécu pendant que le récepteur écoute avec attention.
            </p>

            <p className="text-base text-muted-foreground leading-relaxed">
              Rappelez-vous : prenez votre temps à chaque étape. Il n'y a aucune urgence.
            </p>
          </div>

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={() => transitionToStep(6)}
              disabled={isTransitioning}
              className="w-full md:w-auto px-8 min-w-48"
              data-testid="button-continue"
            >
              Oui, on continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            {isTransitioning && (
              <Progress value={progress} className="w-full md:w-48" />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
