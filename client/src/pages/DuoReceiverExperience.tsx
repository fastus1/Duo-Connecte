import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart, VolumeX } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ReceiverExperience() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Heart className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Ton vécu après l'écoute
        </h1>

        <div className="flex items-center gap-2">
          <VolumeX className="w-5 h-5 text-destructive" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.senderName} : écoute attentive et bienveillante
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              {session.receiverName}, comment te sens-tu maintenant?
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Parle de ce que tu vis en lien avec ce que tu viens d'entendre de la part de {session.senderName}
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
                  Tu peux avoir plusieurs émotions en même temps
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

            <ExpandableSection>
              <p className="mb-4">
                C'est le moment d'exprimer honnêtement ce que TU ressens maintenant, après avoir écouté {session.senderName}. Tu peux te sentir triste, touché, inconfortable, coupable, incompris, ou toute autre émotion.
              </p>
              <p className="mb-4">
                Il est normal de vouloir te défendre ou te justifier, mais ce n'est pas le moment. Pour l'instant, nomme simplement tes émotions face à ce que tu viens d'entendre.
              </p>
              <p>
                Tu pourras relever certains points qui te semblent importants, mais reviens toujours à ton vécu émotionnel. Par exemple : "Quand tu dis que je t'ai ignoré, je me sens incompris parce que dans ma tête j'étais concentré, mais je reconnais que je me sens aussi mal à l'aise en réalisant l'impact que ça a eu sur toi."
              </p>
            </ExpandableSection>
          </div>

          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-2">
            <p className="text-sm font-medium text-destructive">À éviter à cette étape :</p>
            <ul className="text-sm text-destructive space-y-1 pl-4">
              <li>• Te justifier ou te défendre</li>
              <li>• Expliquer ton point de vue sur la situation</li>
              <li>• Minimiser ce que {session.senderName} ressent</li>
            </ul>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => transitionToStep(15)}
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
