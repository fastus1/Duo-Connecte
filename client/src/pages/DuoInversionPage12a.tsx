import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { Checklist } from '@/components/Checklist';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';
import { Ear, VolumeX } from 'lucide-react';

export default function DuoInversionPage12a() {
  const { session, updateSession } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const checklistItems = [
    {
      id: 'vecu-inverse',
      label: 'Le vécu (comment il/elle s\'est senti)',
      checked: session.checklistVecuInverse || false,
      onChange: (checked: boolean) => updateSession({ checklistVecuInverse: checked }),
    },
    {
      id: 'interpretation-inverse',
      label: 'L\'interprétation (comment il/elle a perçu la situation)',
      checked: session.checklistInterpretationInverse || false,
      onChange: (checked: boolean) => updateSession({ checklistInterpretationInverse: checked }),
    },
    {
      id: 'impact-inverse',
      label: 'L\'impact (les conséquences pour lui/elle)',
      checked: session.checklistImpactInverse || false,
      onChange: (checked: boolean) => updateSession({ checklistImpactInverse: checked }),
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
            {session.receiverName} : écoute attentive
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              {session.senderName}, nomme ce que tu as entendu, sers toi de la liste pour te guider si nécessaire
            </h2>

            <ExpandableSection>
              <p className="mb-4">
                Ton rôle ici est de montrer à {session.receiverName} que tu as vraiment écouté et compris. Reformule ce que tu as entendu dans tes propres mots, sans juger, sans minimiser, sans ajouter ton point de vue.
              </p>
              <p className="mb-4">
                Pour chaque point, tu peux dire quelque chose comme :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Vécu :</strong> "Face à ça, tu t'es senti..."</li>
                <li><strong>Interprétation :</strong> "Tu as eu l'impression que..."</li>
                <li><strong>Impact :</strong> "Et ça t'a amené à réagir en..."</li>
              </ul>
              <p>
                Après avoir reformulé chaque point oralement, coche la case correspondante. {session.receiverName} pourra ensuite confirmer ou rectifier si nécessaire.
              </p>
            </ExpandableSection>
          </div>

          <div className="space-y-3">
            <p className="text-base md:text-lg text-muted-foreground">
              Coche les cases au fur et à mesure que tu reformules chaque point :
            </p>
            <Checklist items={checklistItems} />
          </div>

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={() => transitionToStep(30)}
              className="w-full md:w-auto px-8 min-w-48"
              disabled={isTransitioning}
              data-testid="button-next"
            >
              OK, next
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
