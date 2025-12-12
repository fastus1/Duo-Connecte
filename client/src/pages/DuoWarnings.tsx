import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Warnings() {
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const warnings = [
    "Cet outil n'est pas un substitut à une thérapie relationnelle",
    "Vous devez avoir un minimum de compétences relationnelles, de responsabilité et de gestion émotionnelle pour pouvoir utiliser cet outil convenablement",
    "Cet outil n'est pas fait pour gérer les crises, si vous êtes trop déclenché et que vous avez de la difficulté à gérer vos émotions, prenez un temps chacun de votre côté pour décanter",
    "Le piège principal est d'aller trop vite. Un rythme lent est essentiel pour que cet outil soit efficace",
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Avant de commencer
        </h1>

        <div className="w-full max-w-2xl space-y-3 md:space-y-4">
          {warnings.map((warning, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg bg-card border border-card-border"
              data-testid={`warning-${index}`}
            >
              <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-semibold text-destructive">!</span>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-foreground">
                {warning}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center pt-4 space-y-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => transitionToStep(3)}
            disabled={isTransitioning}
            className="px-12 text-destructive border-destructive hover:bg-destructive/10"
            data-testid="button-understood"
          >
            J'ai compris, continuer
          </Button>
          {isTransitioning && (
            <Progress value={progress} className="w-64 [&>div]:bg-destructive" />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
