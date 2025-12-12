import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

interface ChoiceCard {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  onClick?: () => void;
}

interface ChoiceCardsProps {
  cards: ChoiceCard[];
}

export function ChoiceCards({ cards }: ChoiceCardsProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const gridCols = cards.length === 1 
    ? 'grid-cols-1 max-w-md mx-auto' 
    : cards.length === 2 
    ? 'grid-cols-1 md:grid-cols-2' 
    : cards.length === 3
    ? 'grid-cols-1 md:grid-cols-3'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${gridCols} gap-4 md:gap-6 w-full`}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`
              flex flex-col items-center text-center p-6 md:p-8 rounded-xl
              border-2 transition-all
              ${isDark 
                ? 'bg-slate-800/50 border-slate-700 hover:border-primary/50' 
                : 'bg-slate-50 border-slate-200 hover:border-primary/50'
              }
            `}
            data-testid={`choice-card-${index}`}
          >
            <div className={`
              w-14 h-14 rounded-full flex items-center justify-center mb-5
              ${isDark ? 'bg-primary/20' : 'bg-primary/10'}
            `}>
              <Icon className="w-7 h-7 text-primary" />
            </div>

            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
              {card.title}
            </h3>

            {card.subtitle && (
              <p className="text-sm font-medium text-foreground/80 mb-2">
                {card.subtitle}
              </p>
            )}

            {card.description && (
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {card.description}
              </p>
            )}

            <Button
              onClick={card.onClick}
              className="mt-auto w-full max-w-[200px]"
              data-testid={`choice-card-button-${index}`}
            >
              {card.buttonText}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
