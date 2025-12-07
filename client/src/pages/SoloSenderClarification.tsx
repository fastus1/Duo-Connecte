import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { WarningBanner } from '@/components/WarningBanner';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';

export default function SenderClarification() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="space-y-6 md:space-y-8">
        <WarningBanner type="speaker">
          {session.receiverName} écoute sans parler
        </WarningBanner>

        <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
          {session.senderName}, précise ce qui est important
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Clarifie ou corrige ce qui n'a pas été bien compris
        </p>

        <div className="space-y-3 md:space-y-4">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Reprends les points qui nécessitent une clarification
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Ajoute ce qui manquait à ta première explication
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Sois précis sur ce qui te semble mal compris
              </span>
            </li>
          </ul>

          <ExpandableSection>
            <p className="mb-4">
              Cette étape te permet de rectifier ou d'ajouter des précisions importantes. Peut-être que {session.receiverName} a reformulé quelque chose de façon inexacte, ou peut-être as-tu oublié de mentionner un élément important.
            </p>
            <p className="mb-4">
              Concentre-toi sur ce qui a besoin d'être clarifié. Tu n'as pas besoin de tout répéter, seulement les points qui demandent une correction ou un ajout.
            </p>
            <p className="mb-4">
              Par exemple: "Quand tu as dit que je me sentais en colère, c'était plus de la déception que de la colère" ou "J'aimerais ajouter que l'impact sur moi est aussi que je deviens distant".
            </p>
          </ExpandableSection>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-foreground">
            {session.receiverName} va ensuite reformuler à nouveau ces clarifications pour s'assurer d'avoir bien compris.
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
