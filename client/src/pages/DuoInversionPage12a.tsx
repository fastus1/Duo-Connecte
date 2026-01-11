import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';
import { Ear, MessageSquare, CheckCircle2 } from 'lucide-react';
import { MultiPageModal } from '@/components/flow';

export default function DuoInversionPage12a() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(31);
  };

  const checklistItems = [
    "Le vécu (comment il/elle s'est senti·e)",
    "L'interprétation (comment il/elle a perçu la situation)",
    "L'impact (les conséquences pour lui/elle)",
  ];

  const theoryPages = [
    {
      title: "Reformuler avec bienveillance",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Ton rôle : montrer à {session.receiverName} que tu as vraiment écouté·e. Reformule dans tes propres mots, sans juger, sans minimiser, sans ajouter ton point de vue.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Formules pour te guider :
            </p>
            <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span><strong>Vécu :</strong> "Face à ça, tu t'es senti·e..."</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span><strong>Interprétation :</strong> "Tu as eu l'impression que..."</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span><strong>Impact :</strong> "Et ça t'a amené à réagir en..."</span>
              </li>
            </ul>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Reformule oralement chaque point, puis coche la case correspondante. {session.receiverName} pourra ensuite confirmer ou rectifier.
          </p>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <Ear className="w-5 h-5 text-primary" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.receiverName} : écoute attentive
          </p>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Valide ce que tu as entendu
        </h1>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
              {session.senderName}, reformule ce que tu as entendu dans tes propres mots
            </h2>
          </div>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Plus d'infos"
              pages={theoryPages}
              finalButtonText="Étape suivante"
              onComplete={handleContinue}
            />
          </div>

          <div className="space-y-3">
            {checklistItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-card border border-card-border"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-base md:text-lg leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
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
