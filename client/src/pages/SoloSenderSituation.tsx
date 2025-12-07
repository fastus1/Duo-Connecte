import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { WarningBanner } from '@/components/WarningBanner';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';

export default function SenderSituation() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="space-y-6 md:space-y-8">
        <WarningBanner type="speaker">
          {session.receiverName} écoute sans parler
        </WarningBanner>

        <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
          {session.senderName}, de quoi veux-tu parler?
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Nomme la situation
        </p>

        <div className="space-y-3 md:space-y-4">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Reste objectif et factuel
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Ne parle pas encore de tes émotions
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Sois bref - environ 1 minute
              </span>
            </li>
          </ul>

          <ExpandableSection>
            <p className="mb-4">
              À cette étape, décris uniquement ce qui s'est passé de manière factuelle, comme si tu racontais une scène à une caméra. Évite d'interpréter les intentions de l'autre ou d'exprimer tes émotions pour l'instant.
            </p>
            <p>
              Par exemple, au lieu de dire "Tu m'as ignoré", dis plutôt "Hier soir, quand je t'ai parlé, tu as continué à regarder ton téléphone". Concentre-toi sur les faits observables.
            </p>
          </ExpandableSection>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            size="lg"
            onClick={() => transitionToStep(9)}
            disabled={isTransitioning}
            className="w-full md:w-auto px-8 min-w-48"
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
