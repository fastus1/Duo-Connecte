import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { InsertFeedback } from '@shared/schema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface FeedbackData {
  rating: number;
  experienceRating: string | null;
  perceivedUtility: number | null;
  instructionsClarity: number | null;
  durationFeedback: string | null;
  helpfulAspect: string | null;
  improvementSuggestion: string | null;
}

export default function Feedback() {
  const { transitionToStep } = usePageTransition();
  const { toast } = useToast();
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Feedback data state
  const [feedbackData, setFeedbackData] = useState<Omit<FeedbackData, 'rating'>>({
    experienceRating: null,
    perceivedUtility: null,
    instructionsClarity: null,
    durationFeedback: null,
    helpfulAspect: null,
    improvementSuggestion: null,
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (feedback: InsertFeedback) => {
      return apiRequest('POST', '/api/feedback', feedback);
    },
    onSuccess: () => {
      toast({
        title: 'Merci!',
        description: 'Votre feedback a été enregistré avec succès.',
      });
      setShowModal(false);
      transitionToStep(24);
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi de votre feedback.',
        variant: 'destructive',
      });
    },
  });

  const handleOpenModal = () => {
    if (rating) {
      setShowModal(true);
      setCurrentPage(0);
    }
  };

  const handleSubmit = () => {
    if (rating) {
      submitFeedbackMutation.mutate({
        rating: Math.round(rating * 10), // Store as integer (0.5 -> 5, 5 -> 50)
        ...feedbackData,
      });
    }
  };

  const handleSkip = () => {
    transitionToStep(24);
  };

  const totalPages = 6;

  const updateFeedback = <K extends keyof Omit<FeedbackData, 'rating'>>(
    key: K,
    value: Omit<FeedbackData, 'rating'>[K]
  ) => {
    setFeedbackData(prev => ({ ...prev, [key]: value }));
  };

  // Scale component for 1-5 ratings
  const ScaleRating = ({
    value,
    onChange,
    labels,
  }: {
    value: number | null;
    onChange: (val: number) => void;
    labels: string[];
  }) => (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`flex-1 py-3 px-2 rounded-lg border-2 transition-all text-sm font-medium ${
              value === num
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card hover-elevate'
            }`}
            data-testid={`scale-${num}`}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{labels[0]}</span>
        <span>{labels[4]}</span>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <div className="space-y-6">
            <p className="text-base md:text-lg text-foreground">
              En un mot, comment décririez-vous votre expérience avec Duo-Connecte?
            </p>
            <Input
              type="text"
              placeholder='Par exemple: "Transformatrice", "Éclairante", "Utile"'
              value={feedbackData.experienceRating || ''}
              onChange={(e) => updateFeedback('experienceRating', e.target.value || null)}
              className="w-full"
              data-testid="input-experience"
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <p className="text-base md:text-lg text-foreground">
              L'application vous a-t-elle aidé à mieux communiquer en couple?
            </p>
            <ScaleRating
              value={feedbackData.perceivedUtility}
              onChange={(val) => updateFeedback('perceivedUtility', val)}
              labels={['Pas du tout', 'Un peu', 'Moyennement', 'Beaucoup', 'Énormément']}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <p className="text-base md:text-lg text-foreground">
              Les instructions et le parcours étaient-ils faciles à suivre?
            </p>
            <ScaleRating
              value={feedbackData.instructionsClarity}
              onChange={(val) => updateFeedback('instructionsClarity', val)}
              labels={['Très confus', 'Confus', 'Adéquat', 'Clair', 'Très clair']}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <p className="text-base md:text-lg text-foreground">
              La durée du parcours était-elle appropriée?
            </p>
            <RadioGroup
              value={feedbackData.durationFeedback || ''}
              onValueChange={(val) => updateFeedback('durationFeedback', val)}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="too_short" id="too_short" />
                <Label htmlFor="too_short" className="text-base">Trop courte</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="adequate" id="adequate" />
                <Label htmlFor="adequate" className="text-base">Adéquate</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="too_long" id="too_long" />
                <Label htmlFor="too_long" className="text-base">Trop longue</Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <p className="text-base md:text-lg text-foreground">
              Qu'est-ce qui vous a le plus marqué ou aidé?
            </p>
            <Textarea
              placeholder="Par exemple la structure étape par étape, le cadre sécurisant, les explications"
              value={feedbackData.helpfulAspect || ''}
              onChange={(e) => updateFeedback('helpfulAspect', e.target.value || null)}
              className="min-h-24"
              data-testid="input-helpful"
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <p className="text-base md:text-lg text-foreground">
              Un commentaire, une suggestion ou quelque chose à améliorer?
            </p>
            <Textarea
              placeholder="Bugs, idées, difficultés, suggestions... tout est bienvenu!"
              value={feedbackData.improvementSuggestion || ''}
              onChange={(e) => updateFeedback('improvementSuggestion', e.target.value || null)}
              className="min-h-24"
              data-testid="input-improvement"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    const titles = [
      "Votre expérience",
      "Impact sur votre couple",
      "Facilité du parcours",
      "Durée du parcours",
      "Ce qui vous a marqué",
      "Suggestions",
    ];
    return titles[currentPage];
  };

  return (
    <PageLayout>
      <div className="space-y-6 text-center">
        {/* Logo et texte Avancer Simplement */}
        <div className="space-y-1">
          <div className="inline-flex items-center justify-center w-[80px] h-[80px] md:w-[120px] md:h-[120px]">
            <img 
              src="/logo-blue.png" 
              alt="Avancer Simplement Logo" 
              className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] dark:hidden"
            />
            <img 
              src="/logo-white.png" 
              alt="Avancer Simplement Logo" 
              className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] hidden dark:block"
            />
          </div>
          <div className="text-lg md:text-2xl font-black italic text-primary text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            AVANCER SIMPLEMENT
          </div>
        </div>

        {/* Vous remercie d'avoir choisi */}
        <div className="text-sm md:text-lg text-muted-foreground tracking-wide italic text-center">
          Vous remercie d'avoir choisi
        </div>

        {/* Titre Duo-Connecte */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground pt-2 md:pt-6 tracking-tight text-center" style={{ fontFamily: 'Figtree, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          Duo-Connecte
        </h1>

        {/* Texte explicatif */}
        <p className="text-base text-foreground leading-relaxed text-center">
          Votre feedback nous aide à améliorer cet outil. Tout est anonyme. Merci de prendre un instant.
        </p>

        <div className="space-y-6">
          {/* Rating avec demi-étoiles */}
          <div className={`space-y-4 flex flex-col items-center p-6 rounded-xl transition-all ${!rating ? 'ring-2 ring-primary bg-primary/5' : 'bg-card border'}`}>
            <p className="text-base font-medium text-foreground">
              {!rating ? 'Cliquez sur les étoiles pour noter votre expérience' : `Votre note: ${rating}/5`}
            </p>
            <div 
              className="flex gap-2"
              onMouseLeave={() => setHoverRating(null)}
            >
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const fullStarValue = starIndex;
                const halfStarValue = starIndex - 0.5;
                const displayRating = hoverRating ?? rating ?? 0;
                
                return (
                  <div key={starIndex} className="relative w-12 h-12">
                    <Star className="w-12 h-12 text-muted-foreground stroke-muted-foreground" />
                    <div 
                      className="absolute inset-0 overflow-hidden transition-all duration-150"
                      style={{
                        clipPath: displayRating >= fullStarValue 
                          ? 'inset(0 0 0 0)' 
                          : displayRating >= halfStarValue 
                          ? 'inset(0 50% 0 0)' 
                          : 'inset(0 100% 0 0)'
                      }}
                    >
                      <Star className="w-12 h-12 fill-yellow-400 text-yellow-400" />
                    </div>
                    <button
                      onClick={() => setRating(halfStarValue)}
                      onMouseEnter={() => setHoverRating(halfStarValue)}
                      className="absolute left-0 top-0 w-6 h-12 cursor-pointer"
                      data-testid={`rating-${halfStarValue}`}
                      aria-label={`Note ${halfStarValue}`}
                    />
                    <button
                      onClick={() => setRating(fullStarValue)}
                      onMouseEnter={() => setHoverRating(fullStarValue)}
                      className="absolute right-0 top-0 w-6 h-12 cursor-pointer"
                      data-testid={`rating-${fullStarValue}`}
                      aria-label={`Note ${fullStarValue}`}
                    />
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>

        {/* Boutons toujours visibles */}
        <div className="flex flex-col gap-4 pt-4">
          <Button
            size="lg"
            onClick={handleOpenModal}
            disabled={!rating}
            className={`px-8 w-full ${rating ? 'animate-pulse hover:animate-none' : ''}`}
            data-testid="button-open-feedback"
          >
            {rating ? 'Continuer avec le feedback détaillé' : 'Sélectionnez une note pour continuer'}
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
            data-testid="button-skip"
          >
            Passer
          </Button>
        </div>
      </div>

      {/* Modal multipage */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                {getPageTitle()}
              </DialogTitle>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 hover-elevate"
                data-testid="button-close-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Page indicators */}
            <div className="flex justify-center gap-1.5 pt-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentPage
                      ? 'bg-primary w-4'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  data-testid={`page-indicator-${idx}`}
                />
              ))}
            </div>
          </DialogHeader>

          <div className="py-6">
            {renderPage()}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              data-testid="button-prev"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </Button>

            {currentPage === totalPages - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={submitFeedbackMutation.isPending}
                data-testid="button-submit-feedback"
              >
                {submitFeedbackMutation.isPending ? 'Envoi...' : 'Envoyer le feedback'}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                data-testid="button-next"
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
