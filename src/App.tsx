
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LkAuthProvider } from "./contexts/LkAuthContext";
import { EnergyProvider } from "./contexts/EnergyContext";
import EnergyGate from "./components/EnergyGate";
import ScrollToTop from "./components/ScrollToTop";
import CookieBanner from "./components/CookieBanner";
import ChatWidget from "./components/ChatWidget";

// Публичные страницы — lazy
const Index = lazy(() => import("./pages/Index"));
const Vozmozhnosti = lazy(() => import("./pages/Vozmozhnosti"));
const ToolLanding = lazy(() => import("./pages/ToolLanding"));
const DlyaKogo = lazy(() => import("./pages/DlyaKogo"));
const Preimushchestva = lazy(() => import("./pages/Preimushchestva"));
const Akademiya = lazy(() => import("./pages/Akademiya"));
const Tseny = lazy(() => import("./pages/Tseny"));
const Keysy = lazy(() => import("./pages/Keysy"));
const OProekte = lazy(() => import("./pages/OProekte"));
const Tarify = lazy(() => import("./pages/Tarify"));
const Kontakty = lazy(() => import("./pages/Kontakty"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Offer = lazy(() => import("./pages/Offer"));
const Reviews = lazy(() => import("./pages/Reviews"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const Praktika = lazy(() => import("./pages/Praktika"));
const PremiumPraktika = lazy(() => import("./pages/PremiumPraktika"));
const EkspertTarif = lazy(() => import("./pages/EkspertTarif"));
const FreeTarif = lazy(() => import("./pages/FreeTarif"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const DlyaSalonov = lazy(() => import("./pages/DlyaSalonov"));
const FreeTrenings = lazy(() => import("./pages/FreeTrenings"));
const Masters = lazy(() => import("./pages/Masters"));
const MastersAuth = lazy(() => import("./pages/MastersAuth"));
const MastersCabinet = lazy(() => import("./pages/MastersCabinet"));
const LandingView = lazy(() => import("./pages/LandingView"));
const Diagnostika = lazy(() => import("./pages/Diagnostika"));
const ChampionshipPage = lazy(() => import("./pages/championship/ChampionshipPage"));
const ChampionshipTournament = lazy(() => import("./pages/championship/ChampionshipTournament"));
const ChampionshipRating = lazy(() => import("./pages/championship/ChampionshipRating"));
const ChampionshipHallOfFame = lazy(() => import("./pages/championship/ChampionshipHallOfFame"));
const ChampionshipSalon = lazy(() => import("./pages/championship/ChampionshipSalon"));

// Кабинет и rep — отдельные чанки
const LkPage = lazy(() => import("./pages/lk/LkPage"));
const LkJoinPage = lazy(() => import("./pages/lk/LkJoinPage"));
const RepPage = lazy(() => import("./pages/rep/RepPage"));
const TreningProdazhi = lazy(() => import("./pages/TreningProdazhi"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

function PageFallback() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
      <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#2DD4BF", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ChatWidgetConditional() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/cabinet") || pathname.startsWith("/rep")) return null;
  return <ChatWidget />;
}

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
        <ChatWidgetConditional />
        <ScrollToTop />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vozmozhnosti" element={<Vozmozhnosti />} />
            <Route path="/instrumenty/:slug" element={<ToolLanding />} />
            <Route path="/dlya-kogo" element={<DlyaKogo />} />
            <Route path="/preimushchestva" element={<Preimushchestva />} />
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
            <Route path="/trening-prodazhi" element={<TreningProdazhi />} />
            <Route path="/praktika" element={<Praktika />} />
            <Route path="/premium" element={<PremiumPraktika />} />
            <Route path="/ekspert" element={<EkspertTarif />} />
            <Route path="/free" element={<FreeTarif />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/dlya-salonov" element={<DlyaSalonov />} />
            <Route path="/free-trenings" element={<FreeTrenings />} />
            <Route path="/masters" element={<Masters />} />
            <Route path="/masters/register" element={<MastersAuth mode="register" />} />
            <Route path="/masters/login" element={<MastersAuth mode="login" />} />
            <Route path="/masters/cabinet" element={<MastersCabinet />} />

            <Route path="/landing/:id" element={<LandingView />} />
            <Route path="/diagnostika" element={<Diagnostika />} />

            {/* Чемпионат красоты */}
            <Route path="/championship" element={<ChampionshipPage />} />
            <Route path="/championship/tournament/:slug" element={<ChampionshipTournament />} />
            <Route path="/championship/rating" element={<ChampionshipRating />} />
            <Route path="/championship/hall-of-fame" element={<ChampionshipHallOfFame />} />
            <Route path="/championship/salon/:id" element={<ChampionshipSalon />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
    </EnergyProvider>
    </LkAuthProvider>
  </QueryClientProvider>
);

export default App;