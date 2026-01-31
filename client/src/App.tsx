import React from 'react';
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from '@/contexts/SessionContext';
import { AccessProvider, useAccess } from '@/contexts/AccessContext';
import { getSessionToken } from '@/lib/auth';

// Template Pages
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import AdminLogin from "@/pages/admin-login";
import NotFound from "@/pages/not-found";
import { GlobalHeader } from "@/components/GlobalHeader";
import Welcome from '@/pages/Welcome';
import PaywallScreen from '@/pages/PaywallScreen';
import SupportPage from '@/pages/SupportPage';

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
          <p className="text-muted-foreground">Verifying access...</p>
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
          <h1 className="text-xl font-semibold text-foreground">Access Not Authorized</h1>
          <p className="text-muted-foreground">
            This application is only accessible from your Circle community.
          </p>
          <a
            href="https://your-community.circle.so"
            className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Access Community
          </a>
        </div>
      </div>
    );
  }

  // Access granted - show the app
  return <>{children}</>;
}

function SessionRouter() {
  const [location] = useLocation();
  const { circleIsAdmin } = useAccess();
  const sessionToken = getSessionToken();

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

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalHeader />
      <AccessGate isAdmin={isAdmin}>
        <Switch>
          {/* Auth & Public Routes */}
          <Route path="/" component={AuthPage} />
          <Route path="/welcome" component={Welcome} />
          <Route path="/admin-login" component={AdminLogin} />

          {/* Protected Routes */}
          <Route path="/admin" component={Dashboard} />
          <Route path="/support" component={SupportPage} />

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
