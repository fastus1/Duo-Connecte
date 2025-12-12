import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';

interface CtaButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  progress?: number;
  icon?: LucideIcon;
  variant?: 'primary' | 'destructive' | 'outline';
}

const buttonVariants = {
  primary: '',
  destructive: 'text-destructive border-destructive hover:bg-destructive/10',
  outline: '',
};

export function CtaButton({ 
  children, 
  onClick, 
  disabled = false, 
  isLoading = false,
  progress = 0,
  icon: Icon,
  variant = 'primary'
}: CtaButtonProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-center">
        <Button
          size="lg"
          variant={variant === 'destructive' ? 'outline' : variant === 'outline' ? 'outline' : 'default'}
          onClick={onClick}
          disabled={disabled || isLoading}
          className={`min-w-48 ${variant === 'destructive' ? buttonVariants.destructive : ''}`}
        >
          {Icon && <Icon className="w-5 h-5 mr-2" />}
          {children}
        </Button>
      </div>
      
      {isLoading && (
        <div className="flex justify-center">
          <Progress value={progress} className="w-full md:w-48" />
        </div>
      )}
    </div>
  );
}
