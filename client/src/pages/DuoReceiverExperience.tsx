import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart, Ear, AlertCircle, Layers, MessageSquare, Shield, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal } from '@/components/flow';

export default function ReceiverExperience() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(15);
  };

  const theoryPages = [
    {
      title: "Résiste à l'automatisme",
      icon: AlertCircle,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            C'est l'une des étapes les plus difficiles du parcours. Après avoir écouté {session.senderName}, ton instinct te pousse peut-être à te défendre, à expliquer ton intention, à corriger sa perception.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Résiste à cet automatisme. Tu vas pouvoir parler de ta perception plus tard.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Ton seul travail maintenant : nommer ton vécu
          </p>
        </div>
      )
    },
    {
      title: "Émotions diverses",
      icon: Layers,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Tu peux ressentir un mélange d'émotions diverses :
          </p>
          
          <div className="space-y-3">
            <p className="text-base md:text-lg leading-relaxed">
              <span className="font-medium text-foreground">Tristesse :</span>{" "}
              <span className="text-muted-foreground">"Je me sens triste de réaliser l'impact que ça a eu sur toi"</span>
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              <span className="font-medium text-foreground">Culpabilité :</span>{" "}
              <span className="text-muted-foreground">"Je me sens coupable de t'avoir blessé·e sans le vouloir"</span>
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              <span className="font-medium text-foreground">Incompréhension :</span>{" "}
              <span className="text-muted-foreground">"Je me sens désorienté·e parce que je ne percevais pas la situation comme ça"</span>
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              <span className="font-medium text-foreground">Malaise :</span>{" "}
              <span className="text-muted-foreground">"Je me sens inconfortable face à ce que tu me partages"</span>
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              <span className="font-medium text-foreground">Empathie :</span>{" "}
              <span className="text-muted-foreground">"Je me sens touché·e de voir à quel point c'était difficile pour toi"</span>
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Exemples de partage",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
            "Quand tu dis que tu t'es senti·e ignoré·e, ça m'attriste, je n'avais aucune idée que tu pouvais vivre ça, je suis content·e que tu m'en parles."
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
            "Quand tu me dis que tu t'es senti·e jugé·e par mes commentaires, je me sens mal et coupable. Je réalise que mes paroles t'ont blessé·e, et ça me fait de la peine."
          </p>
        </div>
      )
    },
    {
      title: "Ce qui rend l'étape difficile",
      icon: Shield,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Entendre le vécu de {session.senderName} peut déclencher tes mécanismes de défense.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Tu veux peut-être dire "Mais ce n'était pas mon intention!" ou "Tu interprètes mal!".
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            C'est normal.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Reconnais cette réaction défensive et demande-toi quelle émotion se cache derrière : de la culpabilité? De la honte? De la peur d'être une mauvaise personne?
          </p>
        </div>
      )
    },
    {
      title: "Pourquoi ne pas te justifier",
      icon: Lightbulb,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Se justifier maintenant casserait le lien qui vient de se créer. {session.senderName} a pris un risque en se montrant vulnérable. Si tu réponds par une défensive, tu invalides son vécu. Tu auras ton tour pour partager ta perspective plus tard.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              La nuance importante :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Tu peux reconnaître tes réactions défensives et même te dénoncer : "Je me sens sur la défensive et j'ai envie de me justifier" est une expression honnête de ton vécu, pas une justification.
            </p>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Reste avec tes émotions. Laisse ton point de vue pour plus tard.
          </p>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Heart className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Ton vécu après l'écoute
        </h1>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <Ear className="w-5 h-5 text-primary" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.senderName}: offre ta présence attentive et ton ouverture
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
            {session.receiverName}, comment te sens-tu maintenant?
          </h2>

          <div className="space-y-2 text-center">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Parle de ce que tu vis en lien avec ce que tu viens d'entendre de la part de {session.senderName}
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium">
              Prends le temps de te déposer.
            </p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Face à ce que tu viens de me dire, je me sens...
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Nomme tes émotions sans te justifier
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Plusieurs émotions peuvent cohabiter
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Reste dans le moment présent
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Reste en lien avec ton vécu face à celui de {session.senderName}
              </span>
            </li>
          </ul>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Plus d'infos: Théories"
              pages={theoryPages}
              finalButtonText="J'ai terminé"
              onComplete={handleContinue}
            />
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={isTransitioning}
                className="min-w-48"
                data-testid="button-next"
              >
                J'ai terminé
              </Button>
            </div>
            
            {isTransitioning && (
              <div className="flex justify-center">
                <Progress value={progress} className="w-full md:w-48" />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
