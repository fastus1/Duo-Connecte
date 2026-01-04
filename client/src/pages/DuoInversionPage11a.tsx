import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';
import { ListChecks, VolumeX, CheckCircle2 } from 'lucide-react';

export default function DuoInversionPage11a() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const checklistItems = [
    "Mon vécu (comment je me suis senti)",
    "Mon interprétation (comment j'ai perçu la situation)",
    "L'impact (les conséquences pour moi)",
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <ListChecks className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Fais un résumé
        </h1>

        <div className="flex items-center gap-2">
          <VolumeX className="w-5 h-5 text-destructive" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.senderName} : écoute attentive et bienveillante
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              {session.receiverName}, reprends les 3 points que tu viens de partager
            </h2>

            <p className="text-base md:text-lg text-muted-foreground">
              Fais un bref résumé oral en reprenant ces 3 éléments :
            </p>

            <div className="space-y-3">
              {checklistItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card border border-card-border hover-elevate transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base md:text-lg leading-relaxed">
                    {index + 1}. {item}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-base text-muted-foreground italic">
              Ce résumé aide {session.senderName} à bien comprendre l'ensemble de ton message avant de le reformuler.
            </p>
          </div>

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={() => transitionToStep(30)}
              className="w-full md:w-auto px-8 min-w-48"
              disabled={isTransitioning}
              data-testid="button-next"
            >
              Étape suivante
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
