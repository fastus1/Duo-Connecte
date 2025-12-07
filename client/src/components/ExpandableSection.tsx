import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExpandableSectionProps {
  children: React.ReactNode;
}

export function ExpandableSection({ children }: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animationDuration = prefersReducedMotion ? 0 : 0.5;

  return (
    <div className="space-y-3 md:space-y-4">
      {!isExpanded && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="gap-2 text-primary text-sm"
          data-testid="button-expand"
        >
          <ChevronDown className="w-4 h-4" />
          Voir l'explication complète
        </Button>
      )}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: animationDuration, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 md:space-y-4">
              <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
                {children}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="gap-2 text-muted-foreground text-sm"
                data-testid="button-collapse"
              >
                <ChevronUp className="w-4 h-4" />
                Réduire
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
