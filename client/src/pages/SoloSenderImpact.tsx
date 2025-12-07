import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { WarningBanner } from '@/components/WarningBanner';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';

export default function SenderImpact() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
        <div className="space-y-6 md:space-y-8">
          <WarningBanner type="speaker">
            {session.receiverName} écoute sans parler
          </WarningBanner>

          <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
            {session.senderName}, quel a été l'impact sur toi?
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Parle des conséquences
          </p>

          <div className="space-y-3 md:space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Quand ça arrive, je me sens rejeté / pas important / incompris...
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  L'impact sur moi est que...
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Je réagis généralement en...
                </span>
              </li>
            </ul>

            <ExpandableSection>
              <p className="mb-4">
                Maintenant, partage les conséquences que cette situation a sur toi. Comment cela affecte-t-il ton bien-être, ta relation, ta façon d'agir?
              </p>
              <p className="mb-4">
                Les impacts peuvent être variés :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Défensif : tu te protèges, tu te justifies</li>
                <li>Coupure : tu te retires, tu crées de la distance</li>
                <li>Accrochage : tu contre-attaques, tu reproches</li>
                <li>Bouderie : tu te renfermes, tu deviens silencieux</li>
                <li>Anxiété : tu te sens insécure, inquiet</li>
              </ul>
              <p>
                Partage honnêtement comment cette situation t'affecte et comment tu as tendance à réagir quand cela arrive.
              </p>
            </ExpandableSection>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              size="lg"
              onClick={() => transitionToStep(12)}
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
