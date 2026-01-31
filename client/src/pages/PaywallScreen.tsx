import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Info } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface PaywallScreenProps {
  paywallUrl?: string;
  infoUrl?: string;
}

export default function PaywallScreen({
  paywallUrl = 'https://your-community.circle.so/checkout/your-product',
  infoUrl = 'https://your-community.circle.so/info'
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
          <div className="space-y-3 pt-4 md:pt-8">
            <div className="inline-flex items-center justify-center w-[100px] h-[100px] md:w-[140px] md:h-[140px]">
              <img
                src="/logo-blue.png"
                alt="App Logo"
                className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] dark:hidden"
              />
              <img
                src="/logo-white.png"
                alt="App Logo"
                className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] hidden dark:block"
              />
            </div>
            <div className="text-lg md:text-2xl font-black italic text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              CIRCLE APP
            </div>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 md:p-8 space-y-4">
              <h1 className="text-lg md:text-xl font-semibold text-muted-foreground">
                Access Reserved
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                This app is reserved for members who have purchased access. Purchase your access to start using the app.
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  onClick={handleBuyClick}
                  className="flex items-center gap-2 w-full"
                  data-testid="button-buy-access"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleInfoClick}
                  className="flex items-center gap-2 w-full"
                  data-testid="button-more-info"
                >
                  <Info className="w-4 h-4" />
                  More Information
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground pt-2 px-4">
            Already purchased and seeing this screen?<br />
            Contact support to resolve this issue.
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
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>
    </div>
  );
}
