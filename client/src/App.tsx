import React, { useEffect } from 'react';
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider, useSession } from '@/contexts/SessionContext';
import { AccessProvider, useAccess } from '@/contexts/AccessContext';
import { soloFlow, duoFlow, getFlow } from '@shared/schema';

// Template Pages
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";

import AdminLogin from "@/pages/admin-login";
import NotFound from "@/pages/not-found";
import { GlobalHeader } from "@/components/GlobalHeader";

// Duo Connecte Pages
import Welcome from '@/pages/Welcome';
import PaywallScreen from '@/pages/PaywallScreen';

// Import Solo flow pages
import SoloRoles from '@/pages/SoloRoles';
import SoloWarnings from '@/pages/SoloWarnings';
import SoloIntention from '@/pages/SoloIntention';
import SoloSenderGrounding from '@/pages/SoloSenderGrounding';
import SoloReceiverGrounding from '@/pages/SoloReceiverGrounding';
import SoloTransition1 from '@/pages/SoloTransition1';
import SoloSenderSituation from '@/pages/SoloSenderSituation';
import SoloSenderExperience from '@/pages/SoloSenderExperience';
import SoloSenderInterpretation from '@/pages/SoloSenderInterpretation';
import SoloSenderImpact from '@/pages/SoloSenderImpact';
import SoloSenderSummary from '@/pages/SoloSenderSummary';
import SoloReceiverValidation from '@/pages/SoloReceiverValidation';
import SoloSenderConfirmation from '@/pages/SoloSenderConfirmation';
import SoloSenderClarification from '@/pages/SoloSenderClarification';
import SoloReceiverExperience from '@/pages/SoloReceiverExperience';
import SoloSenderValidation from '@/pages/SoloSenderValidation';
import SoloReceiverConfirmation from '@/pages/SoloReceiverConfirmation';
import SoloTransition2 from '@/pages/SoloTransition2';
import SoloSenderNeeds from '@/pages/SoloSenderNeeds';
import SoloReceiverResponse from '@/pages/SoloReceiverResponse';
import SoloTransition3 from '@/pages/SoloTransition3';
import SoloSenderClosing from '@/pages/SoloSenderClosing';
import SoloReceiverClosing from '@/pages/SoloReceiverClosing';
import SoloThanks from '@/pages/SoloThanks';
import SoloFeedback from '@/pages/SoloFeedback';
import SoloCompletion from '@/pages/SoloCompletion';

// Import Duo flow pages
import DuoRoles from '@/pages/DuoRoles';
import DuoWarnings from '@/pages/DuoWarnings';
import DuoIntention from '@/pages/DuoIntention';
import DuoSenderGrounding from '@/pages/DuoSenderGrounding';
import DuoReceiverGrounding from '@/pages/DuoReceiverGrounding';
import DuoTransition1 from '@/pages/DuoTransition1';
import DuoSenderSituation from '@/pages/DuoSenderSituation';
import DuoSenderExperience from '@/pages/DuoSenderExperience';
import DuoSenderInterpretation from '@/pages/DuoSenderInterpretation';
import DuoSenderImpact from '@/pages/DuoSenderImpact';
import DuoSenderSummary from '@/pages/DuoSenderSummary';
import DuoReceiverValidation from '@/pages/DuoReceiverValidation';
import DuoSenderConfirmation from '@/pages/DuoSenderConfirmation';
import DuoReceiverExperience from '@/pages/DuoReceiverExperience';
import DuoSenderValidation from '@/pages/DuoSenderValidation';
import DuoReceiverConfirmation from '@/pages/DuoReceiverConfirmation';
import DuoTransition2 from '@/pages/DuoTransition2';
import DuoSenderNeeds from '@/pages/DuoSenderNeeds';
import DuoReceiverResponse from '@/pages/DuoReceiverResponse';
import DuoTransition3 from '@/pages/DuoTransition3';
import DuoSenderClosing from '@/pages/DuoSenderClosing';
import DuoReceiverClosing from '@/pages/DuoReceiverClosing';
import DuoFeedback from '@/pages/DuoFeedback';
import DuoCompletion from '@/pages/DuoCompletion';

// Import Duo Inversion flow pages
import DuoInversionPage7a from '@/pages/DuoInversionPage7a';
import DuoInversionPage8a from '@/pages/DuoInversionPage8a';
import DuoInversionPage9a from '@/pages/DuoInversionPage9a';
import DuoInversionPage10a from '@/pages/DuoInversionPage10a';
import DuoInversionPage11a from '@/pages/DuoInversionPage11a';
import DuoInversionPage12a from '@/pages/DuoInversionPage12a';
import DuoInversionPage13a from '@/pages/DuoInversionPage13a';
import DuoInversionPage14a from '@/pages/DuoInversionPage14a';
import DuoInversionPage15a from '@/pages/DuoInversionPage15a';
import DuoInversionPage16a from '@/pages/DuoInversionPage16a';
import DuoInversionPage17a from '@/pages/DuoInversionPage17a';
import DuoInversionPage18a from '@/pages/DuoInversionPage18a';
import DuoInversionPage19a from '@/pages/DuoInversionPage19a';
import DuoInversionPage20a from '@/pages/DuoInversionPage20a';

const soloPageComponents = [
  Welcome,
  SoloRoles,
  SoloWarnings,
  SoloIntention,
  SoloSenderGrounding,
  SoloReceiverGrounding,
  SoloTransition1,
  SoloSenderSituation,
  SoloSenderExperience,
  SoloSenderInterpretation,
  SoloSenderImpact,
  SoloSenderSummary,
  SoloReceiverValidation,
  SoloSenderConfirmation,
  SoloSenderClarification,
  SoloReceiverExperience,
  SoloSenderValidation,
  SoloReceiverConfirmation,
  SoloTransition2,
  SoloSenderNeeds,
  SoloReceiverResponse,
  SoloTransition3,
  SoloSenderClosing,
  SoloReceiverClosing,
  SoloThanks,
  SoloFeedback,
  SoloCompletion,
];

