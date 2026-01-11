import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { MessageSquare, Ear, Zap, List, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal } from '@/components/flow';

export default function DuoInversionPage10a() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(29);
  };

  const theoryPages = [
    {
      title: "Impact et réaction",
      icon: Zap,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            Partage maintenant les conséquences concrètes de cette situation sur toi. Comment ça t'affecte et comment tu réagis habituellement.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Identifier ton pattern de réaction
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Reconnaître ta réaction automatique aide {session.senderName} à comprendre ton comportement sans le prendre personnellement.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Réactions courantes",
      icon: List,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
            Exemples de réactions courantes :
          </p>
          
          <ul className="space-y-3 text-base md:text-lg leading-relaxed text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span><strong>Défensif·ve :</strong> "Je me justifie immédiatement et je contre-argumente."</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span><strong>Retrait :</strong> "Je me ferme et je crée de la distance."</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span><strong>Contre-attaque :</strong> "Je pointe tes torts pour équilibrer."</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span>"Je deviens inquiet·ète, j'anticipe le pire."</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Exemples concrets",
      icon: FileText,
      content: (
        <div className="space-y-8">
          <ul className="space-y-3 text-base md:text-lg leading-relaxed text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span>"Quand j'interprète que tu me juges, je deviens distant·e pour me protéger."</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span>"Quand je pense que ça ne t'intéresse pas, je me retire et j'arrête d'essayer."</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span>"Face à cette situation, je réagis en me justifiant excessivement."</span>
            </li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Nomme l'impact et ta réaction
        </h1>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <Ear className="w-5 h-5 text-primary" />
          <p className="text-base md:text-lg text-muted-foreground">
            {session.senderName} : écoute attentive et bienveillante
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-foreground text-center">
              {session.receiverName}, quel a été l'impact sur toi, comment as-tu réagis?
            </h2>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Quand ça arrive, je me sens rejeté·e / pas important·e / incompris·e...
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  L'impact sur moi est que...
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Je réagis généralement en...
                </span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Plus d'infos: Théories"
              pages={theoryPages}
              finalButtonText="On continu…"
              onComplete={handleContinue}
            />
          </div>

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={handleContinue}
              className="w-full md:w-auto px-8 min-w-48"
              disabled={isTransitioning}
              data-testid="button-next"
            >
              On continu…
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
