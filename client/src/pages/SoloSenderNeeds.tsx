import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';

export default function SenderNeeds() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
        <div className="space-y-6 md:space-y-8">
          <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
            {session.senderName}, de quoi as-tu besoin?
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Formule une demande claire et concrète
          </p>

          <div className="space-y-3 md:space-y-4">
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

          <div className="pt-4 space-y-3">
            <Button
              size="lg"
              onClick={() => transitionToStep(21)}
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
