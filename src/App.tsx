import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { FarmDataProvider } from "@/contexts/FarmDataContext";
import { AppLayout } from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import ChickensPage from "@/pages/ChickensPage";
import EggsPage from "@/pages/EggsPage";
import FeedPage from "@/pages/FeedPage";
import HealthPage from "@/pages/HealthPage";
import SalesPage from "@/pages/SalesPage";
import ProfitLossPage from "@/pages/ProfitLossPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <FarmDataProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chickens" element={<ChickensPage />} />
          <Route path="/eggs" element={<EggsPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/profit-loss" element={<ProfitLossPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </FarmDataProvider>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={!loading && isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
