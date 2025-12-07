import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';

export default function ReceiverClosing() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="space-y-6 md:space-y-8">
        <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
          {session.receiverName}, comment te sens-tu maintenant?
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Après cet échange, partage ton ressenti
        </p>

        <div className="space-y-3 md:space-y-4">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Après cet échange, je me sens...
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Ce qui me reste de cette conversation...
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-foreground">
            Reconnaissez mutuellement l'effort et le courage qu'il a fallu pour avoir cette conversation.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            size="lg"
            onClick={() => transitionToStep(25)}
            className="w-full md:w-auto px-8 min-w-48"
            disabled={isTransitioning}
            data-testid="button-next"
          >
            Suivant
          </Button>
          {isTransitioning && (
            <Progress value={progress} className="w-full md:w-48" />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
