import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { WarningBanner } from '@/components/WarningBanner';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';

export default function SenderSummary() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const checklistItems = [
    "La situation (qu'est-ce qui s'est passé)",
    "Mon vécu (comment je me suis senti)",
    "Mon interprétation (comment j'ai perçu la situation)",
    "L'impact (les conséquences pour moi)",
  ];

  return (
    <PageLayout>
      <div className="space-y-6 md:space-y-8">
        <WarningBanner type="speaker">
          {session.receiverName} écoute sans parler
        </WarningBanner>

        <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
          {session.senderName}, fais un résumé
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Reprends les 4 points que tu viens de partager
        </p>

        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Fais un bref résumé oral en reprenant ces 4 éléments :
          </p>

          <div className="space-y-3">
            {checklistItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-background"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-base leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-foreground">
            Ce résumé aide {session.receiverName} à bien comprendre l'ensemble de ton message avant de le reformuler.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            size="lg"
            onClick={() => transitionToStep(13)}
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
