import { Button } from '@/components/ui/button';
import { useSession } from '@/contexts/SessionContext';
import { CheckCircle2, RotateCcw, ExternalLink } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

export default function Completion() {
  const { resetSession } = useSession();

  const handleRestart = () => {
    if (window.confirm('Êtes-vous sûr de vouloir recommencer une nouvelle session? Toutes les données actuelles seront effacées.')) {
      resetSession();
    }
  };

  return (
    <PageLayout showNav={false}>
      <div className="text-center space-y-8 py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold font-serif text-foreground">
          Conversation terminée
        </h1>

        <div className="space-y-6 max-w-xl mx-auto">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Merci d'avoir utilisé Communication en Navette pour faciliter votre conversation.
          </p>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-left space-y-3">
            <p className="text-base text-foreground leading-relaxed">
              Rappelez-vous :
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• La communication authentique demande de la pratique</li>
              <li>• Chaque conversation est une opportunité d'apprendre</li>
              <li>• La connexion est plus importante que la perfection</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            size="lg"
            onClick={handleRestart}
            className="gap-2"
            data-testid="button-restart"
          >
            <RotateCcw className="w-5 h-5" />
            Recommencer une nouvelle session
          </Button>

          <Button
            size="lg"
            variant="outline"
            asChild
            className="gap-2"
          >
            <a href="#" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Ressources supplémentaires
            </a>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground pt-8">
          Pour approfondir vos compétences en communication, explorez nos formations et ressources
        </p>
      </div>
    </PageLayout>
  );
}
