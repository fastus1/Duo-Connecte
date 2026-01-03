import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Anchor, Heart, Brain, MessageCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal, Subtitle, BulletList } from '@/components/flow';

export default function SenderGrounding() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(5);
  };

  const theoryPages = [
    {
      title: "Préparer le terrain",
      icon: Heart,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Avant de plonger dans le vif du sujet, prends un moment pour nommer ton état. C'est comme mettre la table avant le repas : ça crée les conditions pour bien accueillir ce qui va suivre.
          </p>
        </div>
      )
    },
    {
      title: "Pourquoi c'est important",
      icon: Brain,
      content: (
        <div className="space-y-8">
          <Subtitle>Pourquoi c'est important</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Quand tu nommes ton état émotionnel, ton système nerveux se calme. Tu sors du mode réactif et tu deviens plus présent. Ça crée une pause entre ce que tu ressens et ce que tu vas dire.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Pour {session.receiverName}, entendre ce que tu vis change tout. Ça désarme. Au lieu de se préparer à se défendre, il/elle peut t'accueillir. Ça baisse les défenses des deux côtés.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Sans nommer ton état, ce que tu ressens peut être mal interprété. Nommer ton émotion la rend acceptable et met la table pour une conversation authentique plutôt que défensive.
          </p>
        </div>
      )
    },
    {
      title: "Exemples",
      icon: MessageCircle,
      content: (
        <div className="space-y-8">
          <Subtitle>Voici quelques exemples de ce que tu pourrais dire</Subtitle>
          
          <BulletList
            variant="primary"
            items={[
              "« Je me sens nerveux·se parce que ce sujet est important pour moi… »",
              "« J'ai peur qu'on se dispute… »",
              "« Je suis soulagé·e qu'on prenne enfin ce temps ensemble… »",
              "« Je suis fatigué·e, mais je veux vraiment régler ça… »"
            ]}
          />
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Anchor className="w-8 h-8 text-primary" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
            Ici et maintenant - 1/2
          </h1>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
            {session.senderName}, prends un moment pour te déposer…
          </h2>

          <div className="space-y-3 md:space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Identifie ce que tu ressens en ce moment (nervosité, confiance, hésitation...)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Nomme tes émotions face à l'idée de parler à {session.receiverName}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Prends le temps de te déposer et laisse monter ce qui est là
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
