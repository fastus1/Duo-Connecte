import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { WarningBanner } from '@/components/WarningBanner';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';

export default function SenderInterpretation() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
        <div className="space-y-6 md:space-y-8">
          <WarningBanner type="speaker">
            {session.receiverName} écoute sans parler
          </WarningBanner>

          <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
            {session.senderName}, comment as-tu perçu la situation?
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Explique ton interprétation
          </p>

          <div className="space-y-3 md:space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Quand c'est arrivé, j'ai eu l'impression que...
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  J'ai vu ça de cette façon...
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Pour moi, ça voulait dire que...
                </span>
              </li>
            </ul>

            <ExpandableSection>
              <p className="mb-4">
                Nos émotions sont créées par notre interprétation personnelle des situations. Ce que tu as ressenti découle de comment tu as interprété ce qui s'est passé.
              </p>
              <p className="mb-4">
                Par exemple : si quelqu'un ne te salue pas le matin, tu pourrais interpréter que cette personne est fâchée contre toi (ce qui pourrait créer de l'anxiété), ou qu'elle est préoccupée par quelque chose (ce qui créerait de l'empathie).
              </p>
              <p>
                Partage maintenant comment TOI tu as interprété la situation. Utilise des formules comme "J'ai eu l'impression que...", "Je me suis dit que...", "Pour moi, ça signifiait que...". Reconnais que c'est ton interprétation, pas nécessairement la réalité.
              </p>
            </ExpandableSection>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              size="lg"
              onClick={() => transitionToStep(11)}
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
