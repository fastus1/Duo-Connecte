import { useState, useEffect } from 'react';
import { Star, Share, MoreVertical, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'duo-connecte-bookmark-suggested';

function isMac(): boolean {
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isAndroid(): boolean {
  return /Android/.test(navigator.userAgent);
}

function PlatformStep() {
  if (isIOS()) {
    return (
      <>
        <span className="font-medium text-foreground">1.</span> Appuyez sur{' '}
        <Share className="inline w-4 h-4 mx-0.5 align-text-bottom text-primary" />{' '}
        puis <span className="font-medium text-foreground">"Ajouter aux favoris"</span>
      </>
    );
  }

  if (isAndroid()) {
    return (
      <>
        <span className="font-medium text-foreground">1.</span> Appuyez sur{' '}
        <MoreVertical className="inline w-4 h-4 mx-0.5 align-text-bottom text-primary" />{' '}
        puis <span className="font-medium text-foreground">"Ajouter aux favoris"</span>
      </>
    );
  }

  const key = isMac() ? 'Cmd' : 'Ctrl';

  return (
    <>
      Appuyez sur{' '}
      <span className="inline-flex items-center gap-1">
        <kbd className="min-w-[28px] text-center rounded-md border border-border/80 bg-muted/60 px-1.5 py-0.5 text-[11px] font-mono font-semibold text-foreground shadow-[0_1px_0_1px] shadow-border/40">
          {key}
        </kbd>
        <span className="text-muted-foreground/60">+</span>
        <kbd className="min-w-[20px] text-center rounded-md border border-border/80 bg-muted/60 px-1.5 py-0.5 text-[11px] font-mono font-semibold text-foreground shadow-[0_1px_0_1px] shadow-border/40">
          D
        </kbd>
      </span>
    </>
  );
}

export function BookmarkDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-[360px] rounded-2xl border-0 p-0 gap-0 overflow-hidden shadow-2xl">
        {/* Visual top section */}
        <div className="relative bg-gradient-to-b from-primary/[0.06] to-transparent dark:from-primary/[0.12] pt-8 pb-2 px-6">
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' }}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center ring-1 ring-primary/10">
                  <BookmarkPlus className="w-8 h-8 text-primary" />
                </div>
                {/* Floating star accent */}
                <motion.div
                  className="absolute -top-1.5 -right-1.5"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.3, type: 'spring', stiffness: 300 }}
                >
                  <div className="w-6 h-6 rounded-full bg-amber-400/90 dark:bg-amber-400 flex items-center justify-center shadow-sm">
                    <Star className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-3 pb-2 text-center space-y-2">
          <DialogTitle className="text-lg font-bold tracking-tight">
            Retrouvez-nous facilement
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-relaxed text-muted-foreground">
            Sauvegardez cette page dans vos favoris pour y revenir en un instant.
          </DialogDescription>
        </div>

        {/* Instruction pill */}
        <div className="px-6 py-3">
          <div className="flex items-center justify-center gap-2 text-[13px] text-muted-foreground bg-muted/40 dark:bg-muted/20 rounded-xl py-3 px-4 border border-border/40">
            <PlatformStep />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pt-1 pb-5 space-y-2.5">
          <Button
            onClick={handleClose}
            className="w-full h-11 rounded-xl font-semibold text-sm shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 transition-shadow duration-200 cursor-pointer"
            data-testid="button-bookmark-dismiss"
          >
            Compris, merci !
          </Button>
          <button
            onClick={handleClose}
            className="w-full text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200 py-1 cursor-pointer"
          >
            Plus tard
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
