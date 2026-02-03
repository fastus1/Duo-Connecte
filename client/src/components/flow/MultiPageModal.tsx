import { useState, useEffect } from 'react';
import { X, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalPage {
  title: string;
  icon?: LucideIcon;
  content: React.ReactNode;
}

interface MultiPageModalProps {
  triggerText?: string;
  pages: ModalPage[];
  finalButtonText?: string;
  onComplete?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MultiPageModal({
  triggerText = "En savoir plus",
  pages,
  finalButtonText = "J'ai compris",
  onComplete,
  open,
  onOpenChange
}: MultiPageModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [pageDirection, setPageDirection] = useState<'left' | 'right' | null>(null);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? (onOpenChange || (() => {})) : setInternalOpen;

  const handleOpen = () => {
    setIsOpen(true);
    setCurrentPage(0);
    setIsClosing(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setCurrentPage(0);
      setIsClosing(false);
    }, 500);
  };

  // Reset animation state after page transition
  useEffect(() => {
    if (pageDirection) {
      const timer = setTimeout(() => {
        setPageDirection(null);
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pageDirection]);

  const handleNext = () => {
    if (currentPage < pages.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setPageDirection('right');
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0 && !isAnimating) {
      setIsAnimating(true);
      setPageDirection('left');
      setCurrentPage(currentPage - 1);
    }
  };

  const handleComplete = () => {
    handleClose();
    if (onComplete) {
      onComplete();
    }
  };

  const isLastPage = currentPage === pages.length - 1;
  const isFirstPage = currentPage === 0;
  const currentPageData = pages[currentPage];
  const PageIcon = currentPageData?.icon;

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={handleOpen}
        className="gap-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 text-primary font-medium shadow-sm"
        data-testid="button-open-theory"
      >
        <BookOpen className="w-5 h-5" />
        {triggerText}
      </Button>

      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 transition-all duration-500 ease-out",
            isClosing ? "bg-black/0" : "bg-black/60"
          )}
          onClick={handleClose}
          data-testid="modal-theory"
        >
          <div
            className={cn(
              "h-full w-full md:h-[85vh] md:max-h-[800px] md:w-[560px] md:rounded-2xl overflow-hidden shadow-2xl bg-card border border-border transition-all duration-500 ease-out",
              isClosing
                ? "opacity-0 scale-90 translate-y-4"
                : "opacity-100 scale-100 translate-y-0 animate-in fade-in-0 zoom-in-90 slide-in-from-bottom-4 duration-500"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-5 md:p-6 border-b border-border bg-primary/5">
                <div className="flex items-center gap-3">
                  {PageIcon && (
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <PageIcon className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                    {currentPageData?.title}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="h-10 w-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                  data-testid="button-close-theory"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Page indicators */}
              <div className="flex items-center justify-center gap-2 py-4 border-b border-border/50">
                {pages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentPage 
                        ? 'w-8 bg-primary' 
                        : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    data-testid={`button-page-indicator-${index}`}
                  />
                ))}
              </div>

              {/* Content - Large area with animations */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div
                  className={cn(
                    "text-foreground space-y-6",
                    pageDirection === 'right' && "animate-in slide-in-from-right-12 fade-in-0 duration-500 ease-out",
                    pageDirection === 'left' && "animate-in slide-in-from-left-12 fade-in-0 duration-500 ease-out"
                  )}
                  key={currentPage}
                >
                  {currentPageData?.content}
                </div>
              </div>

              {/* Footer with navigation - always shows both button slots */}
              <div className="p-5 md:p-6 border-t border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  {/* Previous button - always takes space, invisible on first page */}
                  <Button
                    onClick={handlePrev}
                    variant="outline"
                    className={cn(
                      "flex-1 transition-opacity duration-500 ease-out",
                      isFirstPage ? "opacity-0 pointer-events-none" : "opacity-100"
                    )}
                    size="lg"
                    data-testid="button-prev-page"
                    tabIndex={isFirstPage ? -1 : 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Précédent
                  </Button>

                  {/* Next/Complete button */}
                  <Button
                    onClick={isLastPage ? handleComplete : handleNext}
                    className="flex-1"
                    size="lg"
                    data-testid={isLastPage ? "button-complete-theory" : "button-next-page"}
                  >
                    {isLastPage ? (
                      finalButtonText
                    ) : (
                      <>
                        Suivant
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
