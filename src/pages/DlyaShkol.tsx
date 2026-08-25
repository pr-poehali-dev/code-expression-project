import { useEffect } from "react";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import DlyaShkolHero from "./dlya-shkol/DlyaShkolHero";
import DlyaShkolValue from "./dlya-shkol/DlyaShkolValue";
import DlyaShkolConnect from "./dlya-shkol/DlyaShkolConnect";

export default function DlyaShkol() {
  useEffect(() => {
    document.title = "Партнерство для школ — Промт Диалог | ИИ для развития мастеров";
    const desc = document.querySelector("meta[name='description']");
    if (desc) desc.setAttribute("content", "Партнерская программа Промт Диалог для школ мастеров, массажистов и специалистов индустрии красоты. ИИ-навигатор, развитие выпускников, рекомендации курсов, статистика и чемпионаты.");
  }, []);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      <DlyaShkolHero />
      <DlyaShkolValue />
      <DlyaShkolConnect />

      <BizFooter />

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-img { margin-top: 40px; }
        }
        @media (max-width: 768px) {
          .compare-grid { grid-template-columns: 1fr !important; }
          .school-form-grid { grid-template-columns: 1fr !important; }
          .championships-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .championships-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .chain-flow > div > div { max-width: 100% !important; }
        }
        @media (max-width: 900px) {
          .navigator-steps { flex-direction: column !important; }
          .navigator-steps > div { flex-direction: column !important; }
          .navigator-steps > div > svg { transform: rotate(90deg); margin: 4px 0 !important; }
        }
        @media (max-width: 600px) {
          .hero-badge {
            padding: 8px 12px !important;
            gap: 8px !important;
            bottom: 10px !important;
            right: 10px !important;
            left: auto !important;
          }
        }
      `}</style>
    </div>
  );
}