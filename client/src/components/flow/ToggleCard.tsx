import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface ToggleCardProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function ToggleCard({ 
  label, 
  description, 
  checked, 
  onChange,
  className 
}: ToggleCardProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between gap-4 p-4 rounded-lg border bg-card transition-colors",
        checked && "border-primary/50 bg-primary/5",
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">
          {label}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {description}
          </p>
        )}
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onChange}
        data-testid={`toggle-${label.toLowerCase().replace(/\s+/g, '-')}`}
      />
    </div>
  );
}
