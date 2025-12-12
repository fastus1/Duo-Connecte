interface WarningCardProps {
  children: React.ReactNode;
}

export function WarningCard({ children }: WarningCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-card-border">
      <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-sm font-semibold text-destructive">!</span>
      </div>
      <p className="text-base md:text-lg leading-relaxed text-foreground">
        {children}
      </p>
    </div>
  );
}
