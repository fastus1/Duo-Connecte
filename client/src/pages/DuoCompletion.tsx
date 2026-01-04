import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/contexts/SessionContext';
import { CheckCircle2, RotateCcw, ExternalLink, User, Users, Smile } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

export default function Completion() {
  const { resetSession } = useSession();
  const [hasChosenOption, setHasChosenOption] = useState(false);

  const handleRestart = () => {
    if (window.confirm('Êtes-vous sûr de vouloir recommencer une nouvelle session? Toutes les données actuelles seront effacées.')) {
      resetSession();
    }
  };

  const handleNoThanks = () => {
    setHasChosenOption(true);
  };

  const handleTherapyClick = () => {
    setHasChosenOption(true);
  };

  return (
    <PageLayout showNav={false}>
      <div className="flex flex-col items-center space-y-6 md:space-y-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-sans text-foreground text-center">
          Conversation terminée
        </h1>

        <div className="w-full max-w-2xl space-y-6 md:space-y-8">
          <p className="text-base md:text-lg text-foreground leading-relaxed">
            Vous avez terminé ce processus de communication guidée. C'est un bel accomplissement!
          </p>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Prendre le temps d'avoir ce type de conversation demande du courage et de la vulnérabilité. Prenez un moment pour vous remercier mutuellement pour votre présence et votre écoute.
          </p>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-left space-y-2">
            <p className="text-sm font-medium text-foreground">
              Rappelez-vous :
            </p>
            <ul className="space-y-1 text-xs md:text-sm text-muted-foreground">
              <li>• La communication authentique demande de la pratique</li>
              <li>• Chaque conversation est une opportunité d'apprendre</li>
              <li>• La connexion est plus importante que la perfection</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground text-center">
              Un suivi est-il nécessaire?
            </h2>

            <div className="grid md:grid-cols-3 gap-3 md:gap-4">
              {/* Option 1 - Thérapie individuelle */}
              <div className="flex flex-col items-center p-4 md:p-5 rounded-lg border-2 border-border hover-elevate active-elevate-2 transition-all">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 md:mb-3">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-foreground mb-2 text-center" style={{ fontFamily: 'Figtree, sans-serif' }}>
                  Besoin d'une thérapie individuelle
                </h3>
                <p className="text-xs md:text-sm text-foreground mb-3 text-center">
                  Yannick Delorme, Thérapeute
                </p>
                <Button
                  size="sm"
                  asChild
                  onClick={handleTherapyClick}
                  className="text-xs md:text-sm px-4 w-full mt-auto"
                  data-testid="button-therapy-individual"
                >
                  <a href="https://www.gorendezvous.com/en/yannickdelormetherapeute" target="_blank" rel="noopener noreferrer">
                    Prendre rendez-vous
                  </a>
                </Button>
              </div>

              {/* Option 2 - Thérapie de couple */}
              <div className="flex flex-col items-center p-4 md:p-5 rounded-lg border-2 border-border hover-elevate active-elevate-2 transition-all">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 md:mb-3">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-foreground mb-2 text-center" style={{ fontFamily: 'Figtree, sans-serif' }}>
                  Besoin d'une thérapie de couple
                </h3>
                <p className="text-xs md:text-sm text-foreground mb-3 text-center">
                  Diane Lapensée, TRA
                </p>
                <Button
                  size="sm"
                  asChild
                  onClick={handleTherapyClick}
                  className="text-xs md:text-sm px-4 w-full mt-auto"
                  data-testid="button-therapy-couple"
                >
                  <a href="https://www.gorendezvous.com/fr/Diane_Lapensee_TRA" target="_blank" rel="noopener noreferrer">
                    Prendre rendez-vous
                  </a>
                </Button>
              </div>

              {/* Option 3 - Non merci */}
              <div className="flex flex-col items-center p-4 md:p-5 rounded-lg border-2 border-border hover-elevate active-elevate-2 transition-all">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 md:mb-3">
                  <Smile className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-foreground mb-2 text-center leading-snug" style={{ fontFamily: 'Figtree, sans-serif' }}>
                  Non merci, je n'ai pas besoin d'un suivi en thérapie pour l'instant 🙂
                </h3>
                <Button
                  size="sm"
                  onClick={handleNoThanks}
                  className="text-xs md:text-sm px-4 w-full mt-auto"
                  data-testid="button-no-thanks"
                >
                  Non merci
                </Button>
              </div>
            </div>
          </div>

          {/* Boutons finaux - toujours visibles mais désactivés jusqu'à ce qu'une option soit choisie */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              size="lg"
              onClick={handleRestart}
              disabled={!hasChosenOption}
              className="gap-2"
              data-testid="button-restart"
            >
              <RotateCcw className="w-5 h-5" />
              Retour à la page d'accueil
            </Button>

            <Button
              size="lg"
              variant="outline"
              disabled={!hasChosenOption}
              onClick={() => window.open('https://communaute.avancersimplement.com/feed', '_blank')}
              className="gap-2"
              data-testid="button-resources"
            >
              <ExternalLink className="w-4 h-4" />
              Ressources supplémentaires
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
