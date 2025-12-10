import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { useLocation } from 'wouter';
import { Heart, Users } from 'lucide-react';

export default function Welcome() {
  const { updateSession } = useSession();
  const [, setLocation] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transitionDelay = prefersReducedMotion ? 0 : 1200;

  const handleChoice = useCallback((type: 'solo' | 'duo') => {
    const targetPath = type === 'solo' ? '/solo/roles' : '/duo/roles';
    
    setIsTransitioning(true);
    updateSession({ appType: type, currentStep: 0 });
    
    if (transitionDelay === 0) {
      setProgress(100);
      setLocation(targetPath);
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
          setLocation(targetPath);
        }, 200);
      }
    }, 16);
  }, [updateSession, setLocation, transitionDelay]);

  return (
    <PageLayout showNav={true}>
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
            Un outil pour faciliter la gestion des émotions (relation à soi) et la communication authentique (relation à l'autre)
          </p>

          <div className="grid md:grid-cols-2 gap-3 md:gap-4 pt-6 md:pt-8 max-w-2xl mx-auto px-4">
            <div className="flex flex-col items-center space-y-2 md:space-y-3 p-4 md:p-6 rounded-lg border-2 border-border hover-elevate active-elevate-2 transition-all">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h2 className="text-base md:text-lg font-bold text-foreground" style={{ fontFamily: 'Figtree, sans-serif' }}>
                Régulation émotionnelle
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground text-center leading-relaxed">
                Gérer vos émotions en solo
              </p>
              <Button
                size="default"
                onClick={() => handleChoice('solo')}
                disabled={isTransitioning}
                className="text-xs md:text-sm px-4 md:px-6 w-full mt-2"
                data-testid="button-solo"
              >
                Parcours Solo
              </Button>
            </div>

            <div className="flex flex-col items-center space-y-2 md:space-y-3 p-4 md:p-6 rounded-lg border-2 border-border hover-elevate active-elevate-2 transition-all">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h2 className="text-base md:text-lg font-bold text-foreground" style={{ fontFamily: 'Figtree, sans-serif' }}>
                Communication authentique
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground text-center leading-relaxed">
                Dialoguer et se comprendre à deux
              </p>
              <Button
                size="default"
                onClick={() => handleChoice('duo')}
                disabled={isTransitioning}
                className="text-xs md:text-sm px-4 md:px-6 w-full mt-2"
                data-testid="button-duo"
              >
                Parcours Duo
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
