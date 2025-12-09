import { Loader2 } from "lucide-react";
import { Logo } from "./logo";
import { Card, CardContent } from "./ui/card";

interface LoadingScreenProps {
  message?: string;
  showLogo?: boolean;
  showCard?: boolean;
}

export function LoadingScreen({ 
  message = "Chargement...", 
  showLogo = true,
  showCard = true 
}: LoadingScreenProps) {
  const isDark = document.documentElement.classList.contains('dark');
  const bgColor = isDark ? '#252d3a' : '#f0f3f7';
  
  if (!showCard) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {showLogo && <Logo size="lg" />}
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-base text-muted-foreground">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <Card className="w-full max-w-md shadow-lg" data-testid="card-loading">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          {showLogo && <Logo size="lg" />}
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-base text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function PageContainer({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const isDark = document.documentElement.classList.contains('dark');
  const bgColor = isDark ? '#252d3a' : '#f0f3f7';
  
  return (
    <div 
      className={`min-h-screen ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {children}
    </div>
  );
}
