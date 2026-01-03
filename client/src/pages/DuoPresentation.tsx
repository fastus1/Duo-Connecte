import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DuoPresentation() {
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(1);
  };

  const steps = [
    "Exprimer votre vécu",
    "Écouter l'autre avec bienveillance",
    "Comprendre les deux perspectives d'une même situation",
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Heart className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Se connecter
        </h1>

        <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center max-w-2xl">
          Ce guide vous aide à naviguer une conversation difficile avec authenticité. Il crée un espace pour vous rapprocher et dissiper les malaises entre vous.
        </p>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              Ce parcours vous guidera pas à pas pour:
            </p>

            <ul className="space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary text-xl">•</span>
                  <span className="text-base md:text-lg leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              Conseil
            </p>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Prévoyez 45 à 60 minutes dans un endroit calme, sans distractions, où vous vous sentez en sécurité.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center pt-4 space-y-4">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={isTransitioning}
            className="min-w-48"
            data-testid="button-continue"
          >
            Commencer le parcours
          </Button>
          {isTransitioning && (
            <Progress value={progress} className="w-64" />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
