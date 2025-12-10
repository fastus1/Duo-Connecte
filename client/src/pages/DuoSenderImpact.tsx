import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { MessageSquare, VolumeX } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SenderImpact() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Nomme l'impact et ta réaction
        </h1>

        <div className="flex items-center gap-2">
          <VolumeX className="w-5 h-5 text-destructive" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.receiverName} : écoute attentive et bienveillante
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              {session.senderName}, quel a été l'impact sur toi, comment as-tu réagis?
            </h2>

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
          </div>

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={() => transitionToStep(10)}
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
      </div>
    </PageLayout>
  );
}
