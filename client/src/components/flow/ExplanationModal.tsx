import { useState, useRef } from 'react';
import { X, HelpCircle, Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
          data-testid="modal-explanation"
        >
          <div className="h-full w-full overflow-y-auto">
            <div className="min-h-full flex flex-col">
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-6 border-b bg-background/80 backdrop-blur-sm">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                  {title}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-10 w-10 rounded-full"
                  data-testid="button-close-explanation"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full">
                {audioSrc && (
                  <div className="mb-8 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="default"
                        size="icon"
                        onClick={toggleAudio}
                        className="h-12 w-12 rounded-full"
                        data-testid="button-toggle-audio"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5 ml-0.5" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Volume2 className="h-4 w-4" />
                          Écouter l'explication
                        </p>
                        <p className="text-xs text-muted-foreground">
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

                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {children}
                </div>
              </div>

              <div className="sticky bottom-0 p-4 border-t bg-background/80 backdrop-blur-sm">
                <div className="max-w-3xl mx-auto">
                  <Button
                    onClick={handleClose}
                    className="w-full"
                    size="lg"
                    data-testid="button-close-explanation-bottom"
                  >
                    J'ai compris
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
