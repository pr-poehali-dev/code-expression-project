
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Tarify from "./pages/Tarify";
import Partnery from "./pages/Partnery";
import Kontakty from "./pages/Kontakty";
import Privacy from "./pages/Privacy";
import Offer from "./pages/Offer";
import Catalog from "./pages/Catalog";
import CatalogPrivate from "./pages/CatalogPrivate";
import CourseMassazhist from "./pages/CourseMassazhist";
import CourseVosstanovitelny from "./pages/CourseVosstanovitelny";
import CourseProtokoly from "./pages/CourseProtokoly";
import CourseAntistress from "./pages/CourseAntistress";
import NotFoundPage from "./pages/NotFoundPage";
import CookieBanner from "./components/CookieBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CookieBanner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tarify" element={<Tarify />} />
          <Route path="/partnery" element={<Partnery />} />
          <Route path="/kontakty" element={<Kontakty />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/private" element={<CatalogPrivate />} />
          <Route path="/course/massazhist-s-nulya" element={<CourseMassazhist />} />
          <Route path="/course/vosstanovitelny-massazh-pro" element={<CourseVosstanovitelny />} />
          <Route path="/course/gotovye-protokoly-massazha" element={<CourseProtokoly />} />
          <Route path="/course/antistress-tehniki-massazha" element={<CourseAntistress />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;