import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { WarningBanner } from '@/components/WarningBanner';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';

export default function SenderValidation() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="space-y-6 md:space-y-8">
        <WarningBanner type="speaker" speaker={session.senderName}>
          C'est au tour de {session.senderName} de parler
        </WarningBanner>

        <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
          {session.senderName}, redis ce que tu as entendu
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Valide que tu as bien compris les émotions de {session.receiverName}
        </p>

        <div className="space-y-3 md:space-y-4">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Répète le vécu de {session.receiverName}
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
            Reformule simplement : "Si je comprends bien, tu te sens... [les émotions que tu as entendues]"
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            size="lg"
            onClick={() => transitionToStep(18)}
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
