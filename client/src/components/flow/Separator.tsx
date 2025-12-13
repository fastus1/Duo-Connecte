import { cn } from '@/lib/utils';

interface SeparatorProps {
  variant?: 'line' | 'dots' | 'gradient';
  className?: string;
}

export function Separator({ variant = 'line', className }: SeparatorProps) {
  if (variant === 'dots') {
    return (
      <div className={cn("flex items-center justify-center gap-2 py-6", className)}>
        <span className="w-2 h-2 rounded-full bg-primary/30" />
        <span className="w-2 h-2 rounded-full bg-primary/50" />
        <span className="w-2 h-2 rounded-full bg-primary/30" />
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className={cn("py-6", className)}>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
    );
  }

  return (
    <div className={cn("py-6", className)}>
      <div className="h-px bg-border" />
    </div>
  );
}
