import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageLayout } from '@/components/PageLayout';
import { useSession } from '@/contexts/SessionContext';
import { usePageTransition } from '@/hooks/usePageTransition';
import { useLocation } from 'wouter';
import { Users, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function Roles() {
  const { session, updateSession } = useSession();
  const { isTransitioning, transitionToStep, progress } = usePageTransition();
  const [, setLocation] = useLocation();
  const [senderName, setSenderName] = useState(session.senderName || '');
  const [receiverName, setReceiverName] = useState(session.receiverName || '');

  const handleContinue = () => {
    if (senderName.trim() && receiverName.trim()) {
      updateSession({ senderName: senderName.trim(), receiverName: receiverName.trim() });
      transitionToStep(1);
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center space-y-10 md:space-y-12">
        <div className="w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/welcome')}
            data-testid="button-back-welcome"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>

        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Users className="w-8 h-8 text-primary" />
        </div>

        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-foreground">
            Qui est qui?
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Identifiez vos rôles pour cette conversation. Ces noms seront utilisés tout au long du processus pour personnaliser l'expérience.
          </p>
        </div>

        <div className="w-full max-w-lg space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary-foreground">1</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground">
                L'émetteur
              </h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              La personne qui a besoin de s'exprimer
            </p>
            <Input
              type="text"
              placeholder="Prénom ou surnom"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="text-base"
              data-testid="input-sender-name"
              aria-label="Nom de l'émetteur"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary-foreground">2</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground">
                Le récepteur
              </h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              La personne qui écoute avec attention et bienveillance
            </p>
            <Input
              type="text"
              placeholder="Prénom ou surnom"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="text-base"
              data-testid="input-receiver-name"
              aria-label="Nom du récepteur"
            />
          </div>

          <div className="flex flex-col items-center pt-4 space-y-4">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!senderName.trim() || !receiverName.trim() || isTransitioning}
              className="w-full md:w-auto px-12"
              data-testid="button-next"
            >
              Continuer
            </Button>
            {isTransitioning && (
              <Progress value={progress} className="w-full md:w-64" aria-label="Chargement en cours" />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
