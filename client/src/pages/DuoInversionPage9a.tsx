import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { MessageSquare, Ear, Eye, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal } from '@/components/flow';

export default function DuoInversionPage9a() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(28);
  };

  const theoryPages = [
    {
      title: "Ta vision des choses",
      icon: Eye,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Ta vision de la situation a créé tes émotions. Comment tu as interprété ce qui s'est passé explique ce que tu as ressenti.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Pourquoi c'est important
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Vos deux interprétations peuvent être complètement différentes. Nommer la tienne comme <em>ta</em> lecture (pas <em>la</em> vérité) permet à {session.senderName} de comprendre ton point de vue.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Exemples :
            </p>
            <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>"Quand je suis parti sans dire au revoir, c'est parce que je me sentais dépassé et j'avais besoin de prendre l'air."</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>"Quand j'ai regardé mon téléphone pendant que tu parlais, je pensais juste vérifier l'heure, je ne réalisais pas que ça te blessait."</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>"Quand je n'ai pas répondu tout de suite, pour moi je réfléchissais à ce que tu venais de dire."</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Formulations qui aident",
      icon: Lightbulb,
      content: (
        <div className="space-y-8">
          <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span>J'ai eu l'impression que...</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span>Je me suis dit que...</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span>Pour moi, ça signifiait que...</span>
            </li>
          </ul>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Ces formules reconnaissent que c'est ton interprétation.
          </p>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Nomme ta vision des choses
        </h1>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <Ear className="w-5 h-5 text-primary" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.senderName} : écoute attentive et bienveillante
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
              {session.receiverName}, parle de comment tu as perçu la situation
            </h2>

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
          </div>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Plus d'infos: Théories"
              pages={theoryPages}
              finalButtonText="Étape suivante"
              onComplete={handleContinue}
            />
          </div>

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={handleContinue}
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
