
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
import SalonServices from "./pages/SalonServices";
import DiagnostikaSalona from "./pages/DiagnostikaSalona";
import Reviews from "./pages/Reviews";
import NotFoundPage from "./pages/NotFoundPage";
import CookieBanner from "./components/CookieBanner";
import QuizAdmin from "./pages/QuizAdmin";
import QuizLanding from "./pages/QuizLanding";
import LkPage from "./pages/lk/LkPage";
import { LkAuthProvider } from "./contexts/LkAuthContext";
import DlyaSpecialistov from "./pages/DlyaSpecialistov";
import OSisteme from "./pages/OSisteme";
import ProfessionalnyeVstrechi from "./pages/ProfessionalnyeVstrechi";
import ZakrytayaPraktika from "./pages/ZakrytayaPraktika";
import Praktika from "./pages/Praktika";
import PremiumPraktika from "./pages/PremiumPraktika";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LkAuthProvider>
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
          <Route path="/dlya-salonov" element={<SalonServices />} />
          <Route path="/diagnostika-salona" element={<DiagnostikaSalona />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/quiz-admin" element={<QuizAdmin />} />
          <Route path="/quiz" element={<QuizLanding />} />
          <Route path="/cabinet" element={<LkPage />} />
          <Route path="/dlya-specialistov" element={<DlyaSpecialistov />} />
          <Route path="/o-sisteme" element={<OSisteme />} />
          <Route path="/professionalnye-vstrechi" element={<ProfessionalnyeVstrechi />} />
          <Route path="/zakrytaya-praktika" element={<ZakrytayaPraktika />} />
          <Route path="/praktika" element={<Praktika />} />
          <Route path="/premium" element={<PremiumPraktika />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </LkAuthProvider>
  </QueryClientProvider>
);

export default App;