import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { MessageSquare, Ear, Heart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultiPageModal } from '@/components/flow';

export default function DuoInversionPage8a() {
  const { session } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();

  const handleContinue = () => {
    transitionToStep(27);
  };

  const theoryPages = [
    {
      title: "Partage ton vécu",
      icon: Heart,
      content: (
        <div className="space-y-8">
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            C'est ton tour de partager ton vécu face à cette même situation. Même si vous parlez du même événement, ton expérience peut être complètement différente. C'est normal.
          </p>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Reste centré·e sur tes émotions
            </p>
            <ul className="space-y-2 text-base md:text-lg leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-destructive text-xl">✗</span>
                <span>"Je n'ai jamais voulu te faire sentir comme ça"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">✓</span>
                <span>"Face à cette situation, je me sens coupable et mal à l'aise"</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Plusieurs émotions peuvent coexister :
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
              "Je me sens coupable de t'avoir blessé·e, mais aussi frustré·e parce que je ne savais pas comment faire autrement."
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-base md:text-lg leading-relaxed text-foreground font-semibold">
              Sois authentique
            </p>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              Ton honnêteté permet la vraie connexion. Nomme ce que tu ressens vraiment, même si c'est inconfortable.
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
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Nomme ton vécu
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
              {session.receiverName}, parle de ce que tu as vécu face à cette même situation
            </h2>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Face à cette situation, je me sens...
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Reste sur toi et tes émotions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-base md:text-lg leading-relaxed">
                  Prends ton temps pour identifier et nommer ce que tu ressens
                </span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <MultiPageModal
              triggerText="Plus d'infos: Théories"
              pages={theoryPages}
              finalButtonText="On continue!"
              onComplete={handleContinue}
            />
          </div>

          <div className="pt-4 flex flex-col items-center space-y-3">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={isTransitioning}
              className="w-full md:w-auto px-8 min-w-48"
              data-testid="button-continue"
            >
              On continue!
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
