import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DuoInversionPage20a() {
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <ArrowRight className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Transition vers la clôture
        </h1>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4 text-center">
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              Les deux perspectives ont été partagées. Il est maintenant temps de clôturer en vous partageant un dernier feedback sur comment vous vous sentez après tous ces échanges.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => transitionToStep(21)}
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
