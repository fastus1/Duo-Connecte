import { useState } from 'react';
import { X, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

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
}

export function MultiPageModal({ 
  triggerText = "En savoir plus",
  pages,
  finalButtonText = "J'ai compris",
  onComplete
}: MultiPageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const handleOpen = () => {
    setIsOpen(true);
    setCurrentPage(0);
  };
  
  const handleClose = () => {
    setIsOpen(false);
    setCurrentPage(0);
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
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
        variant="ghost"
        size="default"
        onClick={handleOpen}
        className="text-primary hover:text-primary/80 gap-2"
        data-testid="button-open-theory"
      >
        <BookOpen className="w-5 h-5" />
        {triggerText}
      </Button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:p-8"
          onClick={handleClose}
          data-testid="modal-theory"
        >
          <div 
            className="h-full w-full md:h-auto md:max-h-[90vh] md:w-[480px] md:rounded-2xl overflow-hidden shadow-2xl bg-card border border-border"
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

              {/* Content - Scrollable with more padding */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="text-foreground space-y-6">
                  {currentPageData?.content}
                </div>
              </div>

              {/* Footer with navigation */}
              <div className="p-5 md:p-6 border-t border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  {!isFirstPage && (
                    <Button
                      onClick={handlePrev}
                      variant="outline"
                      className="flex-1"
                      size="lg"
                      data-testid="button-prev-page"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Précédent
                    </Button>
                  )}
                  
                  {isLastPage ? (
                    <Button
                      onClick={handleComplete}
                      className="flex-1"
                      size="lg"
                      data-testid="button-complete-theory"
                    >
                      {finalButtonText}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="flex-1"
                      size="lg"
                      data-testid="button-next-page"
                    >
                      Suivant
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
