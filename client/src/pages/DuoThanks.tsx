import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Award, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Thanks() {
  const { session, updateSession } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();
  const [followUpNeeded, setFollowUpNeeded] = useState<boolean | null>(
    session.suiviNecessaire ?? null
  );

  const handleContinue = () => {
    if (followUpNeeded !== null) {
      updateSession({ suiviNecessaire: followUpNeeded });
      transitionToStep(25);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-2">
          <Award className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold font-sans text-foreground">
          Félicitations!
        </h1>

        <div className="space-y-5 md:space-y-6">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 space-y-4">
            <p className="text-lg leading-relaxed text-foreground">
              Vous avez terminé ce processus de communication guidée. C'est un bel accomplissement!
            </p>

            <p className="text-base text-muted-foreground leading-relaxed">
              Prendre le temps d'avoir ce type de conversation demande du courage et de la vulnérabilité. Prenez un moment pour vous remercier mutuellement pour votre présence et votre écoute.
            </p>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Un suivi est-il nécessaire?
            </h3>

            <p className="text-sm text-muted-foreground">
              Avez-vous besoin de planifier une autre conversation ou un moment pour vérifier comment les choses évoluent?
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                variant={followUpNeeded === true ? "default" : "outline"}
                onClick={() => setFollowUpNeeded(true)}
                className="gap-2"
                data-testid="button-followup-yes"
              >
                <CheckCircle2 className="w-5 h-5" />
                Oui, un suivi serait utile
              </Button>

              <Button
                size="lg"
                variant={followUpNeeded === false ? "default" : "outline"}
                onClick={() => setFollowUpNeeded(false)}
                className="gap-2"
                data-testid="button-followup-no"
              >
                Non, pas nécessaire
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 pb-8 space-y-3">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={followUpNeeded === null || isTransitioning}
            className="w-full md:w-auto px-8 min-w-48"
            data-testid="button-next"
          >
            Terminer
          </Button>
          {isTransitioning && (
            <Progress value={progress} className="w-full md:w-48" />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
