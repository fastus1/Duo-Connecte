import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { CheckCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ReceiverConfirmation() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <CheckCheck className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Tu as été bien entendu {session.receiverName}?
        </h1>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              {session.senderName} vient de reformuler ce que tu as partagé
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Si {session.senderName} a bien entendu ce que tu as nommé, tu peux continuer. Sinon, prends le temps de rectifier et de préciser ce qui est important pour toi.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => transitionToStep(16)}
                disabled={isTransitioning}
                className="min-w-48"
                data-testid="button-confirm"
              >
                <CheckCheck className="w-5 h-5 mr-2" />
                J'ai été entendu
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
