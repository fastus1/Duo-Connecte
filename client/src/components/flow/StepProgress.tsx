import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  variant?: 'dots' | 'bars' | 'numbers';
  className?: string;
}

export function StepProgress({ 
  currentStep, 
  totalSteps, 
  labels,
  variant = 'dots',
  className 
}: StepProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  if (variant === 'bars') {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex gap-1">
          {steps.map((step) => (
            <div
              key={step}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                step <= currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Étape {currentStep} sur {totalSteps}
        </p>
      </div>
    );
  }

  if (variant === 'numbers') {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step < currentStep && "bg-primary text-primary-foreground",
                step === currentStep && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                step > currentStep && "bg-muted text-muted-foreground"
              )}
            >
              {step < currentStep ? <Check className="w-4 h-4" /> : step}
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-8 h-0.5 mx-1",
                step < currentStep ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {steps.map((step) => (
        <div
          key={step}
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-colors",
            step <= currentStep ? "bg-primary" : "bg-muted"
          )}
        />
      ))}
    </div>
  );
}
