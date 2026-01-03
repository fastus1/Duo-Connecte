import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Zap, Ear, Target, RefreshCw, ListChecks, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal, Subtitle, BulletList } from '@/components/flow';

export default function SenderImpact() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(11);
  };

  const theoryPages = [
    {
      title: "Les conséquences",
      icon: Target,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Partage maintenant les conséquences concrètes que cette situation a eues sur toi. Comment cela a-t-il affecté ton bien-être, ta relation, ta façon d'agir?
          </p>
        </div>
      )
    },
    {
      title: "Les types d'impact",
      icon: RefreshCw,
      content: (
        <div className="space-y-8">
          <Subtitle>Les différents types d'impact</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Ton interprétation déclenche tes émotions et des réactions automatiques lorsque tu n'arrives pas à les accueillir. Reconnaître ton pattern de réaction aide l'autre à comprendre ton comportement sans le prendre personnellement.
          </p>
        </div>
      )
    },
    {
      title: "Réactions courantes",
      icon: ListChecks,
      content: (
        <div className="space-y-8">
          <Subtitle>Exemples de réactions courantes</Subtitle>
          
          <div className="space-y-3">
            <p className="text-base md:text-lg leading-relaxed">
              <span className="font-medium text-foreground">Défensive :</span>{" "}
              <span className="text-muted-foreground">"Je me justifie immédiatement et je contre-argumente."</span>
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              <span className="font-medium text-foreground">Retrait :</span>{" "}
              <span className="text-muted-foreground">"Je me ferme, je crée de la distance physique ou émotionnelle."</span>
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              <span className="font-medium text-foreground">Contre-attaque :</span>{" "}
              <span className="text-muted-foreground">"Je pointe ses torts à lui/elle pour équilibrer."</span>
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              <span className="font-medium text-foreground">Bouderie :</span>{" "}
              <span className="text-muted-foreground">"Je me renferme dans un silence lourd."</span>
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              "Je deviens inquiet·e, j'anticipe le pire."
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              <span className="font-medium text-foreground">Hypercontrôle :</span>{" "}
              <span className="text-muted-foreground">"J'essaie de tout gérer pour ne plus ressentir ça."</span>
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Pourquoi nommer ta réaction",
      icon: Lightbulb,
      content: (
        <div className="space-y-8">
          <Subtitle>Pourquoi nommer ta réaction</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            En identifiant ton pattern, tu passes de "Il/elle me fait réagir" à "Voici comment je réagis quand j'interprète les choses de cette façon". C'est reprendre du pouvoir sur tes automatismes.
          </p>
          
          <div className="space-y-4">
            <Subtitle>Exemples concrets</Subtitle>
            <BulletList
              variant="primary"
              items={[
                "« Quand j'ai l'impression que tu m'ignores, je deviens distant·e à mon tour pour me protéger. »",
                "« Quand je pense que mon opinion ne compte pas, je m'agrippe davantage et je répète mon point. »",
                "« Quand je me sens critiqué·e, je me justifie et je contre-attaque. »"
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
          <Zap className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Nomme l'impact et ta réaction
        </h1>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <Ear className="w-5 h-5 text-primary" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.receiverName}: écoute attentive et bienveillante
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
            {session.senderName}, quel a été l'impact sur toi, comment as-tu réagi?
          </h2>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Quand ça arrive, je me sens rejeté / pas important / incompris...
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                L'impact sur moi est que...
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Je réagis généralement en...
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
