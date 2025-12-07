import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart, VolumeX } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SenderNeeds() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Heart className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          Exprime des besoins
        </h1>

        <div className="flex items-center gap-2">
          <VolumeX className="w-5 h-5 text-destructive" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.receiverName}: écoute avec ouverture
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              {session.senderName}, de quoi aurais-tu besoin?
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Formule une demande claire et concrète
            </p>
          </div>

          <div className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Face à cette situation, j'aurais besoin que...
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Sois spécifique et concret
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Formule une demande, pas une exigence
                </span>
              </li>
            </ul>

            <ExpandableSection>
              <p className="mb-4">
                Maintenant que tu as partagé ton vécu et que {session.receiverName} l'a entendu, il est temps d'exprimer ce dont tu as besoin pour améliorer la situation.
              </p>
              <p className="mb-4">
                Une bonne demande est :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Spécifique :</strong> "J'aurais besoin que tu me regardes quand je te parle" plutôt que "J'ai besoin de plus d'attention"</li>
                <li><strong>Réalisable :</strong> Quelque chose que l'autre peut concrètement faire</li>
                <li><strong>Formulée comme une demande :</strong> "Est-ce que tu pourrais..." au lieu de "Tu dois..."</li>
              </ul>
              <p>
                Exemples : "J'aurais besoin qu'on prenne 15 minutes chaque soir pour discuter sans téléphone" ou "J'aurais besoin que tu me préviennes si tu rentres tard".
              </p>
            </ExpandableSection>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => transitionToStep(19)}
                disabled={isTransitioning}
                className="min-w-48"
                data-testid="button-finished"
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
