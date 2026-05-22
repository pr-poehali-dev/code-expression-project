import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";
import Icon from "@/components/ui/icon";
import TarifyPlans from "./tarify/TarifyPlans";
import { TarifyPrivatePractice, TarifyFaq, TarifyModal } from "./tarify/TarifyExtras";

const ACCENT = "hsl(185, 85%, 32%)";

export default function Tarify() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState("");

  const openModal = (planName: string) => {
    setModalPlan(planName);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>Форматы участия — Dok Диалог</title>
        <meta name="description" content="Форматы участия в системе Dok Диалог: для специалистов и для салонов. Система, практика, закрытая практика, внедрение." />
        <meta property="og:title" content="Форматы участия — Dok Диалог" />
      </Helmet>
      <style>{`
        .tarify-plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          align-items: stretch;
        }
        .tarify-plan-card {
          padding: 40px 32px;
        }
        .tarify-price {
          font-size: 48px;
        }
        .tarify-split-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        .tarify-split-col {
          padding: 56px 48px;
        }
        @media (max-width: 640px) {
          .tarify-plans-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .tarify-plan-card {
            padding: 28px 20px;
          }
          .tarify-price {
            font-size: 36px !important;
          }
          .tarify-split-grid {
            grid-template-columns: 1fr;
          }
          .tarify-split-col {
            padding: 32px 24px;
          }
          .tarify-diag-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <DokNavbar />

      <TarifyPlans onOpenModal={openModal} />

      {/* Diagnostics block */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ background: "linear-gradient(135deg, hsl(185,85%,10%) 0%, hsl(185,70%,20%) 100%)", borderRadius: 24, padding: "clamp(32px, 5vw, 56px) clamp(24px, 5vw, 52px)", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}
            className="tarify-diag-grid">
            <div>
              <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>
                Дополнительная услуга
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 700, color: "#fff", margin: "0 0 14px", lineHeight: 1.2 }}>
                Платная диагностика<br />массажного направления
              </h2>
              <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, margin: 0, maxWidth: 520 }}>
                Хотите понять, сколько именно теряет ваш салон на массажных услугах — до подписания любых договоров? Проведём независимую аудит-диагностику: посмотрим на компетенции мастеров, тайминг, ценообразование и загрузку. Получите конкретный отчёт с цифрами.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
              <a
                href="/diagnostika-salona"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: ACCENT, padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" as const, transition: "all 0.25s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)"; }}
              >
                Узнать подробнее
                <Icon name="ArrowRight" size={14} />
              </a>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", textAlign: "center" as const }}>30 000 ₽ · по понедельникам</span>
            </div>
          </div>
        </div>
      </section>

      <TarifyPrivatePractice />
      <TarifyFaq />

      <DokFooter />

      <TarifyModal modalOpen={modalOpen} modalPlan={modalPlan} onClose={closeModal} />
    </div>
  );
}