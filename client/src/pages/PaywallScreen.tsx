import { Button } from '@/components/ui/button';
import { Lock, ShoppingCart, Info } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface PaywallScreenProps {
  paywallUrl?: string;
  infoUrl?: string;
}

export default function PaywallScreen({
  paywallUrl = 'https://communaute.avancersimplement.com/checkout/communication-navette',
  infoUrl = 'https://communaute.avancersimplement.com/untitled-page-6476'
}: PaywallScreenProps) {
  const { theme, setTheme } = useTheme();

  const handleBuyClick = () => {
    if (paywallUrl && paywallUrl !== '#') {
      window.open(paywallUrl, '_blank');
    }
  };

  const handleInfoClick = () => {
    if (infoUrl && infoUrl !== '#') {
      window.open(infoUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-center flex-1 p-4">
        <div className="max-w-lg mx-auto text-center space-y-6 md:space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-[80px] h-[80px] md:w-[100px] md:h-[100px]">
              <img
                src="/logo-blue.png"
                alt="Avancer Simplement Logo"
                className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] dark:hidden"
              />
              <img
                src="/logo-white.png"
                alt="Avancer Simplement Logo"
                className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] hidden dark:block"
              />
            </div>
            <div className="text-base md:text-xl font-black italic text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              AVANCER SIMPLEMENT
            </div>
          </div>

          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Accès Réservé
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto px-4">
              Cette application est réservée aux membres ayant souscrit à l'offre.
              Obtenez votre accès pour profiter de tous les parcours de communication et de régulation émotionnelle.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 px-4">
            <Button
              size="lg"
              onClick={handleBuyClick}
              className="flex items-center gap-2 w-full sm:w-auto"
              data-testid="button-buy-access"
            >
              <ShoppingCart className="w-4 h-4" />
              Acheter maintenant
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleInfoClick}
              className="flex items-center gap-2 w-full sm:w-auto"
              data-testid="button-more-info"
            >
              <Info className="w-4 h-4" />
              Plus d'informations
            </Button>
          </div>

          <p className="text-xs text-muted-foreground pt-4 px-4">
            Vous avez déjà payé et vous voyez cet écran?<br />
            Contactez le support pour résoudre ce problème.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-xs text-muted-foreground"
          data-testid="button-theme-toggle-paywall"
        >
          {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        </Button>
      </div>
    </div>
  );
}
