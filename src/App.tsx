import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import your new components
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Classify from "./pages/Classify"; // The new page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* All your main pages now go inside the Layout route */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="classify" element={<Classify />} />
          </Route>

          {/* The NotFound route can stay outside */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;