const duoPageComponents = [
  Welcome,
  DuoRoles,
  DuoWarnings,
  DuoIntention,
  DuoSenderGrounding,
  DuoReceiverGrounding,
  DuoTransition1,
  DuoSenderSituation,
  DuoSenderExperience,
  DuoSenderInterpretation,
  DuoSenderImpact,
  DuoSenderSummary,
  DuoReceiverValidation,
  DuoSenderConfirmation,
  DuoReceiverExperience,
  DuoSenderValidation,
  DuoReceiverConfirmation,
  DuoTransition2,
  DuoSenderNeeds,
  DuoReceiverResponse,
  DuoTransition3,
  DuoSenderClosing,
  DuoReceiverClosing,
  DuoFeedback,
  DuoCompletion,
  DuoInversionPage7a,
  DuoInversionPage8a,
  DuoInversionPage9a,
  DuoInversionPage10a,
  DuoInversionPage11a,
  DuoInversionPage12a,
  DuoInversionPage13a,
  DuoInversionPage14a,
  DuoInversionPage15a,
  DuoInversionPage16a,
  DuoInversionPage17a,
  DuoInversionPage18a,
  DuoInversionPage19a,
  DuoInversionPage20a,
];

// DEBUG - À RETIRER APRÈS DIAGNOSTIC
let renderCount = 0;
function dbg(msg: string, data?: unknown) {
  renderCount++;
  const t = performance.now().toFixed(0);
  console.log(`%c[${t}ms] #${renderCount} ${msg}`, 'color: #FF0000; font-weight: bold; font-size: 14px', data || '');
}

function AccessGate({ children }: { children: React.ReactNode }) {
  const { accessStatus } = useAccess();
  const [location] = useLocation();

  dbg('AccessGate', { accessStatus, location, hasToken: !!localStorage.getItem('session_token') });

  // Admin page is always accessible (has its own protection)
  if (location === '/admin' || location === '/admin-login') {
    dbg('→ RETURN: admin page');
    return <>{children}</>;
  }

  // Allow access if user is logged in (admin/template auth)
  const sessionToken = localStorage.getItem('session_token');
  if (sessionToken) {
    dbg('→ RETURN: has token');
    return <>{children}</>;
  }

  // Public pages
  if (location === '/') {
    dbg('→ RETURN: public /');
    return <>{children}</>;
  }

  // Show loading state
  if (accessStatus === 'loading') {
    dbg('→ RETURN: LOADING SCREEN ⚠️');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto">
            <img
              src="/logo-blue.png"
              alt="Logo"
              className="w-16 h-16 animate-pulse dark:hidden"
            />
            <img
              src="/logo-white.png"
              alt="Logo"
              className="w-16 h-16 animate-pulse hidden dark:block"
            />
          </div>
          <p className="text-muted-foreground">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  // Show paywall if access denied
  if (accessStatus === 'denied') {
    return <PaywallScreen />;
  }

  // Show error if origin is invalid
  if (accessStatus === 'origin_invalid') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-xl font-semibold text-foreground">Accès non autorisé</h1>
          <p className="text-muted-foreground">
            Cette application est accessible uniquement depuis la communauté Avancer Simplement.
          </p>
          <a
            href="https://communaute.avancersimplement.com"
            className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Accéder à la communauté
          </a>
        </div>
      </div>
    );
  }

  // Access granted - show the app
  return <>{children}</>;
}

function SessionRouter() {
  const { session } = useSession();
  const [location, setLocation] = useLocation();

  // Get current flow configuration
  const flow = getFlow(session.appType);

  // Sync URL with current step (but don't redirect if on admin or template pages)
  useEffect(() => {
    // Skip redirection if user is on admin or template pages
    if (location === '/admin' || location === '/admin-login' || location === '/' || location === '/user-home') {
      return;
    }

    const currentPage = flow.pages[session.currentStep];
    if (currentPage && location !== currentPage.path) {
      // Only redirect if we are in a flow path (starts with /solo or /duo or is /welcome)
      if (location.startsWith('/solo') || location.startsWith('/duo') || location === '/welcome') {
        setLocation(currentPage.path);
      }
    }
  }, [session.currentStep, session.appType, location, setLocation, flow.pages]);

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalHeader />
      <AccessGate>
        <Switch>
          {/* Auth & Public Routes */}
          <Route path="/" component={AuthPage} />
          <Route path="/user-home">{() => { window.location.replace('/welcome'); return null; }}</Route>
          <Route path="/admin-login" component={AdminLogin} />

          {/* Protected Routes */}
          <Route path="/admin" component={Dashboard} />

          {/* Solo flow routes */}
          {soloFlow.pages.map((page, index) => (
            <Route key={`solo-${page.id}`} path={page.path}>
              {React.createElement(soloPageComponents[index] || NotFound)}
            </Route>
          ))}

          {/* Duo flow routes */}
          {duoFlow.pages.map((page, index) => (
            <Route key={`duo-${page.id}`} path={page.path}>
              {React.createElement(duoPageComponents[index] || NotFound)}
            </Route>
          ))}

          <Route component={NotFound} />
        </Switch>
      </AccessGate>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <TooltipProvider>
          <AccessProvider>
            <SessionProvider>
              <Toaster />
              <SessionRouter />
            </SessionProvider>
          </AccessProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
