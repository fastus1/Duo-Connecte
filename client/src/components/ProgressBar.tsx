interface ProgressBarProps {
  section: number;
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ section, currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  if (section === 0) return null;

  return (
    <div className="w-full bg-card border-b border-card-border py-4 px-4 md:px-6" data-testid="progress-bar">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
        <div className="w-full h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 ease-out rounded-full bg-primary"
            style={{ width: `${progress}%` }}
            data-testid="progress-bar-fill"
          />
        </div>
      </div>
    </div>
  );
}
