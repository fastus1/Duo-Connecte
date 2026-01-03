import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PageLayout } from '@/components/PageLayout';
import { InstallBanner } from '@/components/InstallBanner';
import { useSession } from '@/contexts/SessionContext';
import { useLocation } from 'wouter';
import { Users } from 'lucide-react';

export default function Welcome() {
  const { updateSession } = useSession();
  const [, setLocation] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transitionDelay = prefersReducedMotion ? 0 : 1200;

  const handleStart = useCallback(() => {
    setIsTransitioning(true);
    updateSession({ appType: 'duo', currentStep: 0 });
    
    if (transitionDelay === 0) {
      setProgress(100);
      setLocation('/duo/presentation');
      return;
    }
    
    setProgress(0);
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / transitionDelay) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setLocation('/duo/presentation');
        }, 200);
      }
    }, 16);
  }, [updateSession, setLocation, transitionDelay]);

  return (
    <PageLayout showNav={true} showBackButton={false}>
      <InstallBanner />
      <div className="flex items-center justify-center min-h-[calc(100vh-180px)] md:min-h-[60vh]">
        <div className="max-w-2xl mx-auto text-center space-y-4 md:space-y-8 py-4">
          <div className="space-y-1">
            <div className="inline-flex items-center justify-center w-[80px] h-[80px] md:w-[120px] md:h-[120px]">
              <img 
                src="/logo-blue.png" 
                alt="Avancer Simplement Logo" 
                className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] dark:hidden"
              />
              <img 
                src="/logo-white.png" 
                alt="Avancer Simplement Logo" 
                className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] hidden dark:block"
              />
            </div>
            <div className="text-lg md:text-2xl font-black italic text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              AVANCER SIMPLEMENT
            </div>
          </div>

          <div className="text-sm md:text-lg text-muted-foreground tracking-wide italic">
            Présente
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground pt-2 md:pt-6 tracking-tight" style={{ fontFamily: 'Figtree, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            Duo-Connecte
          </h1>

          <p className="text-sm md:text-lg text-foreground leading-relaxed max-w-lg mx-auto pt-3 md:pt-4 px-4">
            Un outil pour faciliter la communication authentique et se comprendre à deux
          </p>

          <div className="pt-6 md:pt-8 max-w-md mx-auto px-4">
            <div className="flex flex-col items-center space-y-3 md:space-y-4 p-6 md:p-8 rounded-lg border-2 border-primary/20 bg-primary/5">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-foreground" style={{ fontFamily: 'Figtree, sans-serif' }}>
                Communication authentique
              </h2>
              <p className="text-sm md:text-base text-muted-foreground text-center leading-relaxed">
                Dialoguer et se comprendre à deux grâce à un parcours guidé
              </p>
              <Button
                size="lg"
                onClick={handleStart}
                disabled={isTransitioning}
                className="text-sm md:text-base px-8 md:px-10 w-full mt-2"
                data-testid="button-start-duo"
              >
                Commencer
              </Button>
            </div>
          </div>

          {isTransitioning && (
            <div className="pt-4">
              <Progress value={progress} className="w-full md:w-96 mx-auto" />
            </div>
          )}

          <p className="text-xs md:text-sm text-muted-foreground pt-4 md:pt-6 max-w-lg mx-auto leading-relaxed px-4">
            Cet outil s'utilise uniquement en présentiel pour l'instant.<br />
            Assurez-vous d'être ensemble et disposés à vous connecter.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
