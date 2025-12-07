import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { Checklist } from '@/components/Checklist';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';
import { Ear, VolumeX } from 'lucide-react';

export default function ReceiverValidation() {
  const { session, updateSession } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const checklistItems = [
    {
      id: 'situation',
      label: 'La situation (qu\'est-ce qui s\'est passé)',
      checked: session.checklistSituation || false,
      onChange: (checked: boolean) => updateSession({ checklistSituation: checked }),
    },
    {
      id: 'vecu',
      label: 'Le vécu (comment il/elle s\'est senti)',
      checked: session.checklistVecu || false,
      onChange: (checked: boolean) => updateSession({ checklistVecu: checked }),
    },
    {
      id: 'interpretation',
      label: 'L\'interprétation (comment il/elle a perçu la situation)',
      checked: session.checklistInterpretation || false,
      onChange: (checked: boolean) => updateSession({ checklistInterpretation: checked }),
    },
    {
      id: 'impact',
      label: 'L\'impact (les conséquences pour lui/elle)',
      checked: session.checklistImpact || false,
      onChange: (checked: boolean) => updateSession({ checklistImpact: checked }),
    },
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Ear className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Valide ce que tu as entendu
        </h1>

        <div className="flex items-center gap-2">
          <VolumeX className="w-5 h-5 text-destructive" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.senderName}: écoute attentive
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              {session.receiverName}, nomme ce que tu as entendu...
            </h2>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Ne parle pas de toi ou de tes émotions à cette étape
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Reformule simplement ce que {session.senderName} a partagé
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Valide ta compréhension des 4 points ci-dessous
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Sers-toi de la liste pour te guider si nécessaire
                </span>
              </li>
            </ul>

            <ExpandableSection>
              <p className="mb-4">
                Ton rôle ici est de montrer à {session.senderName} que tu as vraiment écouté et compris. Reformule ce que tu as entendu dans tes propres mots, sans juger, sans minimiser, sans ajouter ton point de vue.
              </p>
              <p className="mb-4">
                Pour chaque point, tu peux dire quelque chose comme :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Situation :</strong> "Si je comprends bien, ce qui s'est passé c'est..."</li>
                <li><strong>Vécu :</strong> "Face à ça, tu t'es senti..."</li>
                <li><strong>Interprétation :</strong> "Tu as eu l'impression que..."</li>
                <li><strong>Impact :</strong> "Et ça t'a amené à réagir en..."</li>
              </ul>
              <p>
                Après avoir reformulé chaque point oralement, coche la case correspondante. {session.senderName} pourra ensuite confirmer ou rectifier si nécessaire.
              </p>
            </ExpandableSection>
          </div>

          <Checklist items={checklistItems} />

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={() => transitionToStep(13)}
              className="w-full md:w-auto px-8 min-w-48"
              disabled={isTransitioning}
              data-testid="button-next"
            >
              Suivant
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
