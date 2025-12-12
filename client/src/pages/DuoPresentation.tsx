import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DuoPresentation() {
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(1);
  };

  const steps = [
    "Exprimer votre vécu avec clarté",
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
          Vous avez choisi d'avoir une conversation authentique. C'est un beau geste de confiance envers vous-même et l'autre personne.
        </p>

        <div className="w-full max-w-2xl space-y-4">
          <p className="text-base md:text-lg text-foreground leading-relaxed">
            Ce parcours vous guidera pas à pas pour:
          </p>

          <ul className="space-y-2 text-base md:text-lg text-foreground list-disc list-inside">
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>

          <div className="bg-card border border-card-border rounded-lg p-4 mt-6">
            <p className="font-semibold text-foreground">Conseil</p>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Assurez-vous d'avoir 30 à 45 minutes devant vous, sans interruption. Choisissez un endroit calme où vous vous sentez en sécurité.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center pt-4 space-y-4">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={isTransitioning}
            className="px-12"
            data-testid="button-continue"
          >
            Je suis prêt·e à commencer
          </Button>
          {isTransitioning && (
            <Progress value={progress} className="w-64" />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
