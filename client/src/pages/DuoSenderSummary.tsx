import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';
import { ListChecks, Ear, CheckCircle2, FileText, Puzzle, MessageSquare } from 'lucide-react';
import { MultiPageModal, Subtitle, BulletList, Callout } from '@/components/flow';

export default function SenderSummary() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(12);
  };

  const checklistItems = [
    "La situation (qu'est-ce qui s'est passé)",
    "Mon vécu (comment je me suis senti)",
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
            Cette étape consolide ton message avant de passer la parole au récepteur. En résumant, tu t'assures que ton message est clair et complet.
          </p>
        </div>
      )
    },
    {
      title: "Pourquoi résumer",
      icon: Puzzle,
      content: (
        <div className="space-y-8">
          <Subtitle>Pourquoi résumer</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Après avoir détaillé chaque élément séparément, le résumé crée une vue d'ensemble cohérente. C'est comme assembler les pièces d'un puzzle : chaque morceau prend son sens dans l'ensemble.
          </p>
          
          <div className="space-y-4">
            <Subtitle>Comment faire un bon résumé</Subtitle>
            <BulletList
              variant="primary"
              items={[
                "Garde-le court (quelques phrases, reste à l'essentiel)",
                "Enchaîne les 4 éléments de façon fluide",
                "Reste fidèle à ce que tu as partagé",
                "Parle comme si tu racontais une histoire, pas comme si tu récitais une liste"
              ]}
            />
          </div>
        </div>
      )
    },
    {
      title: "Exemple de résumé",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <Subtitle>Exemple de résumé</Subtitle>
          
          <Callout variant="neutral">
            <p className="text-base leading-relaxed italic">
              "Hier soir, quand tu es parti sans dire au revoir <span className="text-primary font-medium">[situation]</span>, je me suis senti·e triste et inquiet·e <span className="text-primary font-medium">[vécu]</span>. J'ai eu l'impression que tu étais fâché contre moi <span className="text-primary font-medium">[interprétation]</span>, et ça m'a poussé·e à me renfermer et à éviter le contact ce matin <span className="text-primary font-medium">[impact]</span>."
            </p>
          </Callout>
          
          <div className="space-y-4">
            <Subtitle>Ce que ça apporte</Subtitle>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Le résumé permet à {session.receiverName} d'entendre ton vécu complet avant de répondre. C'est une transition douce vers l'étape suivante où il/elle pourra reformuler ce qu'il/elle a compris.
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
            {session.receiverName}: écoute attentive et bienveillante
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
            {session.senderName}, reprends les 4 points que tu viens de partager
          </h2>

          <p className="text-base md:text-lg text-muted-foreground text-center">
            Fais un bref résumé en reprenant ces 4 éléments, nomme ce qui est le plus important pour toi :
          </p>

          <Callout variant="neutral">
            <p className="text-sm md:text-base">
              Cette page peut sembler répétitive, mais cette répétition est utile : elle développe la connaissance de ton fonctionnement psychique, la responsabilité et les habiletés de communication.
            </p>
          </Callout>

          <div className="space-y-3">
            {checklistItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-card border border-card-border"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 flex-shrink-0">
                  <span className="text-sm font-medium text-primary">{index + 1}</span>
                </div>
                <span className="text-base md:text-lg leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
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
