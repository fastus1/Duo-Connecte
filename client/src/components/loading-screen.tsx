import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-background"
      data-testid="screen-loading"
    >
      <div className="flex flex-col items-center gap-6">
        <Loader2 
          className="h-12 w-12 animate-spin text-primary" 
          data-testid="spinner-loading"
        />
        <p 
          className="text-lg font-medium text-muted-foreground"
          data-testid="text-loading-message"
        >
          Vérification en cours...
        </p>
      </div>
    </div>
  );
}
