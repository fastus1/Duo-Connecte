import { LucideIcon } from 'lucide-react';

interface HeroIconProps {
  icon: LucideIcon;
  variant?: 'primary' | 'destructive' | 'success';
}

const variantStyles = {
  primary: 'bg-primary/10 text-primary',
  destructive: 'bg-destructive/10 text-destructive',
  success: 'bg-green-500/10 text-green-500',
};

export function HeroIcon({ icon: Icon, variant = 'primary' }: HeroIconProps) {
  return (
    <div className={`flex items-center justify-center w-16 h-16 rounded-full ${variantStyles[variant]}`}>
      <Icon className="w-8 h-8" />
    </div>
  );
}
