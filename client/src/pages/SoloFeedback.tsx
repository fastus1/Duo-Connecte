import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PageLayout } from '@/components/PageLayout';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Star, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { InsertFeedback } from '@shared/schema';

export default function Feedback() {
  const { transitionToStep } = usePageTransition();
  const { toast } = useToast();
  const [rating, setRating] = useState<number | null>(null);
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
      transitionToStep(26);
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
    transitionToStep(26);
  };

  return (
    <PageLayout>
      <div className="space-y-6 md:space-y-8">
        <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
          Comment s'est passée votre expérience?
        </h1>

        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Votre feedback anonyme nous aide à améliorer cet outil. Il est totalement optionnel.
        </p>

        <div className="space-y-5 md:space-y-6">
          {/* Rating */}
          <div className="space-y-3">
            <label className="text-base font-medium text-foreground">
              Comment évalueriez-vous cette expérience?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className="group"
                  data-testid={`rating-${value}`}
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      rating && value <= rating
                        ? 'fill-primary text-primary'
                        : 'text-muted stroke-muted-foreground group-hover:text-primary'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Helpful aspect */}
          <div className="space-y-2">
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

          {/* Improvement suggestion */}
          <div className="space-y-2">
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
