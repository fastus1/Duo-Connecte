import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';

export default function SenderGrounding() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
        <div className="space-y-6 md:space-y-8">
          <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
            {session.senderName}, prends le temps de te déposer
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Comment te sens-tu à l'idée de t'exprimer?
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
                  Ne parle pas encore du sujet de la conversation
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Prends tout ton temps pour exprimer ton état présent
                </span>
              </li>
            </ul>

            <ExpandableSection>
              <p className="mb-4">
                Cette étape te permet de te connecter à ton état émotionnel actuel avant d'aborder le sujet qui te préoccupe. C'est un moment pour toi de reconnaître ce que tu vis maintenant : peut-être de la nervosité, de l'appréhension, de l'espoir, ou toute autre émotion.
              </p>
              <p>
                En exprimant ces ressentis à voix haute, tu te prépares intérieurement et tu permets à l'autre de comprendre ton état d'esprit avant même que la conversation commence vraiment.
              </p>
            </ExpandableSection>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              size="lg"
              onClick={() => transitionToStep(6)}
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
