import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import Favicon from "@/components/Favicon";

const Index = lazy(() => import("./pages/Index.tsx"));
const Portfolio = lazy(() => import("./pages/Portfolio.tsx"));
const PortfolioEntryPage = lazy(() => import("./pages/PortfolioEntryPage.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="pt-20 md:pt-24 min-h-screen flex items-center justify-center">
    <p className="font-body text-sm text-muted-foreground">Se încarcă...</p>
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Favicon />
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/portofoliu" element={<Portfolio />} />
                  <Route path="/portofoliu/:slug" element={<PortfolioEntryPage />} />
                  <Route path="/despre" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
