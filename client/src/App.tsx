import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ConfigProvider, useConfig } from "@/contexts/config-context";
import { CircleAuthProvider, useCircleAuth } from "@/contexts/circle-auth-context";
import { LoadingScreen } from "@/components/loading-screen";
import { AccessDeniedScreen } from "@/components/access-denied-screen";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import UserHome from "@/pages/user-home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/user-home" component={UserHome} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { blocked, isLoading } = useCircleAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (blocked === 'origin') {
    return <AccessDeniedScreen />;
  }

  return (
    <>
      <Toaster />
      <Router />
    </>
  );
}

function CircleAuthWrapper({ children }: { children: React.ReactNode }) {
  const { mode } = useConfig();
  
  return (
    <CircleAuthProvider key={mode}>
      {children}
    </CircleAuthProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <ThemeProvider defaultTheme="system">
          <TooltipProvider>
            <CircleAuthWrapper>
              <AppContent />
            </CircleAuthWrapper>
          </TooltipProvider>
        </ThemeProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
