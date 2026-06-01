
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Vozmozhnosti from "./pages/Vozmozhnosti";
import DlyaKogo from "./pages/DlyaKogo";
import Akademiya from "./pages/Akademiya";
import Tseny from "./pages/Tseny";
import Keysy from "./pages/Keysy";
import OProekte from "./pages/OProekte";
import Tarify from "./pages/Tarify";
import Partnery from "./pages/Partnery";
import Kontakty from "./pages/Kontakty";
import Privacy from "./pages/Privacy";
import Offer from "./pages/Offer";
import Catalog from "./pages/Catalog";
import DlyaSalonov from "./pages/DlyaSalonov";
import SalonPyatShagov from "./pages/SalonPyatShagov";
import SalonFormats from "./pages/SalonFormats";
import DiagnostikaSalona from "./pages/DiagnostikaSalona";
import Reviews from "./pages/Reviews";
import NotFoundPage from "./pages/NotFoundPage";
import CookieBanner from "./components/CookieBanner";
import QuizAdmin from "./pages/QuizAdmin";
import QuizLanding from "./pages/QuizLanding";
import LkPage from "./pages/lk/LkPage";
import LkJoinPage from "./pages/lk/LkJoinPage";
import RepPage from "./pages/rep/RepPage";
import JobPage from "./pages/job/JobPage";
import { LkAuthProvider } from "./contexts/LkAuthContext";
import { EnergyProvider } from "./contexts/EnergyContext";
import EnergyGate from "./components/EnergyGate";
import ScrollToTop from "./components/ScrollToTop";
import DlyaSpecialistov from "./pages/DlyaSpecialistov";
import OSisteme from "./pages/OSisteme";
import ProfessionalnyeVstrechi from "./pages/ProfessionalnyeVstrechi";
import ZakrytayaPraktika from "./pages/ZakrytayaPraktika";
import Praktika from "./pages/Praktika";
import PremiumPraktika from "./pages/PremiumPraktika";
import EkspertTarif from "./pages/EkspertTarif";
import FreeTarif from "./pages/FreeTarif";
import ComingSoon from "./pages/ComingSoon";
import Demo from "./pages/Demo";
import Vakansii from "./pages/Vakansii";
import MassajPage from "./pages/massaj/MassajPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LkAuthProvider>
    <EnergyProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CookieBanner />
      <EnergyGate />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vozmozhnosti" element={<Vozmozhnosti />} />
          <Route path="/dlya-kogo" element={<DlyaKogo />} />
          <Route path="/akademiya" element={<Akademiya />} />
          <Route path="/tseny" element={<Tseny />} />
          <Route path="/keysy" element={<Keysy />} />
          <Route path="/o-proekte" element={<OProekte />} />
          <Route path="/tarify" element={<Tarify />} />
          <Route path="/partnery" element={<Partnery />} />
          <Route path="/kontakty" element={<Kontakty />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/dlya-salonov" element={<DlyaSalonov />} />
          <Route path="/dlya-salonov/5-shagov" element={<SalonPyatShagov />} />
          <Route path="/dlya-salonov/formats" element={<SalonFormats />} />
          <Route path="/diagnostika-salona" element={<DiagnostikaSalona />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/quiz-admin" element={<QuizAdmin />} />
          <Route path="/quiz" element={<QuizLanding />} />
          <Route path="/cabinet" element={<LkPage />} />
          <Route path="/join" element={<LkJoinPage />} />
          <Route path="/join/:token" element={<LkJoinPage />} />
          <Route path="/rep" element={<RepPage />} />
          <Route path="/job" element={<JobPage />} />
          <Route path="/dlya-specialistov" element={<DlyaSpecialistov />} />
          <Route path="/o-sisteme" element={<OSisteme />} />
          <Route path="/professionalnye-vstrechi" element={<ProfessionalnyeVstrechi />} />
          <Route path="/zakrytaya-praktika" element={<ZakrytayaPraktika />} />
          <Route path="/praktika" element={<Praktika />} />
          <Route path="/premium" element={<PremiumPraktika />} />
          <Route path="/ekspert" element={<EkspertTarif />} />
          <Route path="/free" element={<FreeTarif />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/vakansii" element={<Vakansii />} />
          <Route path="/massaj" element={<MassajPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </EnergyProvider>
    </LkAuthProvider>
  </QueryClientProvider>
);

export default App;