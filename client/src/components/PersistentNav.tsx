import { ArrowLeft, Lock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'wouter';

interface PersistentNavProps {
  showBack?: boolean;
  rightButton?: 'admin' | 'home';
  onBack?: () => void;
  canGoBack?: boolean;
}

export function PersistentNav({ 
  showBack = true, 
  rightButton = 'admin',
  onBack,
  canGoBack = false
}: PersistentNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-3 md:p-6 z-40" data-testid="persistent-nav">
      <div className="max-w-3xl mx-auto flex flex-wrap items-center gap-2 md:gap-3 justify-between pointer-events-auto">
        <div className="flex items-center gap-2 md:gap-3">
          {showBack && canGoBack && onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="gap-2"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Retour</span>
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {rightButton === 'admin' ? (
            <Link href="/admin">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                data-testid="button-admin"
              >
                <Lock className="h-4 w-4" />
                <span className="sr-only">Admin</span>
              </Button>
            </Link>
          ) : (
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                data-testid="button-home"
              >
                <Home className="h-4 w-4" />
                <span className="sr-only">Accueil</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
