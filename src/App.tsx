
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NamingValidator from "./pages/NamingValidator";
import DeliverablesTracker from "./pages/DeliverablesTracker";
import DeliverablesTrackerTest from "./pages/DeliverablesTrackerTest";
import ComingSoonPage from "./pages/ComingSoonPage";
import Tutorials from "./pages/Tutorials";
import AboutUs from "./pages/AboutUs";
import Articles from "./pages/Articles";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import { isFeatureEnabled } from "@/config/featureFlags";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/naming-validator" element={<NamingValidator />} />
          <Route path="/naming-demo" element={<NamingValidator />} />
          <Route path="/deliverables-tracker" element={<DeliverablesTracker />} />
          <Route path="/drawinglist-demo" element={<DeliverablesTracker />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Feature-flagged routes */}
          {isFeatureEnabled('tutorialsPage') && <Route path="/tutorials" element={<Tutorials />} />}
          {isFeatureEnabled('aboutPage') && <Route path="/about" element={<AboutUs />} />}
          {isFeatureEnabled('articlesPage') && <Route path="/articles" element={<Articles />} />}
          {isFeatureEnabled('pricingPage') && <Route path="/pricing" element={<Pricing />} />}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
