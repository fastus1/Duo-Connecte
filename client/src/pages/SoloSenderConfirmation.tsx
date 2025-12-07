import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { CheckCircle2, Edit3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SenderConfirmation() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="space-y-6 md:space-y-8">
        <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
          {session.senderName}, as-tu été bien entendu?
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          {session.receiverName} vient de reformuler ce que tu as partagé
        </p>

        <div className="space-y-3 md:space-y-4">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Ajoute des précisions si nécessaire
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Rectifie ce qui n'est pas tout à fait juste
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Appuie sur ce qui est particulièrement important pour toi
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-foreground">
            L'objectif est que {session.receiverName} comprenne vraiment ce que tu vis. Prends le temps nécessaire pour t'assurer que ton message est bien passé.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => transitionToStep(15)}
              disabled={isTransitioning}
              className="min-w-48"
              data-testid="button-clarify"
            >
              <Edit3 className="w-5 h-5 mr-2" />
              Je veux ajouter/rectifier
            </Button>

            <Button
              size="lg"
              onClick={() => transitionToStep(16)}
              disabled={isTransitioning}
              className="min-w-48"
              data-testid="button-confirm"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Oui, c'est bien ça
            </Button>
          </div>
          
          {isTransitioning && (
            <div className="flex justify-center">
              <Progress value={progress} className="w-full md:w-48" />
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
