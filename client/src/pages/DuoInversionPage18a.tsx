import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Heart, Ear, MessageSquare, Shield, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal } from '@/components/flow';

export default function DuoInversionPage18a() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(37);
  };

  const theoryPages = [
    {
      title: "Exemple 1 - Être écouté·e",
      icon: MessageSquare,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Ton introspection:
          </p>
          
          <ol className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground list-decimal list-inside">
            <li><strong>Besoin:</strong> "J'ai besoin de me sentir respecté·e et écouté·e"</li>
            <li><strong>Désir:</strong> "Je désire son attention quand on se parle"</li>
            <li><strong>Demande:</strong> "Pourrais-tu poser ton téléphone quand je te parle?"</li>
          </ol>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce que tu dis:
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "J'ai besoin de me sentir respecté·e et écouté·e. Pourrais-tu faire attention de me regarder quand je te parle? Ça ferait une vraie différence pour moi."
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Exemple 2 - La confiance",
      icon: Shield,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Ton introspection:
          </p>
          
          <ol className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground list-decimal list-inside">
            <li><strong>Besoin:</strong> "J'ai besoin de savoir que tu me fais confiance"</li>
            <li><strong>Désir:</strong> "Je désire de l'autonomie dans mes décisions"</li>
            <li><strong>Demande:</strong> "Pourrais-tu me laisser gérer certaines choses à ma façon?"</li>
          </ol>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce que tu dis:
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "J'ai besoin de savoir que tu me fais confiance. Pourrais-tu me laisser gérer certaines choses à ma façon, même si c'est différent de ce que tu ferais?"
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Simplement être entendu·e",
      icon: CheckCircle,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            <strong>Peut-être que ton seul besoin était de partager ta perspective.</strong> Si c'est le cas, c'est parfaitement légitime.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce que tu peux dire:
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "Mon besoin principal était de partager ma perspective avec toi. Maintenant que c'est fait, je me sens mieux."
            </p>
          </div>
          
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            C'est une réponse valide. Tu n'as pas toujours besoin d'une demande d'action.
          </p>
        </div>
      )
    },
    {
      title: "Ce qui fonctionne",
      icon: AlertTriangle,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce qui NE fonctionne pas:
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
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Ce qui fonctionne:
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
            <strong>La différence?</strong> Tu énonces un besoin et une invitation, pas une exigence ou un jugement.
          </p>
        </div>
      )
    },
    {
      title: "Rappel final",
      icon: Lightbulb,
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Structure simple à utiliser:
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "J'ai besoin de [ton besoin légitime]. Pourrais-tu [ta demande concrète]?"
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Rappelle-toi:
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
                <span>{session.senderName} peut y répondre de plusieurs façons</span>
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
            {session.senderName}: écoute avec ouverture
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
              {session.receiverName}, de quoi aurais-tu besoin?
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-semibold">
              Prends un moment pour identifier et préciser ton besoin, ton désir et ta demande, puis exprime-toi à {session.senderName}.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-base md:text-lg text-foreground font-semibold">
                  Étape 1 - Identifie ton besoin
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Demande-toi: "Qu'est-ce qui me manque vraiment dans cette situation? Quel besoin humain fondamental n'est pas comblé?"
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
                  "Quelle action concrète et réalisable pourrais-je proposer à {session.senderName}?"
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

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
            <p className="text-base text-foreground">
              <strong>Rappel:</strong> Ton besoin est légitime, pas négociable.
            </p>
            <p className="text-base text-foreground">
              Ta demande est une proposition, négociable.
            </p>
            <p className="text-base text-foreground">
              Vous trouverez ensemble une voie qui fonctionne.
            </p>
          </div>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Besoin d'aide? Voir des exemples"
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
