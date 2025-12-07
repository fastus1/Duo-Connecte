import { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from './ProgressBar';
import { PersistentNav } from './PersistentNav';
import { getFlow } from '@shared/schema';
import { useSession } from '@/contexts/SessionContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface PageLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function PageLayout({ children, showNav = true }: PageLayoutProps) {
  const { session, goToStep, goBack } = useSession();
  const flow = getFlow(session.appType);
  const currentPage = flow.pages[session.currentStep];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animationDuration = prefersReducedMotion ? 0 : 1;

  // Menu déroulant Solo (avec Sender Clarification à la page 14)
  const soloPageNames = [
    "Welcome",
    "Roles",
    "Warnings",
    "Intention",
    "Sender Grounding",
    "Receiver Grounding",
    "Transition 1",
    "Sender Situation",
    "Sender Experience",
    "Sender Interpretation",
    "Sender Impact",
    "Sender Summary",
    "Receiver Validation",
    "Sender Confirmation",
    "Sender Clarification",
    "Receiver Experience",
    "Sender Validation",
    "Receiver Confirmation",
    "Transition 2",
    "Sender Needs",
    "Receiver Response",
    "Transition 3",
    "Sender Closing",
    "Receiver Closing",
    "Thanks",
    "Feedback",
    "Completion",
  ];

  // Menu déroulant Duo (sans Sender Clarification)
  const duoPageNames = [
    "Welcome",
    "Roles",
    "Warnings",
    "Intention",
    "Sender Grounding",
    "Receiver Grounding",
    "Transition 1",
    "Sender Situation",
    "Sender Experience",
    "Sender Interpretation",
    "Sender Impact",
    "Sender Summary",
    "Receiver Validation",
    "Sender Confirmation",
    "Receiver Experience",
    "Sender Validation",
    "Receiver Confirmation",
    "Transition 2",
    "Sender Needs",
    "Receiver Response",
    "Transition - Choix",
    "Sender Closing",
    "Receiver Closing",
    "Feedback",
    "Completion",
    // Parcours inversé (7a-20a)
    "🔄 Situation (Inversé)",
    "🔄 Experience (Inversé)",
    "🔄 Interpretation (Inversé)",
    "🔄 Impact (Inversé)",
    "🔄 Summary (Inversé)",
    "🔄 Validation (Inversé)",
    "🔄 Confirmation (Inversé)",
    "🔄 Experience Récepteur (Inversé)",
    "🔄 Validation Émetteur (Inversé)",
    "🔄 Confirmation Récepteur (Inversé)",
    "🔄 Transition 2 (Inversé)",
    "🔄 Needs (Inversé)",
    "🔄 Response (Inversé)",
    "🔄 Transition 3 (Inversé)",
  ];

  // Choisir le bon menu selon le flow actif
  const pageNames = session.appType === 'solo' ? soloPageNames : duoPageNames;

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

      {/* TEMPORARY: Page navigation for development - to be removed later */}
      <div className="hidden md:block fixed top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="flex px-3 py-1 rounded-md text-sm font-medium shadow-lg items-center gap-1 hover-elevate active-elevate-2"
              style={{ 
                backgroundColor: flow.progressColor,
                color: 'white'
              }}
            >
              Page {session.currentStep}/{flow.pages.length - 1}
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-96 overflow-y-auto">
            <DropdownMenuLabel>Aller à la page</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {pageNames.map((name, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => goToStep(index)}
                className={session.currentStep === index ? "bg-primary/10" : ""}
              >
                <span className="font-medium w-8">P{index}</span>
                <span>{name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
