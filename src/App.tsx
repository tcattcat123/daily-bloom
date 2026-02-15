import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import Teams from "./pages/Teams";
import NotFound from "./pages/NotFound";
import Start from "./pages/Start";
import Landing from "./pages/Landing";
import SupportRayNotifications from "@/components/SupportRayNotifications";
import PWAInstallBanner from "@/components/PWAInstallBanner";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return (
    <>
      {children}
      <SupportRayNotifications />
    </>
  );
};

// Public route - redirect to home if already logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PWAInstallBanner />
        <BrowserRouter>
          <Routes>
            {/* Landing page - public */}
            <Route path="/" element={<Landing />} />

            {/* Auth routes */}
            <Route path="/welcome" element={
              <PublicRoute>
                <Welcome />
              </PublicRoute>
            } />
            <Route path="/auth/register" element={
              <PublicRoute>
                <Welcome />
              </PublicRoute>
            } />

            {/* Protected app routes */}
            <Route path="/app" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/teams" element={
              <ProtectedRoute>
                <Teams />
              </ProtectedRoute>
            } />

            {/* Legacy routes */}
            <Route path="/start" element={<Start />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
