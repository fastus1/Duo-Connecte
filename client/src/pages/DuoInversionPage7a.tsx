import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DuoInversionPage7a() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <RefreshCw className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Découvrir la perspective de {session.senderName}
        </h1>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 space-y-4">
            <p className="text-lg leading-relaxed text-foreground">
              Vous allez maintenant inverser les rôles pour explorer la même situation du point de vue de {session.receiverName}.
            </p>

            <p className="text-lg font-medium leading-relaxed text-foreground">
              À {session.receiverName} d'exprimer son vécu!
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              Ce qui change :
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  <strong>{session.receiverName}</strong> partage son vécu et sa vision <strong>de la même situation</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  <strong>{session.senderName}</strong> écoute bienveillant dans le silence, comme lors du premier tour
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              Pourquoi c'est important :
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Cette étape permet d'explorer les deux perspectives d'une même situation. Chacun a vécu les mêmes événements différemment, et comprendre le point de vue de l'autre enrichit votre compréhension mutuelle.
            </p>
          </div>

          <p className="text-base md:text-lg leading-relaxed text-muted-foreground text-center italic">
            Prenez le temps de bien vous installer dans vos nouveaux rôles. L'écoute bienveillante reste tout aussi importante dans ce deuxième tour.
          </p>

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={() => transitionToStep(26)}
              disabled={isTransitioning}
              className="w-full md:w-auto px-8 min-w-48"
              data-testid="button-start"
            >
              C'est parti !
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
