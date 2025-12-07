import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { CheckCircle2, Edit3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ReceiverConfirmation() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="space-y-6 md:space-y-8">
        <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
          {session.receiverName}, as-tu été bien entendu?
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          {session.senderName} vient de reformuler ce que tu as partagé
        </p>

        <div className="space-y-3 md:space-y-4">
          <p className="text-base md:text-lg leading-relaxed">
            Si {session.senderName} a bien compris tes émotions, tu peux continuer. Sinon, prends le temps de préciser ce qui est important pour toi.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => transitionToStep(16)}
              disabled={isTransitioning}
              className="min-w-48"
              data-testid="button-clarify"
            >
              <Edit3 className="w-5 h-5 mr-2" />
              Je veux préciser
            </Button>

            <Button
              size="lg"
              onClick={() => transitionToStep(19)}
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
