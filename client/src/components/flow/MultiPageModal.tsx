import { useState } from 'react';
import { X, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModalPage {
  title: string;
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

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className="text-primary hover:text-primary/80 gap-2"
        data-testid="button-open-theory"
      >
        <BookOpen className="w-4 h-4" />
        {triggerText}
      </Button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 md:p-8"
          onClick={handleClose}
          data-testid="modal-theory"
        >
          <div 
            className="h-full w-full md:h-[85vh] md:w-[420px] md:rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: '#074491' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/20">
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  {currentPageData?.title}
                </h2>
                <button
                  onClick={handleClose}
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  data-testid="button-close-theory"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* Page indicators */}
              <div className="flex items-center justify-center gap-2 py-3 border-b border-white/10">
                {pages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentPage 
                        ? 'w-6 bg-white' 
                        : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                    data-testid={`button-page-indicator-${index}`}
                  />
                ))}
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="text-white [&_*]:text-white [&_.text-muted-foreground]:text-white/70 [&_.text-primary]:text-white [&_.bg-primary\\/10]:bg-white/10 [&_.border-primary\\/20]:border-white/20">
                  {currentPageData?.content}
                </div>
              </div>

              {/* Footer with navigation */}
              <div className="p-4 md:p-6 border-t border-white/20">
                <div className="flex items-center gap-3">
                  {!isFirstPage && (
                    <Button
                      onClick={handlePrev}
                      variant="outline"
                      className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10"
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
                      className="flex-1 bg-white text-[#074491] hover:bg-white/90 font-semibold"
                      size="lg"
                      data-testid="button-complete-theory"
                    >
                      {finalButtonText}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-white text-[#074491] hover:bg-white/90 font-semibold"
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
