import { useState } from "react";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";
import TarifyPlans from "./tarify/TarifyPlans";
import { TarifyPrivatePractice, TarifyFaq, TarifyModal } from "./tarify/TarifyExtras";

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
        }
      `}</style>
      <DokNavbar />

      <TarifyPlans onOpenModal={openModal} />
      <TarifyPrivatePractice />
      <TarifyFaq />

      <DokFooter />

      <TarifyModal modalOpen={modalOpen} modalPlan={modalPlan} onClose={closeModal} />
    </div>
  );
}
