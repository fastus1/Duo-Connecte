import { Code2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function DevModeIndicator() {
  const devMode = import.meta.env.VITE_DEV_MODE === 'true';

  if (!devMode) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50" data-testid="badge-dev-mode">
      <Badge 
        variant="default" 
        className="bg-warning text-warning-foreground hover:bg-warning shadow-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
      >
        <Code2 className="h-3 w-3 mr-1.5" />
        Mode Développement
      </Badge>
    </div>
  );
}
