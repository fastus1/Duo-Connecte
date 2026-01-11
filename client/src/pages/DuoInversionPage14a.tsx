import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart, Ear, AlertCircle, List, MessageSquare, Shield, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal } from '@/components/flow';

export default function DuoInversionPage14a() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(33);
  };

  const theoryPages = [
    {
      title: "Une étape difficile",
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
      title: "Émotions possibles",
      icon: List,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Tu peux ressentir un mélange d'émotions complexes :
          </p>
          
          <ul className="space-y-3 text-base md:text-lg leading-relaxed text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span><strong>Surprise :</strong> "Je me sens surpris·e de découvrir que tu as vécu la situation si différemment"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span><strong>Soulagement :</strong> "Je me sens soulagé·e de mieux comprendre ta perspective"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span><strong>Incompréhension :</strong> "Je me sens désorienté·e parce que ta vision est très différente de la mienne"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span><strong>Validation :</strong> "Je me sens compris·e quand tu expliques que tu ne voulais pas me blesser"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span><strong>Frustration :</strong> "Je me sens frustré·e parce que j'ai l'impression qu'on parle de deux situations différentes"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span><strong>Gratitude :</strong> "Je me sens reconnaissant·e que tu partages ton vécu avec moi"</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Exemples de partage",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Exemples de partage authentique :
          </p>
          
          <div className="space-y-4 text-base md:text-lg leading-relaxed text-muted-foreground">
            <p className="italic">
              "Quand tu m'expliques que tu pensais que j'avais besoin d'espace, je me sens soulagé·e de comprendre ton intention. Je croyais que tu m'ignorais, mais maintenant je vois que ce n'était pas ça du tout."
            </p>
            
            <p className="italic">
              "Quand tu partages que tu te sentais dépassé·e à ce moment-là, je me sens moins seul·e. Je réalise qu'on vivait tous·tes les deux quelque chose de difficile, chacun·e de notre côté."
            </p>
            
            <p className="italic">
              "Entendre que tu ne voulais pas me blesser, ça me touche. Je me sens compris·e et j'ai moins l'impression d'avoir imaginé des choses."
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Les mécanismes de défense",
      icon: Shield,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Ce qui rend cette étape difficile :
          </p>
          
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
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Pourquoi ne pas te justifier maintenant :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Se justifier maintenant casserait le lien qui vient de se créer. {session.senderName} a pris un risque en se montrant vulnérable. Si tu réponds par une défensive, tu invalides son vécu. Tu auras ton tour pour partager ta perspective plus tard.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              La nuance importante :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Tu peux reconnaître tes réaction défensives et même te dénoncer : "Je me sens sur la défensive et j'ai envie de me justifier" est une expression honnête de ton vécu, pas une justification.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Reste avec tes émotions. Laisse ton point de vue pour plus tard.
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
          <Heart className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Ton vécu après l'écoute
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
              {session.receiverName}, comment te sens-tu maintenant?
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center">
              Parle de ce que tu vis en lien avec ce que tu viens d'entendre de la part de {session.senderName}
            </p>
            
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center">
              Prends le temps de te déposer.
            </p>

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
          </div>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Plus d'infos: Théories"
              pages={theoryPages}
              finalButtonText="J'ai terminé"
              onComplete={handleContinue}
            />
          </div>

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={isTransitioning}
              className="w-full md:w-auto px-8 min-w-48"
              data-testid="button-next"
            >
              J'ai terminé
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
