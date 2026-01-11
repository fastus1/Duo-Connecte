import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Handshake, Ear, List, MessageSquare, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal } from '@/components/flow';

export default function DuoInversionPage19a() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(38);
  };

  const theoryPages = [
    {
      title: "Types de réponses",
      icon: List,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Si {session.receiverName} a formulé une demande, ton rôle maintenant est d'y répondre avec authenticité et respect.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Si son besoin principal était d'être entendu·e, tu peux simplement reconnaître ça.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Les quatre types de réponses possibles :
            </p>
            
            <div className="space-y-3 text-base md:text-lg leading-relaxed text-muted-foreground">
              <p><strong>1. Accepter complètement</strong> — C'est réalisable pour toi et tu es volontaire.</p>
              <p><strong>2. Accepter partiellement</strong> — Tu ne peux pas tout offrir, mais tu peux répondre en partie.</p>
              <p><strong>3. Proposer une alternative</strong> — La demande est difficile, mais tu veux combler le besoin d'une autre façon.</p>
              <p><strong>4. Refuser avec respect</strong> — Tu ne peux pas répondre à la demande, mais tu reconnais le besoin comme légitime.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Exemples de réponses",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Exemples de réponses honnêtes :
          </p>
          
          <ul className="space-y-3 text-base md:text-lg leading-relaxed text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span>"Oui, je peux faire ça. Je comprends pourquoi c'est important pour toi."</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span>"Je ne peux pas m'engager sur tous les soirs, mais je peux le faire les mardis et jeudis. Est-ce que ça pourrait aider?"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span>"Ce que tu demandes me met mal à l'aise, mais je pourrais plutôt... Est-ce que ça répondrait à ton besoin?"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span>"Je ne peux pas promettre ça, mais je veux qu'on trouve une solution ensemble."</span>
            </li>
          </ul>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Si le besoin était d'être entendu :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "Je comprends maintenant ta perspective. Merci de l'avoir partagée avec moi."
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Rappel crucial",
      icon: AlertCircle,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Rappel crucial : le besoin est légitime, la demande est négociable.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Même si tu ne peux pas répondre à la demande exacte de {session.receiverName}, son besoin reste valide et important. Ton refus ou ta limite ne nie pas son besoin.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Pourquoi l'honnêteté est essentielle
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Une fausse promesse crée plus de problèmes qu'une limite clairement exprimée. {session.receiverName} préfère connaître tes vraies limites maintenant plutôt que d'être déçu plus tard.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Ton honnêteté respectueuse ouvre la porte à une vraie négociation, pas à un compromis forcé.
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
          <Handshake className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          On peut s'entendre?
        </h1>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <Ear className="w-5 h-5 text-primary" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.receiverName}: écoute avec ouverture
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
              {session.senderName}, est-ce que la demande de {session.receiverName} fait du sens pour toi?
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center">
              Est-ce que tu es capable et volontaire pour répondre à la demande de {session.receiverName}?
            </p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-base md:text-lg leading-relaxed">
                Nomme ce que tu peux ou ne peux pas offrir
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
                Sois honnête sur tes limites et tes capacités
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

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={isTransitioning}
              className="w-full md:w-auto px-8 min-w-48"
              data-testid="button-finished"
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
