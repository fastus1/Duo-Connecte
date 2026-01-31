import { PageLayout } from '@/components/PageLayout';
import { InstallBanner } from '@/components/InstallBanner';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ArrowRight } from 'lucide-react';

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <PageLayout showNav={true} showBackButton={false}>
      <InstallBanner />
      <div className="flex items-center justify-center min-h-[calc(100vh-180px)] md:min-h-[60vh]">
        <div className="max-w-2xl mx-auto text-center space-y-4 md:space-y-8 py-4">
          <div className="space-y-1">
            <div className="inline-flex items-center justify-center w-[80px] h-[80px] md:w-[120px] md:h-[120px]">
              <img
                src="/logo-blue.png"
                alt="App Logo"
                className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] dark:hidden"
              />
              <img
                src="/logo-white.png"
                alt="App Logo"
                className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] hidden dark:block"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground pt-2 md:pt-6 tracking-tight" style={{ fontFamily: 'Figtree, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            Welcome
          </h1>

          <p className="text-sm md:text-lg text-foreground leading-relaxed max-w-lg mx-auto pt-3 md:pt-4 px-4">
            Your Circle.so app template is ready to customize.
          </p>

          <div className="pt-6 md:pt-8 max-w-md mx-auto px-4">
            <div className="flex flex-col items-center space-y-3 md:space-y-4 p-6 md:p-8 rounded-lg border-2 border-primary/20 bg-primary/5">
              <h2 className="text-lg md:text-xl font-bold text-foreground" style={{ fontFamily: 'Figtree, sans-serif' }}>
                Get Started
              </h2>
              <p className="text-sm md:text-base text-muted-foreground text-center leading-relaxed">
                Customize this template to build your app
              </p>
              <Button
                size="lg"
                onClick={() => setLocation('/admin')}
                className="text-sm md:text-base px-8 md:px-10 w-full mt-2"
                data-testid="button-get-started"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Button>
            </div>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground pt-4 md:pt-6 max-w-lg mx-auto leading-relaxed px-4">
            This template includes authentication, admin dashboard, support page, and more.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
