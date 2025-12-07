import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Intention() {
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
          <Heart className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
          Rappel important
        </h1>

        <div className="space-y-5 md:space-y-6">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 space-y-4">
            <p className="text-lg md:text-xl leading-relaxed text-foreground font-medium">
              Malgré les malaises et inconforts que ça peut créer, le but de la communication est d'être bien ensemble.
            </p>

            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Apprendre à vivre l'inconfort et rester en lien est crucial pour bien communiquer.
            </p>
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="leading-relaxed">
              Cette conversation n'est pas un débat à gagner, mais un moment de connexion authentique. L'objectif n'est pas d'avoir raison, mais de se comprendre mutuellement.
            </p>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            size="lg"
            onClick={() => transitionToStep(5)}
            disabled={isTransitioning}
            className="w-full md:w-auto px-8 min-w-48"
            data-testid="button-next"
          >
            Suivant
          </Button>
          {isTransitioning && (
            <Progress value={progress} className="w-full md:w-48" />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
