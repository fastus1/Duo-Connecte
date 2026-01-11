import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';
import { ListChecks, Ear, CheckCircle2, FileText, Lightbulb, MessageSquare } from 'lucide-react';
import { MultiPageModal } from '@/components/flow';

export default function DuoInversionPage11a() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(30);
  };

  const checklistItems = [
    "Mon vécu (comment je me suis senti·e)",
    "Mon interprétation (comment j'ai perçu la situation)",
    "L'impact (les conséquences pour moi)",
  ];

  const theoryPages = [
    {
      title: "Consolider ton message",
      icon: FileText,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Cette étape consolide ton message avant de passer la parole à l'émetteur. En résumant, tu t'assures que ton message est clair et complet.
          </p>
        </div>
      )
    },
    {
      title: "L'art du résumé",
      icon: Lightbulb,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Pourquoi résumer :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Après avoir détaillé chaque élément séparément, le résumé crée une vue d'ensemble cohérente. C'est comme assembler les pièces d'un puzzle : chaque morceau prend son sens dans l'ensemble.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Comment faire un bon résumé :
            </p>
            <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Garde-le court (Quelques phrases, reste à l'essentiel)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Enchaîne les 3 éléments de façon fluide</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Reste fidèle à ce que tu as partagé</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Parle comme si tu racontais une histoire, pas comme si tu récitais une liste</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Exemple de résumé",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
            "Face à cette situation, je me suis senti·e préoccupé·e et distant·e <em>[vécu]</em>. J'ai eu l'impression que tu avais besoin d'espace et que je ne devais pas intervenir <em>[interprétation]</em>, et ça m'a poussé·e à me retirer et à éviter d'en parler <em>[impact]</em>."
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce que ça apporte :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Le résumé permet à {session.senderName} d'entendre ton vécu complet avant de répondre. C'est une transition douce vers l'étape suivante où il/elle pourra reformuler ce qu'il/elle a compris.
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
          <ListChecks className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Fais un résumé
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
              {session.receiverName}, reprends les 3 points que tu viens de partager
            </h2>

            <p className="text-base md:text-lg text-muted-foreground text-center">
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

            <p className="text-base text-muted-foreground italic text-center">
              Ce résumé aide {session.senderName} à bien comprendre l'ensemble de ton message avant de le reformuler.
            </p>
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
