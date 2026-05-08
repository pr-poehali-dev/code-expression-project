
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
import CourseKorrektsiya from "./pages/CourseKorrektsiya";
import CourseVisceralny from "./pages/CourseVisceralny";
import CoursePotok from "./pages/CoursePotok";
import CourseOfflineIntensiv from "./pages/CourseOfflineIntensiv";
import CourseOfflineIntensivMassazhist from "./pages/CourseOfflineIntensivMassazhist";
import CourseOfflineIntensivTrener from "./pages/CourseOfflineIntensivTrener";
import CourseOfflineIntensivSemya from "./pages/CourseOfflineIntensivSemya";
import CourseTrevoga from "./pages/course-trevoga";
import SalonServices from "./pages/SalonServices";
import CourseFitnesBerem from "./pages/CourseFitnesBerem";
import DiagnostikaSalona from "./pages/DiagnostikaSalona";
import CourseKollektsiya from "./pages/CourseKollektsiya";
import Reviews from "./pages/Reviews";
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
          <Route path="/course/korrektsiya-figury" element={<CourseKorrektsiya />} />
          <Route path="/course/visceralny-massazh-s-nulya" element={<CourseVisceralny />} />
          <Route path="/course/massazhist-s-potokom-klientov" element={<CoursePotok />} />
          <Route path="/course/offline-intensiv-massazh" element={<CourseOfflineIntensiv />} />
          <Route path="/course/offline-intensiv-dlya-massazhistov" element={<CourseOfflineIntensivMassazhist />} />
          <Route path="/course/offline-intensiv-dlya-trenerov" element={<CourseOfflineIntensivTrener />} />
          <Route path="/course/offline-intensiv-dlya-semi" element={<CourseOfflineIntensivSemya />} />
          <Route path="/course/vns-trevoga" element={<CourseTrevoga />} />
          <Route path="/dlya-salonov" element={<SalonServices />} />
          <Route path="/course/fitnes-beremennyh" element={<CourseFitnesBerem />} />
          <Route path="/diagnostika-salona" element={<DiagnostikaSalona />} />
          <Route path="/course/kollektsiya" element={<CourseKollektsiya />} />
          <Route path="/reviews" element={<Reviews />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;