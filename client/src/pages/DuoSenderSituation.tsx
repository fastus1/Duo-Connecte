import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { MessageSquare, Ear, Target, ListChecks, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal, Subtitle, BulletList, Callout } from '@/components/flow';

export default function SenderSituation() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(8);
  };

  const theoryPages = [
    {
      title: "Poser les fondations",
      icon: Target,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Cette étape pose les fondations de tout l'échange. En décrivant la situation de manière factuelle, tu crées un terrain commun sur lequel vous pourrez vous rejoindre.
          </p>
          
          <div className="space-y-4">
            <Subtitle>Pourquoi rester factuel est crucial</Subtitle>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Quand tu mélanges faits et interprétations dès le départ, l'autre se met immédiatement sur la défensive. "Tu m'as ignoré" provoque une réaction. "Tu regardais ton téléphone pendant que je te parlais" est un fait observable qui laisse place à la discussion.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Fait vs Interprétation",
      icon: ListChecks,
      content: (
        <div className="space-y-8">
          <Subtitle>La différence entre fait et interprétation</Subtitle>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-destructive text-xl">✗</span>
              <span className="text-base md:text-lg leading-relaxed">
                <span className="text-muted-foreground">Interprétation :</span> "Tu ne m'écoutes jamais"
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">✓</span>
              <span className="text-base md:text-lg leading-relaxed">
                <span className="text-muted-foreground">Fait :</span> "Ce matin, pendant que je te parlais du rendez-vous, tu étais sur ton téléphone"
              </span>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-destructive text-xl">✗</span>
              <span className="text-base md:text-lg leading-relaxed">
                <span className="text-muted-foreground">Interprétation :</span> "Tu t'en fiches de ce que je ressens"
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">✓</span>
              <span className="text-base md:text-lg leading-relaxed">
                <span className="text-muted-foreground">Fait :</span> "Hier, quand j'ai pleuré, tu es sorti de la pièce"
              </span>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-destructive text-xl">✗</span>
              <span className="text-base md:text-lg leading-relaxed">
                <span className="text-muted-foreground">Interprétation :</span> "Tu fais exprès, tu es toujours en retard"
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary text-xl">✓</span>
              <span className="text-base md:text-lg leading-relaxed">
                <span className="text-muted-foreground">Fait :</span> "Tu es arrivé 30 minutes après l'heure prévue"
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Exemples",
      icon: FileText,
      content: (
        <div className="space-y-8">
          <Subtitle>Exemples de situations bien nommées</Subtitle>
          
          <BulletList
            variant="primary"
            items={[
              "« Hier soir, on devait regarder un film ensemble. À 20h, tu m'as dit que tu devais travailler. »",
              "« Ce matin, je t'ai demandé si tu pouvais m'aider avec les courses. Tu as soupiré et tu n'as rien répondu. »",
              "« Samedi dernier, tu as annulé notre sortie une heure avant pour voir tes amis. »"
            ]}
          />
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Les émotions et interprétations viendront plus tard. Pour l'instant, tu nomme le déclencheur.
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
          Nomme la situation
        </h1>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <Ear className="w-5 h-5 text-primary" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.receiverName}: écoute attentive et bienveillante
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
            {session.senderName}, de quoi veux-tu parler (la situation, le déclencheur)
          </h2>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Décris les faits observables, comme un·e témoin neutre qui raconte ce qu'il/elle a vu
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Ne parle pas encore de tes émotions ni de tes interprétations
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Reste bref·ve : environ 1 minute
              </span>
            </li>
          </ul>

          <Callout variant="neutral">
            <p>
              Pas de situation précise à nommer? C'est correct. Si ton besoin est de partager ton vécu directement, passe à l'étape suivante.
            </p>
          </Callout>

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
