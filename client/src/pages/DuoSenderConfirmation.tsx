import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { CheckCheck, VolumeX } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SenderConfirmation() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <CheckCheck className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          As-tu été bien entendu?
        </h1>

        <div className="flex items-center gap-2">
          <VolumeX className="w-5 h-5 text-destructive" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.receiverName} : écoute attentive
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              {session.senderName}, {session.receiverName} vient de reformuler ce que tu as partagé, est-ce que tu as bien été entendu?
            </h2>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Ajoute des précisions si nécessaire
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Rectifie ce qui n'est pas tout à fait juste
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Appuie sur ce qui est particulièrement important pour toi
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Valide que {session.receiverName} t'as bien entendu si nécessaire
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-foreground">
              L'objectif est que {session.receiverName} comprenne vraiment ce que tu vis. Prends le temps nécessaire pour t'assurer que ton message est bien passé.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => transitionToStep(13)}
                disabled={isTransitioning}
                className="min-w-48"
                data-testid="button-confirm"
              >
                <CheckCheck className="w-5 h-5 mr-2" />
                J'ai été entendu
              </Button>
            </div>
            
            {isTransitioning && (
              <div className="flex justify-center">
                <Progress value={progress} className="w-full md:w-48" />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
