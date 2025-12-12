import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Anchor } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ReceiverGrounding() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Anchor className="w-8 h-8 text-primary" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
            Ici et maintenant
          </h1>
          <span className="text-sm text-muted-foreground">2/2</span>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              {session.receiverName}, prends le temps de te déposer...
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Comment te sens-tu à l'idée d'écouter {session.senderName}?
            </p>
          </div>

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
        </div>

        <div className="flex flex-col items-center pt-4 space-y-4">
          <Button
            size="lg"
            onClick={() => transitionToStep(6)}
            disabled={isTransitioning}
            className="px-12"
            data-testid="button-next"
          >
            Suivant
          </Button>
          {isTransitioning && (
            <Progress value={progress} className="w-64" />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
