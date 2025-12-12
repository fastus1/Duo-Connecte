interface SubtitleProps {
  children: React.ReactNode;
  centered?: boolean;
}

export function Subtitle({ children, centered = true }: SubtitleProps) {
  return (
    <p className={`text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl ${centered ? 'text-center' : ''}`}>
      {children}
    </p>
  );
}
