import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { MessageSquare, VolumeX } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SenderInterpretation() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Nomme ta vision des choses
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
              {session.senderName}, parle de comment tu as perçu la situation
            </h2>

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
