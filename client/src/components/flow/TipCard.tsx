import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TipCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function TipCard({ children, title = "Conseil", className }: TipCardProps) {
  return (
    <div className={cn(
      "flex gap-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50",
      className
    )}>
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
          {title}
        </p>
        <div className="text-sm text-amber-700 dark:text-amber-300/80 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
