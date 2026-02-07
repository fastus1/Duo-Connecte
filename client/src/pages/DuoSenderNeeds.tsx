import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart, Ear, Lightbulb, Shield, MessageSquare, AlertTriangle, HelpCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal, Callout } from '@/components/flow';

export default function SenderNeeds() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContinue = () => {
    transitionToStep(19);
  };

  const theoryPages = [
    {
      title: "Exemple 1 - Être écouté·e",
      icon: Lightbulb,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              La situation de départ :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Quand tu parles, {session.receiverName} regarde son téléphone.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ton introspection :
            </p>
            <ol className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground list-decimal list-inside">
              <li><span className="font-medium text-foreground">Besoin :</span> "J'ai besoin de me sentir respecté·e et écouté·e"</li>
              <li><span className="font-medium text-foreground">Désir :</span> "Je désire son attention quand on se parle"</li>
              <li><span className="font-medium text-foreground">Demande :</span> "Pourrais-tu poser ton téléphone quand je te parle?"</li>
            </ol>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce que tu dis :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "J'ai besoin de me sentir respecté·e et écouté·e. Pourrais-tu faire attention de me regarder quand je te parle? Ça ferait une vraie différence pour moi."
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce qui peut se passer ensuite :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              {session.receiverName} peut accepter, proposer des ajustements, ou proposer une autre façon de combler ton besoin.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Exemple 2 - Sécurité",
      icon: Shield,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              La situation de départ :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              {session.receiverName} part subitement sans explication, et tu te sens anxieux·se.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ton introspection :
            </p>
            <ol className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground list-decimal list-inside">
              <li><span className="font-medium text-foreground">Besoin :</span> "J'ai besoin de sécurité émotionnelle"</li>
              <li><span className="font-medium text-foreground">Désir :</span> "Je désire savoir ce qui se passe"</li>
              <li><span className="font-medium text-foreground">Demande :</span> "Pourrais-tu me prévenir si tu as besoin de temps seul, plutôt que de partir sans explication?"</li>
            </ol>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce que tu dis :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "J'ai besoin d'être rassuré. L'incertitude me rend anxieux·se, pourrais-tu me prévenir quand tu as besoin de temps seul?"
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Exemple 3 - Connexion",
      icon: Heart,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              La situation de départ :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Vous avez peu de moments pour vraiment discuter ensemble.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ton introspection :
            </p>
            <ol className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground list-decimal list-inside">
              <li><span className="font-medium text-foreground">Besoin :</span> "J'ai besoin de connexion"</li>
              <li><span className="font-medium text-foreground">Désir :</span> "Je désire des moments de qualité ensemble"</li>
              <li><span className="font-medium text-foreground">Demande :</span> "Pourrais-tu prendre 20 minutes chaque soir pour discuter, sans téléphone?"</li>
            </ol>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce que tu dis :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "J'ai besoin de connexion. Est-ce qu'on pourrait prendre 20 minutes chaque soir pour discuter juste nous deux, sans distraction? Ça m'aiderait à me sentir proche de toi."
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Critique commune",
      icon: AlertTriangle,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce qui NE fonctionne pas :
            </p>
            <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-destructive text-xl">✗</span>
                <span>"Tu dois arrêter de..."</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-destructive text-xl">✗</span>
                <span>"Tu ne devrais jamais..."</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-destructive text-xl">✗</span>
                <span>"Si tu m'aimais, tu..."</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-destructive text-xl">✗</span>
                <span>"Tu fais toujours..."</span>
              </li>
            </ul>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Pourquoi?</span> Ça place {session.receiverName} sur la défensive.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce qui fonctionne :
            </p>
            <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span>"J'ai besoin de... Pourrais-tu...?"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span>"Ça m'aiderait si..."</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span>"Serais-tu d'accord pour...?"</span>
              </li>
            </ul>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">La différence?</span> Vous énoncez un besoin et une invitation, pas une exigence ou un jugement.
          </p>
        </div>
      )
    },
    {
      title: "Si tu n'arrives pas à identifier ton besoin",
      icon: HelpCircle,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            C'est normal. Identifier ses besoins demande de la pratique.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Refais le processus du début :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              Face à… [déclencheur, la situation], je me suis senti… [vécu, émotions]
            </p>
            <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Qu'est-ce qui m'aiderait à me sentir mieux dans cette situation?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Qu'est-ce qui est important pour moi ici?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Qu'est-ce que je cherche à protéger ou à obtenir?</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Comment j'aimerais que ce soit différent?</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Si tu ne trouves pas :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              C'est acceptable de dire à {session.receiverName} : "J'ai de la difficulté à identifier mon besoin exact, mais ce que je sais, c'est que quelque chose me manque ici."
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Rappel final",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Structure simple à utiliser :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "J'ai besoin de [ton besoin légitime]. Pourrais-tu [ta demande concrète]?"
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Rappelle-toi :
            </p>
            <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Ton besoin est légitime et mérite d'être entendu</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Ta demande est une proposition créative, pas une exigence</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>{session.receiverName} peut y répondre de plusieurs façons</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span>Vous cherchez ensemble, vous ne vous opposez pas</span>
              </li>
            </ul>
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
          Exprime tes besoins
        </h1>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <Ear className="w-5 h-5 text-primary" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.receiverName}: écoute avec ouverture
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
            {session.senderName}, de quoi aurais-tu besoin?
          </h2>

          <div className="space-y-6">
            <p className="text-base md:text-lg text-foreground leading-relaxed font-medium text-center">
              Prends un moment pour identifier et préciser ton besoin, ton désir et ta demande, puis exprime-toi à {session.receiverName}.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-base md:text-lg text-foreground font-semibold">
                  Étape 1 - Identifie ton besoin
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Demande-toi : "Qu'est-ce qui me manque vraiment dans cette situation? Quel besoin n'est pas comblé?"
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-base md:text-lg text-foreground font-semibold">
                  Étape 2 - Réfléchis à ce qui pourrait aider (désir)
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  "Qu'est-ce qui comblerait ce besoin? Comment j'aimerais que les choses se passent?"
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-base md:text-lg text-foreground font-semibold">
                  Étape 3 - Formule ta demande
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  "Quelle action concrète et réalisable pourrais-je proposer à {session.receiverName}?"
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-base md:text-lg text-foreground font-semibold">
                  Étape 4 - Exprime clairement
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  "J'ai besoin de [ton besoin]. Pourrais-tu [ta demande concrète]? Ça m'aiderait vraiment."
                </p>
              </div>
            </div>
          </div>

          <Callout variant="primary">
            <div className="space-y-2">
              <p className="text-base font-medium">Rappel : Ton besoin est légitime, pas négociable.</p>
              <p className="text-base">Ta demande est une proposition, négociable.</p>
              <p className="text-base">Vous trouverez ensemble une voie qui fonctionne.</p>
            </div>
          </Callout>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Besoin d'aide? Voir des exemples"
              pages={theoryPages}
              finalButtonText="J'ai terminé"
              onComplete={handleContinue}
              open={isModalOpen}
              onOpenChange={setIsModalOpen}
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
