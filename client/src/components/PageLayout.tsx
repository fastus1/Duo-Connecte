import { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useSession } from '@/contexts/SessionContext';

interface PageLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  showBackButton?: boolean;
}

export function PageLayout({ children, showNav = true, showBackButton = true }: PageLayoutProps) {
  const { session, goBack } = useSession();
  const [, setLocation] = useLocation();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animationDuration = prefersReducedMotion ? 0 : 1;

  useEffect(() => {
    window.scrollTo(0, 0);
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.scrollTo(0, 0);
    }
  }, [session.currentStep]);

  const handleBack = () => {
    if (session.currentStep === 0) {
      setLocation('/welcome');
    } else {
      goBack();
    }
  };

  return (
    <div className="min-h-full flex flex-col" style={{ background: 'hsl(var(--page-bg))' }}>
      <main className="flex-1 px-4 md:px-6 py-6 md:py-12 pb-20 md:pb-24">
        <motion.div
          key={session.currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animationDuration, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
