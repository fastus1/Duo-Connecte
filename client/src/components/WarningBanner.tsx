import { AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WarningBannerProps {
  type?: 'info' | 'warning' | 'speaker' | 'listener';
  children: React.ReactNode;
  speaker?: string;
}

export function WarningBanner({ type = 'info', children, speaker }: WarningBannerProps) {
  const variants = {
    info: 'bg-primary/10 border-primary/20 text-primary-foreground',
    warning: 'bg-destructive/10 border-destructive/20 text-destructive',
    speaker: 'bg-accent border-accent-border text-accent-foreground',
    listener: 'bg-destructive/10 border-destructive/20 text-destructive',
  };

  const icons = {
    info: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    speaker: speaker ? <Volume2 className="w-5 h-5 flex-shrink-0" /> : <VolumeX className="w-5 h-5 flex-shrink-0" />,
    listener: <VolumeX className="w-5 h-5 flex-shrink-0" />,
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-3 md:p-4 flex items-center gap-2 md:gap-3 mb-4 md:mb-6',
        variants[type]
      )}
      data-testid={`banner-${type}`}
    >
      {icons[type]}
      <p className="text-sm md:text-base font-medium">
        {children}
      </p>
    </div>
  );
}
