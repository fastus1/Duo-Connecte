import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

const COMMUNITY_URL = 'https://communaute.avancersimplement.com';

export function AccessDeniedScreen() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-background px-4"
      data-testid="screen-access-denied"
    >
      <ModeToggle />
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldX 
              className="h-16 w-16 text-destructive" 
              data-testid="icon-access-denied"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 
            className="text-2xl font-semibold text-foreground"
            data-testid="text-access-denied-title"
          >
            Accès non autorisé
          </h1>
          <p 
            className="text-base text-muted-foreground"
            data-testid="text-access-denied-message"
          >
            Cette application est accessible uniquement depuis la communauté Avancer Simplement.
          </p>
        </div>
        
        <Button 
          asChild
          size="lg"
          className="w-full h-12"
          data-testid="button-access-community"
        >
          <a href={COMMUNITY_URL} target="_blank" rel="noopener noreferrer">
            Accéder à la communauté
          </a>
        </Button>
      </div>
    </div>
  );
}
