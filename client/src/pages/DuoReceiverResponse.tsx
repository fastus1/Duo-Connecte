import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Handshake, Ear, ListChecks, ArrowRightLeft, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal } from '@/components/flow';

export default function ReceiverResponse() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(20);
  };

  const theoryPages = [
    {
      title: "Types de réponses",
      icon: ListChecks,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            {session.senderName} vient de formuler une demande. Ton rôle maintenant est d'y répondre avec authenticité et respect.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Les quatre types de réponses possibles :
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Tu peux répondre de plusieurs façons, toutes légitimes si elles sont honnêtes :
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
                1. Accepter complètement
              </p>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                Tu peux répondre à la demande telle quelle. C'est réalisable pour toi et tu es volontaire.
              </p>
              <ul className="text-base md:text-lg leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">•</span>
                  <span>Exemple : "Oui, je peux poser mon téléphone quand tu me parles. Ça fait du sens."</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
                2. Accepter partiellement
              </p>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                Tu ne peux pas tout offrir, mais tu peux répondre en partie à la demande.
              </p>
              <ul className="text-base md:text-lg leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">•</span>
                  <span>Exemple : "Je ne peux pas promettre tous les soirs, mais je peux m'engager à te donner mon attention pleine trois fois par semaine."</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Alternatives et refus",
      icon: ArrowRightLeft,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
                3. Proposer une alternative
              </p>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                La demande spécifique est difficile pour toi, mais tu veux combler le besoin d'une autre façon.
              </p>
              <ul className="text-base md:text-lg leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">•</span>
                  <span>Exemple : "Ce que tu demandes est difficile pour moi, mais je pourrais plutôt te prévenir quand j'ai besoin d'espace. Est-ce que ça répondrait à ton besoin?"</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
                4. Refuser avec respect
              </p>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                Tu ne peux pas répondre à la demande, mais tu reconnais le besoin comme légitime.
              </p>
              <ul className="text-base md:text-lg leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">•</span>
                  <span>Exemple : "Je ne peux pas faire ça parce que ça me met trop de pression. Par contre, je comprends que c'est important pour toi et je veux qu'on trouve une autre solution ensemble."</span>
                </li>
              </ul>
            </div>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Rappel crucial : le besoin est légitime, la demande est négociable!
          </p>
        </div>
      )
    },
    {
      title: "Exemples de réponses",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Même si tu ne peux pas répondre à la demande exacte de {session.senderName}, son <em>besoin</em> reste valide et important. Ton refus ou ta limite ne nie pas son besoin.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Exemples concrets de réponses honnêtes :
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
              <span>"Je ne peux pas promettre ça parce que je ne sais pas si je suis capable de tenir cet engagement. Mais je veux vraiment qu'on trouve une solution qui fonctionne pour nous deux."</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Ce qu'il faut éviter",
      icon: AlertTriangle,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Pourquoi l'honnêteté est essentielle :
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Une fausse promesse crée plus de problèmes qu'une limite clairement exprimée. Si tu acceptes quelque chose que tu ne peux pas tenir, tu prépares une future déception. Il est préférable de connaître tes vraies limites maintenant plutôt que d'être déçu plus tard.
          </p>
          
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Ce qu'il faut éviter :
          </p>
          
          <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-destructive text-xl">✗</span>
              <span>Accepter sans conviction (c'est voué à l'échec, s'engager authentiquement, ou pas)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-destructive text-xl">✗</span>
              <span>Refuser de façon défensive ("C'est ridicule comme demande")</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-destructive text-xl">✗</span>
              <span>Minimiser le besoin ("Tu exagères, c'est pas si important")</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-destructive text-xl">✗</span>
              <span>Contre-attaquer ("Toi aussi tu fais ça!")</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Ce qui fonctionne",
      icon: CheckCircle,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Ce qui fonctionne :
          </p>
          
          <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">✓</span>
              <span>Reconnaître le besoin même si tu refuses la demande</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">✓</span>
              <span>Proposer des alternatives créatives</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">✓</span>
              <span>Être clair sur ce que tu peux vraiment offrir</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">✓</span>
              <span>Exprimer ta volonté de trouver une solution ensemble</span>
            </li>
          </ul>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Ton honnêteté respectueuse ouvre la porte à une vraie négociation, pas à un compromis forcé.
          </p>
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
            {session.senderName}: écoute avec ouverture
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-xl md:text-2xl font-medium text-foreground">
              {session.receiverName}, est-ce que la demande de {session.senderName} fait du sens pour toi?
            </h2>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Est-ce que tu es capable et volontaire pour répondre à la demande de {session.senderName}?
            </p>
          </div>

          <div className="space-y-4">
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
