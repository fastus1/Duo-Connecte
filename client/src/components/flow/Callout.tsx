interface CalloutProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'destructive' | 'neutral';
}

const variantStyles = {
  primary: 'border-primary/20 bg-primary/5',
  destructive: 'border-destructive/20 bg-destructive/5',
  neutral: 'border-border bg-card',
};

export function Callout({ title, children, variant = 'primary' }: CalloutProps) {
  return (
    <div className={`rounded-lg border p-4 ${variantStyles[variant]}`}>
      {title && (
        <p className="font-semibold text-foreground mb-1">{title}</p>
      )}
      <div className="text-sm text-foreground">
        {children}
      </div>
    </div>
  );
}
