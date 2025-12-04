import { useConfig } from '@/contexts/config-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, Globe } from 'lucide-react';

export function ModeToggle() {
  const { mode, toggleMode } = useConfig();
  const isDev = mode === 'dev';
  
  // Only show toggle in development environment
  const envDevMode = import.meta.env.VITE_DEV_MODE === 'true';
  if (!envDevMode) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <Badge 
        variant={isDev ? "default" : "secondary"}
        className="text-xs font-medium"
        data-testid="badge-current-mode"
      >
        {isDev ? 'DEV' : 'PROD'}
      </Badge>
      <Button
        onClick={toggleMode}
        size="sm"
        variant="outline"
        className="gap-2"
        data-testid="button-toggle-mode"
      >
        {isDev ? (
          <>
            <Globe className="h-4 w-4" />
            Passer en PROD
          </>
        ) : (
          <>
            <Wrench className="h-4 w-4" />
            Passer en DEV
          </>
        )}
      </Button>
    </div>
  );
}
