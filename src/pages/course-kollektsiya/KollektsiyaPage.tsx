import { useDiscountTimer } from "@/hooks/useDiscountTimer";
import { RETAIL_PRICE, DISCOUNT_PRICE, BUY_URL_RETAIL, BUY_URL_DISCOUNT } from "./KollektsiyaShared";
import KollektsiyaHero from "./KollektsiyaHero";
import KollektsiyaContent from "./KollektsiyaContent";
import KollektsiyaCta from "./KollektsiyaCta";

export default function KollektsiyaPage() {
  const { isActive } = useDiscountTimer();
  const buyUrl = isActive ? BUY_URL_DISCOUNT : BUY_URL_RETAIL;
  const currentPrice = isActive ? DISCOUNT_PRICE : RETAIL_PRICE;

  return (
    <div style={{ background: "#f8f8f6", minHeight: "100vh", paddingTop: 80 }}>
      <style>{`
        .koll-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .koll-courses-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .koll-outcomes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media (max-width: 900px) {
          .koll-hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .koll-courses-grid { grid-template-columns: repeat(2, 1fr); }
          .koll-outcomes-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .koll-courses-grid { grid-template-columns: 1fr; }
          .koll-outcomes-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <KollektsiyaHero isActive={isActive} buyUrl={buyUrl} currentPrice={currentPrice} />
      <KollektsiyaContent />
      <KollektsiyaCta isActive={isActive} buyUrl={buyUrl} />
    </div>
  );
}
