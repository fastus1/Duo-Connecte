import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      transitionToStep(2);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
          <Users className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold font-serif text-foreground">
          Qui est qui?
        </h1>

        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Identifiez vos rôles pour cette conversation. Ces noms seront utilisés tout au long du processus pour personnaliser l'expérience.
        </p>

        <div className="rounded-lg border border-border bg-muted/30 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xs font-semibold text-primary-foreground">1</span>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">L'émetteur</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                La personne qui souhaite parler d'une situation et partager son vécu
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xs font-semibold text-accent-foreground">2</span>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Le récepteur</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                La personne qui écoute avec attention et bienveillance
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sender-name" className="text-base">
              Nom de l'émetteur
            </Label>
            <Input
              id="sender-name"
              type="text"
              placeholder="Prénom ou surnom"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="text-base"
              data-testid="input-sender-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiver-name" className="text-base">
              Nom du récepteur
            </Label>
            <Input
              id="receiver-name"
              type="text"
              placeholder="Prénom ou surnom"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="text-base"
              data-testid="input-receiver-name"
            />
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setLocation('/welcome')}
              disabled={isTransitioning}
              className="w-full md:w-auto px-8"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!senderName.trim() || !receiverName.trim() || isTransitioning}
              className="w-full md:w-auto px-8 min-w-48"
              data-testid="button-next"
            >
              Suivant
            </Button>
          </div>
          {isTransitioning && (
            <Progress value={progress} className="w-full md:w-48" />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
