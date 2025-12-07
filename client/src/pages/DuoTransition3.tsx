import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { useSession } from '@/contexts/SessionContext';
import { GitBranch, MessageSquare, Repeat } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Transition3() {
  const { isTransitioning, transitionToStep, progress } = usePageTransition();
  const { session } = useSession();

  const handleOption1 = () => {
    transitionToStep(21);
  };

  const handleOption2 = () => {
    transitionToStep(25);
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-180px)] md:min-h-[60vh]">
        <div className="max-w-2xl mx-auto text-center space-y-4 md:space-y-8 py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 mb-2">
            <GitBranch className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight px-4" style={{ fontFamily: 'Figtree, sans-serif' }}>
            Conclure ou explorer la perspective de {session.receiverName}?
          </h1>

          <p className="text-sm md:text-base text-foreground leading-relaxed max-w-lg mx-auto px-4">
            Vous avez maintenant partagé vos vécus, vos besoins et trouvé des pistes d'entente. Deux options s'offrent à vous :
          </p>

          <div className="grid md:grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-6 max-w-2xl mx-auto px-4">
            <div className="flex flex-col items-center p-4 md:p-6 rounded-lg border-2 border-border hover-elevate active-elevate-2 transition-all">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 md:mb-3">
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h2 className="text-base md:text-lg font-bold text-foreground mb-2 md:mb-3" style={{ fontFamily: 'Figtree, sans-serif' }}>
                Option 1 : Clôturer maintenant
              </h2>
              <p className="text-xs md:text-sm font-semibold text-foreground mb-2 md:mb-3">
                Un dernier feedback dans l'ici et maintenant
              </p>
              <p className="text-xs md:text-sm text-muted-foreground text-center leading-relaxed mb-4 flex-grow">
                Partagez comment vous vous sentez après cet échange.
              </p>
              <Button
                size="default"
                onClick={handleOption1}
                disabled={isTransitioning}
                className="text-xs md:text-sm px-4 md:px-6 w-full"
                data-testid="button-option1"
              >
                Clôturer maintenant
              </Button>
            </div>

            <div className="flex flex-col items-center p-4 md:p-6 rounded-lg border-2 border-border hover-elevate active-elevate-2 transition-all">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 md:mb-3">
                <Repeat className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h2 className="text-base md:text-lg font-bold text-foreground mb-2 md:mb-3" style={{ fontFamily: 'Figtree, sans-serif' }}>
                Option 2 : Inverser les rôles
              </h2>
              <p className="text-xs md:text-sm font-semibold text-foreground mb-2 md:mb-3">
                Le récepteur s'exprime sur la même situation
              </p>
              <p className="text-xs md:text-sm text-muted-foreground text-center leading-relaxed mb-4 flex-grow">
                {session.receiverName} devient l'émetteur pour explorer les deux perspectives.
              </p>
              <Button
                size="default"
                onClick={handleOption2}
                disabled={isTransitioning}
                className="text-xs md:text-sm px-4 md:px-6 w-full"
                data-testid="button-option2"
              >
                Inverser les rôles
              </Button>
            </div>
          </div>

          {isTransitioning && (
            <div className="pt-4">
              <Progress value={progress} className="w-full md:w-96 mx-auto" />
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
