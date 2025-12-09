import { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from './ProgressBar';
import { PersistentNav } from './PersistentNav';
import { getFlow } from '@shared/schema';
import { useSession } from '@/contexts/SessionContext';

interface PageLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function PageLayout({ children, showNav = true }: PageLayoutProps) {
  const { session, goBack } = useSession();
  const flow = getFlow(session.appType);
  const currentPage = flow.pages[session.currentStep];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animationDuration = prefersReducedMotion ? 0 : 1;

  useEffect(() => {
    window.scrollTo(0, 0);
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.scrollTo(0, 0);
    }
  }, [session.currentStep]);

  return (
    <div className="min-h-full flex flex-col" style={{ background: 'hsl(var(--page-bg))' }}>
      <ProgressBar
        section={currentPage.section}
        currentStep={session.currentStep}
        totalSteps={flow.pages.length}
      />

      <main className="flex-1 px-4 md:px-6 py-6 md:py-12 pb-32 md:pb-64">
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

      {showNav && (
        <PersistentNav 
          onBack={goBack} 
          canGoBack={session.currentStep > 0} 
        />
      )}
    </div>
  );
}
