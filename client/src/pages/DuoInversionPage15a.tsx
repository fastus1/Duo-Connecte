import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Ear, Volume2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DuoInversionPage15a() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Ear className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Valide {session.senderName}
        </h1>

        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-destructive" />
          <p className="text-base md:text-lg text-muted-foreground">
            C'est au tour de {session.receiverName} de parler
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              {session.receiverName}, redis ce que tu as entendu
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Valide que tu as bien compris {session.senderName}
            </p>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Répète le vécu de {session.senderName}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Valide que tu as bien compris ses émotions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Ne juge pas, ne minimise pas
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-foreground">
              Reformule simplement : "Si je comprends bien, tu te sens..."
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => transitionToStep(34)}
                disabled={isTransitioning}
                className="min-w-48"
                data-testid="button-next"
              >
                Étape suivante
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
