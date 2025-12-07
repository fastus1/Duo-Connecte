import { sectionNames, getFlow } from '@shared/schema';
import { useSession } from '@/contexts/SessionContext';

interface ProgressBarProps {
  section: number;
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ section, currentStep, totalSteps }: ProgressBarProps) {
  const { session } = useSession();
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const flow = getFlow(session.appType);

  if (section === 0) return null;

  return (
    <div className="w-full bg-card border-b border-card-border py-4 px-4 md:px-6" data-testid="progress-bar">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Section {section}/7
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {sectionNames[section]}
          </span>
        </div>
        <div className="w-full h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{ 
              width: `${progress}%`,
              backgroundColor: flow.progressColor
            }}
            data-testid="progress-bar-fill"
          />
        </div>
      </div>
    </div>
  );
}
