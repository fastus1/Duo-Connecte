import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Transition1() {
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="space-y-6 md:space-y-8">
        <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
          Êtes-vous prêts à passer à l'étape suivante?
        </h1>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 space-y-4">
          <p className="text-lg leading-relaxed text-foreground">
            Vous allez maintenant entrer dans le vif du sujet. L'émetteur va partager son vécu pendant que le récepteur écoute avec attention.
          </p>

          <p className="text-base text-muted-foreground leading-relaxed">
            Rappelez-vous : prenez votre temps à chaque étape. Il n'y a aucune urgence.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            size="lg"
            onClick={() => transitionToStep(8)}
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
    </PageLayout>
  );
}
