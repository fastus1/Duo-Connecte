import React, { useEffect, useState, useMemo } from 'react';
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider, useSession } from '@/contexts/SessionContext';
import { AccessProvider, useAccess } from '@/contexts/AccessContext';
import { soloFlow, duoFlow, getFlow } from '@shared/schema';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AdminPreviewSidebar } from '@/components/AdminPreviewSidebar';
import { getSessionToken } from '@/lib/auth';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DemoLoadingScreen from '@/pages/DemoLoadingScreen';
import DemoPaywallScreen from '@/pages/DemoPaywallScreen';
import DemoPinCreation from '@/pages/DemoPinCreation';
import DemoPinLogin from '@/pages/DemoPinLogin';

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
import SoloPresentation from '@/pages/SoloPresentation';

// Import Duo flow pages
import DuoRoles from '@/pages/DuoRoles';
import DuoPresentation from '@/pages/DuoPresentation';
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
import SupportPage from '@/pages/SupportPage';

const soloPageComponents = [
  SoloPresentation,
];

const duoPageComponents = [
  DuoPresentation,
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

function AccessGate({ children, isAdmin }: { children: React.ReactNode; isAdmin: boolean }) {
  const { accessStatus } = useAccess();
  const [location] = useLocation();

  // Admin page is always accessible (has its own protection)
  if (location === '/admin' || location === '/admin-login') {
    return <>{children}</>;
  }

  // Admin bypass - admins can access all pages for preview
  if (isAdmin) {
    return <>{children}</>;
  }

  // Allow access if user is logged in (admin/template auth)
  const sessionToken = localStorage.getItem('session_token');
  if (sessionToken) {
    return <>{children}</>;
  }

  // Public pages (landing and welcome)
  if (location === '/' || location === '/welcome') {
    return <>{children}</>;
  }

  // Show loading state
  if (accessStatus === 'loading') {
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
  const { circleIsAdmin } = useAccess();
  const sessionToken = getSessionToken();
  const [previewMode, setPreviewMode] = useState(false);

  // Check if user is admin via JWT
  const { data: userData } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      if (!sessionToken) return null;
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      });
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!sessionToken,
    retry: false,
  });

  const isAdmin = userData?.isAdmin || circleIsAdmin;

  // Get current flow configuration
  const flow = getFlow(session.appType);

  // All preview pages for navigation
  const allPreviewPages = useMemo(() => [
    '/welcome',
    '/_demo/loading',
    '/_demo/paywall',
    '/_demo/pin-creation',
    '/_demo/pin-login',
    '/admin-login',
    '/admin',
    '/support',
    ...soloFlow.pages.map(p => p.path),
    ...duoFlow.pages.map(p => p.path),
  ], []);

  const currentPageIndex = allPreviewPages.indexOf(location);
  const canGoPrev = currentPageIndex > 0;
  const canGoNext = currentPageIndex < allPreviewPages.length - 1 && currentPageIndex >= 0;

  const goToPrevPage = () => {
    if (canGoPrev) {
      setLocation(allPreviewPages[currentPageIndex - 1]);
    }
  };

  const goToNextPage = () => {
    if (canGoNext) {
      setLocation(allPreviewPages[currentPageIndex + 1]);
    }
  };

  // Sync URL with current step (but don't redirect if on admin or template pages or in preview mode)
  useEffect(() => {
    // Skip redirection if in preview mode or on admin/template pages
    if (previewMode || location === '/admin' || location === '/admin-login' || location === '/' || location === '/user-home' || location.startsWith('/_demo')) {
      return;
    }

    const currentPage = flow.pages[session.currentStep];
    if (currentPage && location !== currentPage.path) {
      // Only redirect if we are in a flow path (starts with /solo or /duo)
      if (location.startsWith('/solo') || location.startsWith('/duo')) {
        setLocation(currentPage.path);
      }
    }
  }, [session.currentStep, session.appType, location, setLocation, flow.pages, previewMode]);


  // Admin preview mode with sidebar
  if (isAdmin && previewMode) {
    return (
      <>
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <AdminPreviewSidebar />
            <SidebarInset className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between p-2 border-b bg-card sticky top-0 z-50 gap-2">
                <div className="flex items-center gap-2">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <span className="text-sm font-medium hidden sm:inline">Prévisualisation</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPrevPage}
                    disabled={!canGoPrev}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground min-w-[60px] text-center">
                    {currentPageIndex >= 0 ? `${currentPageIndex + 1}/${allPreviewPages.length}` : '-'}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToNextPage}
                    disabled={!canGoNext}
                    data-testid="button-next-page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(false)}
                  data-testid="button-exit-preview"
                >
                  <span className="hidden sm:inline">Quitter</span>
                  <span className="sm:hidden">X</span>
                </Button>
              </header>
              <main className="flex-1 overflow-auto">
                <AccessGate isAdmin={isAdmin}>
                  <Switch>
                    <Route path="/welcome" component={Welcome} />
                    <Route path="/_demo/loading" component={DemoLoadingScreen} />
                    <Route path="/_demo/paywall" component={DemoPaywallScreen} />
                    <Route path="/_demo/pin-creation" component={DemoPinCreation} />
                    <Route path="/_demo/pin-login" component={DemoPinLogin} />
                    <Route path="/user-home">{() => { window.location.replace('/welcome'); return null; }}</Route>
                    <Route path="/admin-login" component={AdminLogin} />
                    <Route path="/admin" component={Dashboard} />
                    <Route path="/support" component={SupportPage} />
                    {soloFlow.pages.map((page, index) => (
                      <Route key={`solo-${page.id}`} path={page.path}>
                        {React.createElement(soloPageComponents[index] || NotFound)}
                      </Route>
                    ))}
                    {duoFlow.pages.map((page, index) => (
                      <Route key={`duo-${page.id}`} path={page.path}>
                        {React.createElement(duoPageComponents[index] || NotFound)}
                      </Route>
                    ))}
                    <Route component={NotFound} />
                  </Switch>
                </AccessGate>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalHeader onEnterPreview={isAdmin ? () => setPreviewMode(true) : undefined} />
      <AccessGate isAdmin={false}>
        <Switch>
          {/* Auth & Public Routes */}
          <Route path="/" component={AuthPage} />
          <Route path="/welcome" component={Welcome} />
          <Route path="/user-home">{() => { window.location.replace('/welcome'); return null; }}</Route>
          <Route path="/admin-login" component={AdminLogin} />

          {/* Protected Routes */}
          <Route path="/admin" component={Dashboard} />
          <Route path="/support" component={SupportPage} />

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
