import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart } from 'lucide-react';
import { Lightbulb } from 'lucide-react';

export default function DuoPresentation() {
  const { isTransitioning, transitionToStep } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(1);
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Heart className="w-8 h-8 text-primary" />
        </div>

        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground">
            Se connecter
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Vous avez choisi d'avoir une conversation authentique. C'est un beau geste de confiance envers vous-même et l'autre personne.
          </p>
        </div>

        <div className="w-full max-w-lg space-y-6">
          <p className="text-base md:text-lg text-foreground leading-relaxed">
            Ce parcours vous guidera pas à pas pour:
          </p>

          <ul className="space-y-3 text-base md:text-lg text-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Exprimer votre vécu avec clarté</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Écouter l'autre avec bienveillance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Comprendre les deux perspectives d'une même situation</span>
            </li>
          </ul>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Conseil</p>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  Assurez-vous d'avoir 30 à 45 minutes devant vous, sans interruption. Choisissez un endroit calme où vous vous sentez en sécurité.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-lg pt-4">
          <Button
            onClick={handleContinue}
            disabled={isTransitioning}
            className="w-full"
            data-testid="button-continue"
          >
            Je suis prêt·e à commencer
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
