import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { Checklist } from '@/components/Checklist';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';
import { Ear, MessageSquare, Heart, ListChecks, AlertTriangle } from 'lucide-react';
import { MultiPageModal, Subtitle, BulletList, Callout } from '@/components/flow';

export default function ReceiverValidation() {
  const { session, updateSession } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(13);
  };

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

  const theoryPages = [
    {
      title: "L'écoute active",
      icon: Ear,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Ton rôle ici est de montrer à {session.senderName} que tu as vraiment écouté et compris. C'est l'une des étapes les plus puissantes du parcours.
          </p>
          
          <div className="space-y-4">
            <Subtitle>Pourquoi reformuler</Subtitle>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Se sentir entendu apaise. Même si tu n'es pas d'accord avec l'interprétation de {session.senderName}, reformuler montre que tu reconnais son vécu. C'est la base de la connexion.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Comment reformuler",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <Subtitle>Comment reformuler efficacement</Subtitle>
          
          <BulletList
            variant="primary"
            items={[
              "Utilise tes propres mots (pas une répétition mot à mot)",
              "Reste neutre, sans juger ni minimiser",
              "N'ajoute pas ton point de vue ou tes justifications"
            ]}
          />
        </div>
      )
    },
    {
      title: "Où mettre l'importance",
      icon: Heart,
      content: (
        <div className="space-y-8">
          <Subtitle>Où donner de l'importance</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            La situation et l'interprétation aident à comprendre le contexte. Mais c'est le <strong className="text-foreground">vécu</strong> (les émotions) et <strong className="text-foreground">l'impact</strong> (les conséquences) qui ont besoin de ta présence la plus attentive. C'est là que {session.senderName} s'est montré le plus vulnérable.
          </p>
          
          <div className="space-y-4">
            <Subtitle>Formules pour reformuler</Subtitle>
            <div className="space-y-3">
              <p className="text-base md:text-lg leading-relaxed">
                <span className="font-medium text-foreground">Situation :</span>{" "}
                <span className="text-muted-foreground">"Si je comprends bien, ce qui s'est passé c'est..."</span>{" "}
                <span className="text-primary text-sm">(Important)</span>
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                <span className="font-medium text-foreground">Vécu :</span>{" "}
                <span className="text-muted-foreground">"Face à ça, tu t'es senti..."</span>
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                <span className="font-medium text-foreground">Interprétation :</span>{" "}
                <span className="text-muted-foreground">"Tu as eu l'impression que..."</span>
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                <span className="font-medium text-foreground">Impact :</span>{" "}
                <span className="text-muted-foreground">"Et ça t'a amené à réagir en..."</span>{" "}
                <span className="text-primary text-sm">(Important)</span>
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ce qu'il faut éviter",
      icon: AlertTriangle,
      content: (
        <div className="space-y-8">
          <Subtitle>Ce qu'il faut éviter</Subtitle>
          
          <div className="space-y-3">
            <p className="text-base md:text-lg leading-relaxed">
              <span className="text-destructive">✗</span>{" "}
              <span className="text-muted-foreground">"Oui mais moi aussi..."</span>{" "}
              <span className="text-sm text-muted-foreground italic">(c'est pas encore ton tour)</span>
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              <span className="text-destructive">✗</span>{" "}
              <span className="text-muted-foreground">"C'est pas ce que je voulais dire..."</span>{" "}
              <span className="text-sm text-muted-foreground italic">(tu justifies au lieu d'écouter)</span>
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              <span className="text-destructive">✗</span>{" "}
              <span className="text-muted-foreground">"Tu exagères..."</span>{" "}
              <span className="text-sm text-muted-foreground italic">(tu invalides)</span>
            </p>
          </div>
          
          <div className="space-y-4">
            <Subtitle>Après ta reformulation</Subtitle>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              {session.senderName} pourra confirmer que tu as bien compris ou clarifier si nécessaire. Coche chaque case pour suivre si tu en ressens le besoin.
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
          <Ear className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Valide ce que tu as entendu
        </h1>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
          <MessageSquare className="w-5 h-5 text-primary" />
          <p className="text-base md:text-lg text-foreground">
            {session.receiverName}, reformule ce que tu as entendu
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
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

          <p className="text-base md:text-lg text-muted-foreground text-center">
            Coche les cases au fur et à mesure que tu reformules chaque point :
          </p>

          <Checklist items={checklistItems} />

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Plus d'infos: Théories"
              pages={theoryPages}
              finalButtonText="Suivant"
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
