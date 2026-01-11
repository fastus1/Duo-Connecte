import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Ear, MessageSquare, Heart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal, Callout } from '@/components/flow';

export default function SenderValidation() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(16);
  };

  const theoryPages = [
    {
      title: "Ce que signifie valider",
      icon: Heart,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Reformuler est un acte de reconnaissance, pas d'approbation. Tu ne valides pas si sa perception est juste ou fausse, tu reconnais qu'il ou elle a vécu les émotions mentionnées.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Pourquoi c'est si puissant :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Être entendu et validé apaise profondément. Ce n'est pas l'accord sur les faits qui importe ici, c'est la reconnaissance du vécu. C'est ça qui crée la connexion.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Ear className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Validation du feedback de {session.receiverName}
        </h1>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <MessageSquare className="w-5 h-5 text-primary" />
          <p className="text-base md:text-lg text-muted-foreground">
            C'est au tour de {session.senderName} de parler
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
            {session.senderName}, reformule ce que tu viens d'entendre
          </h2>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Répète le vécu de {session.receiverName}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Nomme ce que tu as entendu de ton mieux
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Reste neutre, sans juger ni minimiser
              </span>
            </li>
          </ul>

          <Callout variant="primary">
            <p className="text-sm md:text-base">
              Reformule simplement : "Si je comprends bien, tu te sens..."
            </p>
          </Callout>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Plus d'infos: Théories"
              pages={theoryPages}
              finalButtonText="J'ai terminé"
              onComplete={handleContinue}
            />
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={isTransitioning}
                className="min-w-48"
                data-testid="button-next"
              >
                J'ai terminé
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
