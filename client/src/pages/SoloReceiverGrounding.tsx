import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';

export default function ReceiverGrounding() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
        <div className="space-y-6 md:space-y-8">
          <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
            {session.receiverName}, prends le temps de te déposer
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Comment te sens-tu à l'idée d'écouter {session.senderName}?
          </p>

          <div className="space-y-3 md:space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Parle de ce que tu ressens maintenant, en ce moment précis
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Exprime ton état d'esprit face à cette conversation qui arrive
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Prends le temps de reconnaître tes émotions présentes
                </span>
              </li>
            </ul>

            <ExpandableSection>
              <p className="mb-4">
                En tant que récepteur, ton rôle est d'écouter avec bienveillance. Mais avant de pouvoir vraiment écouter l'autre, il est important que tu reconnaisses ton propre état émotionnel.
              </p>
              <p>
                Peut-être ressens-tu de l'ouverture, de la curiosité, mais aussi peut-être de l'appréhension ou de la défensive. Tous ces ressentis sont valides. Les exprimer maintenant te permet de les reconnaître et de te préparer à accueillir ce que {session.senderName} va partager.
              </p>
            </ExpandableSection>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              size="lg"
              onClick={() => transitionToStep(7)}
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
