import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Lightbulb, BookOpen, HelpCircle, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal } from '@/components/flow';

export default function DuoInversionPage17a() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(36);
  };

  const theoryPages = [
    {
      title: "Rappel - Besoin, Désir, Demande",
      icon: BookOpen,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Le Besoin (non négociable)
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              C'est ce qui nourrit ton bien-être fondamental. Un besoin est universel et légitime par nature.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              Exemples : Respect, sécurité émotionnelle, connexion, reconnaissance, autonomie, être entendu·e, confiance.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Le Désir (une voie parmi d'autres)
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Une façon possible de combler ton besoin. Il existe toujours plusieurs voies pour répondre au même besoin.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              La Demande (action concrète)
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Ta proposition pour combler le besoin. Elle est spécifique, réalisable et <strong>négociable</strong>.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Pourquoi cette distinction",
      icon: HelpCircle,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Quand tu sépares le besoin (non négociable) de la demande (négociable), tu ouvres un espace de collaboration.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Avant (sans distinction):
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "Tu dois me donner plus d'attention!"
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              → L'autre se sent contrôlé, se défend, refuse.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Après (avec distinction):
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "J'ai besoin de me sentir important·e pour toi. Pourrais-tu poser ton téléphone quand je te parle?"
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              → L'autre comprend le besoin et peut proposer des ajustements.
            </p>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Vous devenez une équipe.
          </p>
        </div>
      )
    },
    {
      title: "Processus complet - Exemple",
      icon: FileText,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              L'introspection:
            </p>
            <ol className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground list-decimal list-inside">
              <li>Besoin: "J'ai besoin de me sentir respecté·e et écouté·e"</li>
              <li>Désir: "Je désire son attention quand on parle"</li>
              <li>Demande: "Pourrais-tu me regarder quand je te parle?"</li>
            </ol>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce que tu dis à {session.senderName}:
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "J'ai besoin de me sentir respecté·e et écouté·e. Pourrais-tu faire attention de me regarder quand je te parle? Ça ferait une vraie différence pour moi."
            </p>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            C'est la collaboration, pas l'exigence.
          </p>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Lightbulb className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          La base des besoins
        </h1>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              C'est maintenant ton tour, {session.receiverName}
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Vous avez maintenant tous les deux partagé votre vécu et avez été validé·e·s dans votre perspective. {session.receiverName}, c'est à ton tour d'identifier ce dont tu as besoin pour améliorer la situation et renforcer votre connexion.
            </p>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Cette étape t'aidera à transformer ton vécu en besoin, puis en pistes d'action concrètes.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center">
              <strong>Rappel :</strong> La différence entre un <strong>besoin</strong>, un <strong>désir</strong> et une <strong>demande</strong> est essentielle pour formuler une proposition claire.
            </p>
          </div>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Revoir les concepts"
              pages={theoryPages}
              finalButtonText="On continue"
              onComplete={handleContinue}
            />
          </div>

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={isTransitioning}
              className="w-full md:w-auto px-8 min-w-48"
              data-testid="button-continue"
            >
              On continue
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
