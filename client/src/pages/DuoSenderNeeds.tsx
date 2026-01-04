import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart, VolumeX, Lightbulb, MessageSquare, Target, AlertTriangle, Handshake } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal, Subtitle, Callout } from '@/components/flow';

export default function SenderNeeds() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(19);
  };

  const theoryPages = [
    {
      title: "Comment procéder",
      icon: Lightbulb,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Maintenant que tu as partagé ton vécu et que {session.receiverName} l'a entendu, il est temps d'identifier ce dont tu as besoin, puis de l'exprimer clairement.
          </p>
          
          <div className="space-y-4">
            <Subtitle>Comment procéder</Subtitle>
            <ol className="space-y-3 text-base md:text-lg text-muted-foreground list-decimal list-inside">
              <li>Prends un moment d'introspection silencieuse
                <ul className="ml-6 mt-1 text-sm text-muted-foreground">
                  <li className="list-disc">Tu peux le faire par écrit si ça t'aide</li>
                </ul>
              </li>
              <li>Identifie ton besoin fondamental</li>
              <li>Réfléchis à ce qui pourrait y répondre (ton désir)</li>
              <li>Formule mentalement une demande concrète</li>
              <li>Exprime ensuite ton besoin et ta demande à {session.receiverName}</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      title: "Exemples pour t'inspirer",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <Subtitle>Exemples pour t'inspirer</Subtitle>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Exemple 1 :</p>
              <Callout variant="neutral">
                <p className="text-base italic">
                  "J'ai besoin de me sentir écouté et respecté. Pourrais-tu poser ton téléphone quand je te parle? Ça ferait une vraie différence pour moi."
                </p>
              </Callout>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium text-foreground">Exemple 2 :</p>
              <Callout variant="neutral">
                <p className="text-base italic">
                  "J'ai besoin de sécurité émotionnelle. Pourrais-tu me prévenir si tu as besoin de temps seul, plutôt que de partir sans explication?"
                </p>
              </Callout>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium text-foreground">Exemple 3 :</p>
              <Callout variant="neutral">
                <p className="text-base italic">
                  "J'ai besoin de connexion. Est-ce qu'on pourrait prendre 20 minutes chaque soir pour discuter, juste nous deux, sans distraction?"
                </p>
              </Callout>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Critères d'une bonne demande",
      icon: Target,
      content: (
        <div className="space-y-8">
          <Subtitle>Critères d'une bonne demande</Subtitle>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="font-medium text-foreground mb-2">Spécifique</p>
              <p className="text-muted-foreground">
                "Pourrais-tu faire attention de me regarder quand je te parle?" plutôt que "J'ai besoin de plus d'attention"
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-muted">
              <p className="font-medium text-foreground mb-2">Réalisable</p>
              <p className="text-muted-foreground">
                Quelque chose que {session.receiverName} peut concrètement faire
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-muted">
              <p className="font-medium text-foreground mb-2">Ouverte</p>
              <p className="text-muted-foreground">
                "Pourrais-tu..." ou "Serais-tu d'accord pour..." au lieu de "Tu dois..."
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ce qu'il faut éviter",
      icon: AlertTriangle,
      content: (
        <div className="space-y-8">
          <Subtitle>Ce qu'il faut éviter</Subtitle>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-destructive font-medium">"Tu dois arrêter de..." (exigence)</p>
            </div>
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-destructive font-medium">"Tu ne devrais plus jamais..." (absolu)</p>
            </div>
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-destructive font-medium">"Si tu m'aimais vraiment, tu..." (manipulation)</p>
            </div>
          </div>
          
          <Subtitle>Ce qui fonctionne</Subtitle>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-primary font-medium">"J'ai besoin de... Pourrais-tu...?"</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-primary font-medium">"Ça me ferait du bien si..."</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-primary font-medium">"Serais-tu d'accord pour...?"</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Pourquoi séparer besoin et demande",
      icon: Handshake,
      content: (
        <div className="space-y-8">
          <Subtitle>Pourquoi séparer besoin et demande dans ton expression</Subtitle>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            En nommant d'abord ton besoin, puis en proposant une demande, {session.receiverName} comprend que ta demande est une façon parmi d'autres de combler ton besoin.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Ça ouvre la porte à la collaboration. Peut-être que {session.receiverName} proposera une autre façon de répondre à ton besoin qui fonctionne mieux pour vous deux.
          </p>
          
          <Callout variant="primary">
            <p className="text-base font-medium">
              Ton besoin est légitime. Ta demande est une proposition. Ensemble, vous trouverez la voie.
            </p>
          </Callout>
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
          Exprime tes besoins
        </h1>

        <div className="flex items-center gap-2">
          <VolumeX className="w-5 h-5 text-destructive" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.receiverName}: écoute avec ouverture
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              {session.senderName}, de quoi aurais-tu besoin?
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Prends d'abord un moment d'introspection, puis exprime ton besoin et ta demande à {session.receiverName}.
            </p>
          </div>

          <div className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  <strong>Introspection :</strong> Identifie ton besoin, puis réfléchis à ce qui pourrait y répondre (ton désir), puis formule mentalement ta demande
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  <strong>Expression :</strong> "J'ai besoin de..." puis "Pourrais-tu..."
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

          <div className="space-y-4 pt-4">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleContinue}
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
