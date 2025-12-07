import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Progress } from '@/components/ui/progress';

export default function ReceiverResponse() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
        <div className="space-y-6 md:space-y-8">
          <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
            {session.receiverName}, que peux-tu offrir?
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Réponds honnêtement à la demande
          </p>

          <div className="space-y-3 md:space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Exprime ce que tu peux ou ne peux pas offrir
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Propose des alternatives si nécessaire
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Sois honnête sur tes limites
                </span>
              </li>
            </ul>

            <ExpandableSection>
              <p className="mb-4">
                {session.senderName} vient de formuler une demande. Ton rôle maintenant est d'y répondre avec authenticité. Tu peux :
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Accepter complètement :</strong> "Oui, je peux faire ça"</li>
                <li><strong>Accepter partiellement :</strong> "Je ne peux pas promettre tous les soirs, mais je peux m'engager à le faire trois fois par semaine"</li>
                <li><strong>Proposer une alternative :</strong> "Ce que tu demandes est difficile pour moi, mais je pourrais plutôt..."</li>
                <li><strong>Refuser avec respect :</strong> "Je ne peux pas faire ça parce que... mais je comprends que c'est important pour toi"</li>
              </ul>
              <p>
                L'important est d'être honnête. Une fausse promesse créera plus de problèmes qu'une limite clairement exprimée.
              </p>
            </ExpandableSection>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              size="lg"
              onClick={() => transitionToStep(22)}
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
