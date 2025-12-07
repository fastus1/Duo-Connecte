import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { WarningBanner } from '@/components/WarningBanner';
import { Checklist } from '@/components/Checklist';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';

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
      <div className="space-y-6 md:space-y-8">
        <WarningBanner type="speaker" speaker={session.receiverName}>
          C'est au tour de {session.receiverName} de parler
        </WarningBanner>

        <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
          {session.receiverName}, redis ce que tu as entendu
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Valide avec {session.senderName} que tu as bien entendu
        </p>

        <div className="space-y-3 md:space-y-4">
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

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">
            Coche les cases au fur et à mesure que tu reformules chaque point :
          </p>
          <Checklist items={checklistItems} />
        </div>

        <div className="pt-4 space-y-3">
          <Button
            size="lg"
            onClick={() => transitionToStep(14)}
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
    </PageLayout>
  );
}
