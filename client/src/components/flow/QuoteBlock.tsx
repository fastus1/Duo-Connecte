import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuoteBlockProps {
  children: React.ReactNode;
  author?: string;
  className?: string;
}

export function QuoteBlock({ children, author, className }: QuoteBlockProps) {
  return (
    <div className={cn("relative py-6 px-8", className)}>
      <Quote className="absolute top-0 left-0 w-8 h-8 text-primary/20 -scale-x-100" />
      <blockquote className="text-lg md:text-xl italic text-foreground leading-relaxed pl-4">
        {children}
      </blockquote>
      {author && (
        <p className="mt-3 text-sm text-muted-foreground pl-4">
          — {author}
        </p>
      )}
      <Quote className="absolute bottom-0 right-0 w-8 h-8 text-primary/20" />
    </div>
  );
}
