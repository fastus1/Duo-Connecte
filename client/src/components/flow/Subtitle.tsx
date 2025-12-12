interface SubtitleProps {
  children: React.ReactNode;
  centered?: boolean;
  variant?: 'muted' | 'default';
}

export function Subtitle({ children, centered = true, variant = 'muted' }: SubtitleProps) {
  const colorClass = variant === 'default' ? 'text-foreground' : 'text-muted-foreground';
  
  return (
    <p className={`text-base md:text-lg ${colorClass} leading-relaxed max-w-2xl ${centered ? 'text-center' : ''}`}>
      {children}
    </p>
  );
}
