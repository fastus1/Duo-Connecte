import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Eye, Ear, AlertCircle, Lightbulb, MessageSquare, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal, Subtitle, BulletList, Callout } from '@/components/flow';

export default function SenderInterpretation() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(10);
  };

  const theoryPages = [
    {
      title: "L'interprétation crée l'émotion",
      icon: AlertCircle,
      content: (
        <div className="space-y-8">
          <Callout variant="primary">
            <p className="font-medium">
              IMPORTANT! C'est ton interprétation personnelle (consciente ou non) qui crée tes émotions.
            </p>
          </Callout>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Ce que tu as ressenti vient de comment tu as lu la situation, pas nécessairement de ce qui s'est réellement passé.
          </p>
        </div>
      )
    },
    {
      title: "Exemple concret",
      icon: Lightbulb,
      content: (
        <div className="space-y-8">
          <Subtitle>Exemple concret</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Si quelqu'un ne te salue pas le matin, tu pourrais penser "Il est fâché contre moi" (ce qui créerait de l'anxiété) ou "Il semble préoccupé" (ce qui créerait de l'empathie).
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-foreground font-medium">
            Ton interprétation crée tes émotions.
          </p>
        </div>
      )
    },
    {
      title: "Comment l'exprimer",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <Subtitle>Comment exprimer ton interprétation</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Utilise des formules qui reconnaissent que c'est ta lecture des événements :
          </p>
          
          <BulletList
            variant="primary"
            items={[
              "« J'ai eu l'impression que... »",
              "« Je me suis dit que... »",
              "« Pour moi, ça voulait dire que... »"
            ]}
          />
        </div>
      )
    },
    {
      title: "Pourquoi c'est important",
      icon: FileText,
      content: (
        <div className="space-y-8">
          <Subtitle>Pourquoi c'est important</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            En nommant ton interprétation comme <em>ton</em> interprétation (et non comme <em>la</em> vérité), tu laisses de l'espace pour que l'autre partage sa perspective.
          </p>
          
          <div className="space-y-4">
            <Subtitle>Exemples de situations</Subtitle>
            <BulletList
              variant="primary"
              items={[
                "« Quand tu es parti sans dire au revoir, j'ai pensé que tu étais fâché contre moi. »",
                "« Quand tu as ri, j'ai cru que tu te moquais de moi. »"
              ]}
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Eye className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Nomme ta vision des choses
        </h1>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <Ear className="w-5 h-5 text-primary" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.receiverName}: écoute attentive et bienveillante
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
            {session.senderName}, parle de comment tu as perçu la situation
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
