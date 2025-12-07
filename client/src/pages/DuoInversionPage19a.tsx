import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { ExpandableSection } from '@/components/ExpandableSection';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Handshake, VolumeX } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DuoInversionPage19a() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Handshake className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground text-center">
          On peut s'entendre?
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
              {session.senderName}, est-ce que la demande de {session.receiverName} fait du sens pour toi?
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Est-ce que tu es capable et volontaire pour répondre à la demande de {session.receiverName}?
            </p>
          </div>

          <div className="space-y-4">
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
                {session.receiverName} vient de formuler une demande. Ton rôle maintenant est d'y répondre avec authenticité. Tu peux :
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

          <div className="space-y-4 pt-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => transitionToStep(38)}
                disabled={isTransitioning}
                className="min-w-48"
                data-testid="button-finished"
              >
                Prochaine étape
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
