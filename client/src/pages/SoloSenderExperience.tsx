import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { WarningBanner } from '@/components/WarningBanner';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';

export default function SenderExperience() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
        <div className="space-y-6 md:space-y-8">
          <WarningBanner type="speaker">
            {session.receiverName} écoute sans parler
          </WarningBanner>

          <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
            {session.senderName}, parle de ton vécu
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Dis ce que tu as vécu
          </p>

          <div className="space-y-3 md:space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Face à cette situation, je me sens...
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Reste sur toi et tes émotions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Prends ton temps pour identifier et nommer ce que tu ressens
                </span>
              </li>
            </ul>

            <ExpandableSection>
              <p className="mb-4">
                C'est le moment de partager tes émotions face à la situation que tu viens de décrire. Nomme précisément ce que tu ressens : tristesse, colère, frustration, déception, peur, etc.
              </p>
              <p className="mb-4">
                Reste dans le moment présent et parle de TES émotions, pas de ce que l'autre a fait ou devrait faire. Utilise des phrases comme "Je me sens..." plutôt que "Tu m'as fait sentir...".
              </p>
              <p>
                Il est normal d'avoir plusieurs émotions en même temps. Prends le temps de les identifier et de les exprimer toutes.
              </p>
            </ExpandableSection>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              size="lg"
              onClick={() => transitionToStep(10)}
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
