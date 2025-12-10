import { useState, useEffect } from 'react';
import { X, Share, MoreVertical, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'pwa-install-banner-dismissed';
const DISMISS_DURATION_DAYS = 7;

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isAndroid(): boolean {
  return /Android/.test(navigator.userAgent);
}

function isMobile(): boolean {
  return isIOS() || isAndroid();
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
}

function isDismissed(): boolean {
  const dismissed = localStorage.getItem(STORAGE_KEY);
  if (!dismissed) return false;
  
  const dismissedDate = new Date(dismissed);
  const now = new Date();
  const diffDays = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return diffDays < DISMISS_DURATION_DAYS;
}

export function InstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isMobile() || isStandalone() || isDismissed()) {
      return;
    }
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground mb-1">
              Installer Duo Connecte
            </p>
            
            {isIOS() ? (
              <p className="text-xs text-muted-foreground">
                Appuyez sur <Share className="inline w-3.5 h-3.5 mx-0.5" /> puis{' '}
                <span className="font-medium">"Sur l'écran d'accueil"</span>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Appuyez sur <MoreVertical className="inline w-3.5 h-3.5 mx-0.5" /> puis{' '}
                <span className="font-medium">"Ajouter à l'écran d'accueil"</span>
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="flex-shrink-0 -mt-1 -mr-2"
            data-testid="button-dismiss-install-banner"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
