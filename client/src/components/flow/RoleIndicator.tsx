import { LucideIcon, VolumeX, Volume2 } from 'lucide-react';

interface RoleIndicatorProps {
  name: string;
  role: 'speaking' | 'listening';
  customIcon?: LucideIcon;
}

export function RoleIndicator({ name, role, customIcon }: RoleIndicatorProps) {
  const Icon = customIcon || (role === 'speaking' ? Volume2 : VolumeX);
  const roleText = role === 'speaking' ? 'prend la parole' : 'écoute attentive';
  const colorClass = role === 'speaking' ? 'text-primary' : 'text-destructive';
  
  return (
    <div className="flex items-center gap-2">
      <Icon className={`w-5 h-5 ${colorClass}`} />
      <p className="text-base md:text-lg text-muted-foreground">
        {name} : {roleText}
      </p>
    </div>
  );
}
