import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Star } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { InsertFeedback } from '@shared/schema';

export default function Feedback() {
  const { transitionToStep } = usePageTransition();
  const { toast } = useToast();
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [helpfulAspect, setHelpfulAspect] = useState('');
  const [improvementSuggestion, setImprovementSuggestion] = useState('');

  const submitFeedbackMutation = useMutation({
    mutationFn: async (feedback: InsertFeedback) => {
      return apiRequest('POST', '/api/feedback', feedback);
    },
    onSuccess: () => {
      toast({
        title: 'Merci!',
        description: 'Votre feedback a été enregistré avec succès.',
      });
      transitionToStep(23);
    },
    onError: () => {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi de votre feedback.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = () => {
    if (rating) {
      submitFeedbackMutation.mutate({
        rating,
        helpfulAspect: helpfulAspect.trim() || null,
        improvementSuggestion: improvementSuggestion.trim() || null,
      });
    }
  };

  const handleSkip = () => {
    transitionToStep(23);
  };

  return (
    <PageLayout>
      <div className="space-y-6 text-center">
        {/* Logo et texte Avancer Simplement - même design que page 0 */}
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

        {/* Titre Duo-Connecte - même style que page 0 */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground pt-2 md:pt-6 tracking-tight text-center" style={{ fontFamily: 'Figtree, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          Duo-Connecte
        </h1>

        {/* Texte explicatif */}
        <p className="text-base text-foreground leading-relaxed text-center">
          Nous avons besoin de votre feedback pour nous aider à améliorer cet outil. Tout est anonyme. Merci
        </p>

        <div className="space-y-6">
          {/* Rating avec demi-étoiles - CENTRÉ */}
          <div className="space-y-3 flex flex-col items-center">
            <div 
              className="flex gap-2"
              onMouseLeave={() => setHoverRating(null)}
            >
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const fullStarValue = starIndex;
                const halfStarValue = starIndex - 0.5;
                const displayRating = hoverRating ?? rating ?? 0;
                
                return (
                  <div key={starIndex} className="relative w-10 h-10">
                    {/* Étoile de fond (grise) */}
                    <Star className="w-10 h-10 text-muted-foreground stroke-muted-foreground" />
                    
                    {/* Étoile jaune avec clip-path pour l'effet demi-étoile */}
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
                      <Star className="w-10 h-10 fill-yellow-400 text-yellow-400" />
                    </div>
                    
                    {/* Zone cliquable gauche (demi-étoile) */}
                    <button
                      onClick={() => setRating(halfStarValue)}
                      onMouseEnter={() => setHoverRating(halfStarValue)}
                      className="absolute left-0 top-0 w-5 h-10 cursor-pointer"
                      data-testid={`rating-${halfStarValue}`}
                      aria-label={`Note ${halfStarValue}`}
                    />
                    
                    {/* Zone cliquable droite (étoile complète) */}
                    <button
                      onClick={() => setRating(fullStarValue)}
                      onMouseEnter={() => setHoverRating(fullStarValue)}
                      className="absolute right-0 top-0 w-5 h-10 cursor-pointer"
                      data-testid={`rating-${fullStarValue}`}
                      aria-label={`Note ${fullStarValue}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Espace supplémentaire après les étoiles */}
          <div className="pt-4"></div>

          {/* Helpful aspect - ALIGNÉ À GAUCHE */}
          <div className="space-y-2 text-left">
            <label htmlFor="helpful" className="text-base font-medium text-foreground">
              Qu'est-ce qui a été le plus utile? (optionnel)
            </label>
            <Textarea
              id="helpful"
              placeholder="Par exemple: la structure étape par étape, les explications détaillées, le temps de pause..."
              value={helpfulAspect}
              onChange={(e) => setHelpfulAspect(e.target.value)}
              className="min-h-24"
              data-testid="input-helpful"
            />
          </div>

          {/* Improvement suggestion - ALIGNÉ À GAUCHE */}
          <div className="space-y-2 text-left">
            <label htmlFor="improvement" className="text-base font-medium text-foreground">
              Qu'est-ce qui pourrait être amélioré? (optionnel)
            </label>
            <Textarea
              id="improvement"
              placeholder="Vos suggestions pour rendre cet outil encore plus efficace..."
              value={improvementSuggestion}
              onChange={(e) => setImprovementSuggestion(e.target.value)}
              className="min-h-24"
              data-testid="input-improvement"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            size="lg"
            variant="outline"
            onClick={handleSkip}
            data-testid="button-skip"
          >
            Passer
          </Button>

          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!rating || submitFeedbackMutation.isPending}
            className="px-8"
            data-testid="button-submit-feedback"
          >
            {submitFeedbackMutation.isPending ? 'Envoi...' : 'Envoyer le feedback'}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
