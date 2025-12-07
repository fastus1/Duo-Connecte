import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { WarningBanner } from '@/components/WarningBanner';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';

export default function ReceiverExperience() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
        <div className="space-y-6 md:space-y-8">
          <WarningBanner type="speaker" speaker={session.senderName}>
            {session.senderName} écoute sans parler
          </WarningBanner>

          <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
            {session.receiverName}, comment te sens-tu maintenant?
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Parle de ton vécu immédiat
          </p>

          <div className="space-y-3 md:space-y-4">
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
            </ul>

            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-2">
              <p className="text-sm font-medium text-destructive">À éviter à cette étape :</p>
              <ul className="text-sm text-destructive space-y-1 pl-4">
                <li>• Te justifier ou te défendre</li>
                <li>• Expliquer ton point de vue sur la situation</li>
                <li>• Minimiser ce que {session.senderName} ressent</li>
              </ul>
            </div>

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

          <div className="pt-4 space-y-3">
            <Button
              size="lg"
              onClick={() => transitionToStep(17)}
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
