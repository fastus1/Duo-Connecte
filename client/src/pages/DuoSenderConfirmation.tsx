import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { CheckCheck, Ear, Target, MessageSquare, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal, Subtitle, BulletList, Callout } from '@/components/flow';

export default function SenderConfirmation() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(14);
  };

  const theoryPages = [
    {
      title: "Validation cruciale",
      icon: Target,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Cette validation finale est cruciale. C'est votre dernière opportunité de vous assurer que le message est bien passé avant de continuer.
          </p>
          
          <div className="space-y-4">
            <Subtitle>Pourquoi clarifier</Subtitle>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Si tu passes à l'étape suivante avec l'impression que ton message n'a pas été compris, tu risques de te sentir frustré plus tard. Cette validation ferme la boucle de communication.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Exemples de clarifications",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <Subtitle>Exemples de clarifications utiles</Subtitle>
          
          <div className="space-y-4">
            <Callout variant="neutral">
              <p className="text-base leading-relaxed italic">
                "Tu as bien compris, mais j'aimerais insister sur le fait que je me suis senti vraiment seul, pas juste un peu déçu."
              </p>
            </Callout>
            
            <Callout variant="neutral">
              <p className="text-base leading-relaxed italic">
                "Presque, mais quand tu dis 'fâché', c'est plutôt de la tristesse mêlée d'impuissance."
              </p>
            </Callout>
            
            <Callout variant="neutral">
              <p className="text-base leading-relaxed italic">
                "Oui, exactement. Merci d'avoir compris."
              </p>
            </Callout>
          </div>
        </div>
      )
    },
    {
      title: "Quand valider ou clarifier",
      icon: Shield,
      content: (
        <div className="space-y-8">
          <Subtitle>Quand valider</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Si {session.receiverName} a saisi l'essentiel de ton vécu — la situation, tes émotions, ton interprétation, ton impact — alors tu peux valider et continuer. Pas besoin que ce soit parfait mot à mot.
          </p>
          
          <div className="space-y-4">
            <Subtitle>Signes que tu dois clarifier</Subtitle>
            <BulletList
              variant="destructive"
              items={[
                `${session.receiverName} a minimisé une émotion importante ("un peu triste" alors que tu étais "profondément blessé")`,
                "Une partie de ton vécu n'a pas été mentionnée",
                "L'interprétation reformulée change le sens de ton message"
              ]}
            />
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-foreground font-medium">
            Cette étape protège la suite de votre échange. Prenez-la au sérieux.
          </p>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <CheckCheck className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          As-tu été bien entendu?
        </h1>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <Ear className="w-5 h-5 text-primary" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.receiverName}: écoute attentive
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
            {session.senderName}, {session.receiverName} vient de reformuler ce que tu as partagé, est-ce que tu as bien été entendu?
          </h2>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Précise ou rectifie ce qui n'est pas tout à fait juste
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Insiste sur ce qui est particulièrement important pour toi
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Ajoute un élément si nécessaire
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Valide que {session.receiverName} t'as bien entendu si nécessaire
              </span>
            </li>
          </ul>

          <Callout variant="primary">
            <p className="text-sm md:text-base">
              L'objectif est que {session.receiverName} comprenne vraiment ce que tu vis. Prends le temps nécessaire pour t'assurer que ton message est bien passé.
            </p>
          </Callout>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Plus d'infos: Théories"
              pages={theoryPages}
              finalButtonText="J'ai été entendu"
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
