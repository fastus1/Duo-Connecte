import { useState, useRef } from 'react';
import { X, HelpCircle, Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExplanationModalProps {
  triggerText?: string;
  title: string;
  children: React.ReactNode;
  audioSrc?: string;
}

export function ExplanationModal({ 
  triggerText = "En savoir plus",
  title,
  children,
  audioSrc
}: ExplanationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = () => setIsOpen(true);
  
  const handleClose = () => {
    setIsOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className="text-primary hover:text-primary/80 gap-2"
        data-testid="button-open-explanation"
      >
        <HelpCircle className="w-4 h-4" />
        {triggerText}
      </Button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 md:p-8"
          onClick={handleClose}
          data-testid="modal-explanation"
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
                  {title}
                </h2>
                <button
                  onClick={handleClose}
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  data-testid="button-close-explanation"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {audioSrc && (
                  <div className="mb-8 p-4 rounded-lg bg-white/10 border border-white/20">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={toggleAudio}
                        className="h-12 w-12 rounded-full bg-white text-[#074491] flex items-center justify-center hover:bg-white/90 transition-colors"
                        data-testid="button-toggle-audio"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5 ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white flex items-center gap-2">
                          <Volume2 className="h-4 w-4" />
                          Écouter l'explication
                        </p>
                        <p className="text-xs text-white/70">
                          {isPlaying ? "En cours de lecture..." : "Cliquez pour écouter"}
                        </p>
                      </div>
                    </div>
                    <audio 
                      ref={audioRef} 
                      src={audioSrc}
                      onEnded={handleAudioEnded}
                      className="hidden"
                    />
                  </div>
                )}

                <div className="text-white [&_*]:text-white [&_.text-muted-foreground]:text-white/70 [&_.text-primary]:text-white [&_.bg-primary\\/10]:bg-white/10 [&_.border-primary\\/20]:border-white/20">
                  {children}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 md:p-6 border-t border-white/20">
                <Button
                  onClick={handleClose}
                  className="w-full bg-white text-[#074491] hover:bg-white/90 font-semibold"
                  size="lg"
                  data-testid="button-close-explanation-bottom"
                >
                  J'ai compris
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
