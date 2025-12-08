import { ArrowLeft, Lock, Home } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getSessionToken } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';

interface PersistentNavProps {
  showBack?: boolean;
  onBack?: () => void;
  canGoBack?: boolean;
}

export function PersistentNav({ 
  showBack = true, 
  onBack,
  canGoBack = false
}: PersistentNavProps) {
  const [location, setLocation] = useLocation();
  const sessionToken = getSessionToken();
  const isLoggedIn = !!sessionToken;

  const { data: userData } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      if (!sessionToken) return null;
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });
      if (!response.ok) return null;
      return response.json();
    },
    enabled: isLoggedIn,
    retry: false,
  });

  const isAdmin = userData?.isAdmin || false;
  const isOnAuthPage = location === '/auth';
  const isOnAdminPage = location === '/admin';

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
          {isLoggedIn && isAdmin ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLocation('/')}
              data-testid="button-nav-home"
            >
              <Home className="w-4 h-4" />
            </Button>
          ) : !isOnAuthPage && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLocation('/auth')}
              data-testid="button-nav-login"
            >
              <Lock className="w-4 h-4" />
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
