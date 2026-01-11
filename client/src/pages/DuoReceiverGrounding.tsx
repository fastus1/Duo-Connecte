import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Anchor, Heart, Lightbulb, Brain, MessageCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal, Subtitle, BulletList } from '@/components/flow';

export default function ReceiverGrounding() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(6);
  };

  const theoryPages = [
    {
      title: "Ton rôle de récepteur",
      icon: Heart,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            En tant que récepteur, ton rôle est d'écouter avec bienveillance. Mais pour vraiment accueillir ce que l'autre va partager, tu dois d'abord reconnaître ton propre état intérieur.
          </p>
        </div>
      )
    },
    {
      title: "Ce que tu vis est légitime",
      icon: Lightbulb,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Peut-être ressens-tu de l'ouverture, de la curiosité, ou au contraire de l'appréhension, de la fatigue, voire de la défensive. Ces ressentis sont tous légitimes. Les nommer maintenant te permet de les reconnaître et de créer un espace intérieur pour ce qui va suivre.
          </p>
        </div>
      )
    },
    {
      title: "Pourquoi c'est important",
      icon: Brain,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Si tu es préoccupé·e ou irrité·e sans le reconnaître, cela risque de teinter ton écoute. En nommant ton état, tu deviens plus présent·e et disponible. C'est un acte de respect envers toi-même et envers {session.senderName}.
          </p>
        </div>
      )
    },
    {
      title: "Exemples",
      icon: MessageCircle,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Exemples de ce que tu pourrais dire :
          </p>
          
          <BulletList
            variant="primary"
            items={[
              "\"Je me sens ouvert·e et prêt·e à t'écouter.\"",
              "\"Je suis un peu stressé·e, mais je veux comprendre.\"",
              "\"J'ai peur de ce que tu vas dire, mais je suis ici.\"",
              "\"Je suis fatigué·e, mais je sais que c'est important.\"",
              "\"Je me sens déjà sur la défensive, mais je vais essayer de rester ouvert·e.\""
            ]}
          />
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Cette étape n'est pas une performance. C'est simplement un moment d'honnêteté qui facilite la suite.
          </p>
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

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Ici et maintenant - {session.receiverName}
        </h1>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              Prends le temps de te déposer...
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
                  Parle de ce que tu ressens maintenant - moment présent
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Exprime ton état d'esprit face à la conversation qui s'en vient
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Prends ton temps
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

          <div className="pt-4 flex flex-col items-center space-y-4">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={isTransitioning}
              className="px-12"
              data-testid="button-next"
            >
              Étape suivante
            </Button>
            {isTransitioning && (
              <Progress value={progress} className="w-64" />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
