import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Play, ArrowRight, Sparkles, MessageSquare, Ear } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal, Subtitle } from '@/components/flow';

export default function Transition1() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(7);
  };

  const theoryPages = [
    {
      title: "Un moment clé",
      icon: Sparkles,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Cette transition marque un moment clé : vous passez de la préparation à l'échange réel. C'est normal de ressentir une légère tension ou de l'appréhension.
          </p>
        </div>
      )
    },
    {
      title: `Pour ${session.senderName}`,
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <Subtitle>Pour {session.senderName} (émetteur)</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Tu vas prendre la parole. Rappelle-toi que ton objectif n'est pas de convaincre, mais de partager ton vécu authentique.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            {session.receiverName} est là pour t'écouter, pas pour te juger.
          </p>
        </div>
      )
    },
    {
      title: `Pour ${session.receiverName}`,
      icon: Ear,
      content: (
        <div className="space-y-8">
          <Subtitle>Pour {session.receiverName} (récepteur)</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Ton seul travail maintenant est d'écouter. Pas de solutions, pas de contre-arguments, pas de justifications.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Juste une écoute présente et ouverte. Ce sera ton tour plus tard de partager ton point de vue.
          </p>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Play className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Prêts à continuer
        </h1>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 space-y-4">
            <p className="text-lg md:text-xl leading-relaxed text-foreground font-medium">
              {session.senderName} va maintenant partager son vécu. {session.receiverName}, ton rôle est d'écouter sans intervenir, avec bienveillance et curiosité.
            </p>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Prenez votre temps à chaque étape. La lenteur est votre alliée, pas votre ennemie.
            </p>
          </div>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Plus d'infos: Théories"
              pages={theoryPages}
              finalButtonText="Oui, on continue"
              onComplete={handleContinue}
            />
          </div>

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={isTransitioning}
              className="w-full md:w-auto px-8 min-w-48"
              data-testid="button-continue"
            >
              Oui, on continue
              <ArrowRight className="w-5 h-5 ml-2" />
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
