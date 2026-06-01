
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
import Kontakty from "./pages/Kontakty";
import Privacy from "./pages/Privacy";
import Offer from "./pages/Offer";
import Reviews from "./pages/Reviews";
import NotFoundPage from "./pages/NotFoundPage";
import CookieBanner from "./components/CookieBanner";
import ChatWidget from "./components/ChatWidget";
import LkPage from "./pages/lk/LkPage";
import LkJoinPage from "./pages/lk/LkJoinPage";
import RepPage from "./pages/rep/RepPage";
import { LkAuthProvider } from "./contexts/LkAuthContext";
import { EnergyProvider } from "./contexts/EnergyContext";
import EnergyGate from "./components/EnergyGate";
import ScrollToTop from "./components/ScrollToTop";
import Praktika from "./pages/Praktika";
import PremiumPraktika from "./pages/PremiumPraktika";
import EkspertTarif from "./pages/EkspertTarif";
import FreeTarif from "./pages/FreeTarif";
import ComingSoon from "./pages/ComingSoon";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LkAuthProvider>
    <EnergyProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CookieBanner />
      <ChatWidget />
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
          <Route path="/kontakty" element={<Kontakty />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/cabinet" element={<LkPage />} />
          <Route path="/join" element={<LkJoinPage />} />
          <Route path="/join/:token" element={<LkJoinPage />} />
          <Route path="/rep" element={<RepPage />} />
          <Route path="/praktika" element={<Praktika />} />
          <Route path="/premium" element={<PremiumPraktika />} />
          <Route path="/ekspert" element={<EkspertTarif />} />
          <Route path="/free" element={<FreeTarif />} />
          <Route path="/coming-soon" element={<ComingSoon />} />

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