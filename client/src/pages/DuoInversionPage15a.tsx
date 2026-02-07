import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Ear, MessageSquare, Heart, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal } from '@/components/flow';

export default function DuoInversionPage15a() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(34);
  };

  const theoryPages = [
    {
      title: "Valider, c'est reconnaître",
      icon: Heart,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce que signifie vraiment valider :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Reformuler, c'est reconnaître, pas approuver. Tu ne valides pas si {session.senderName} a raison ou tort. Tu reconnais qu'il/elle a vécu ces émotions face à la même situation que toi.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Pourquoi c'est si puissant :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Être entendu·e apaise. Même si vous avez vécu la même situation différemment, reformuler montre que tu reconnais son vécu. C'est ça qui crée la connexion. Ça permet de comprendre qu'une même situation peut être vécue de deux façons complètement différentes.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Le contexte inversé",
      icon: Users,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              L'importance de cette validation dans le contexte inversé :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Vous venez tous·tes les deux de partager votre vécu face à la même situation. En reformulant maintenant, tu montres que tu peux accueillir sa perspective même si elle est différente de la tienne.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Ce n'est pas un débat sur qui a raison. C'est reconnaître que vous avez tous·tes les deux vécu quelque chose de réel et de valide.
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
          Valide {session.senderName}
        </h1>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <MessageSquare className="w-5 h-5 text-primary" />
          <p className="text-base md:text-lg text-muted-foreground">
            C'est au tour de {session.receiverName} de parler
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
              {session.receiverName}, reformule ce que tu viens d'entendre
            </h2>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Répète le vécu de {session.senderName} dans tes mots
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Montre que tu as entendu ses émotions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Reste neutre, sans juger ni minimiser
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-base text-foreground">
              Reformule simplement : "Si je comprends bien, tu te sens..."
            </p>
          </div>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Plus d'infos: Théories"
              pages={theoryPages}
              finalButtonText="J'ai terminé"
              onComplete={handleContinue}
            />
          </div>

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={isTransitioning}
              className="w-full md:w-auto px-8 min-w-48"
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
