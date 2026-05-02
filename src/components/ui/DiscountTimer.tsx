import { useDiscountTimer } from "@/hooks/useDiscountTimer";

interface DiscountTimerProps {
  oldPrice: string;
  newPrice: string;
  accent?: string;
  size?: "sm" | "md" | "lg";
}

export default function DiscountTimer({
  oldPrice,
  newPrice,
  accent = "hsl(185, 85%, 32%)",
  size = "md",
}: DiscountTimerProps) {
  const { isActive, formatted } = useDiscountTimer();

  const priceSizes = {
    sm: { old: 13, new: 16, timer: 11 },
    md: { old: 16, new: 22, timer: 12 },
    lg: { old: 20, new: 32, timer: 13 },
  };
  const s = priceSizes[size];

  if (!isActive) {
    return (
      <span style={{ fontSize: s.new, fontWeight: 700, color: "#1a1a1a" }}>
        {oldPrice}
      </span>
    );
  }

  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: 2 }}>
      <span style={{ display: "inline-flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: s.old, color: "#aaa", textDecoration: "line-through", fontWeight: 400 }}>
          {oldPrice}
        </span>
        <span style={{ fontSize: s.new, fontWeight: 700, color: accent }}>
          {newPrice}
        </span>
      </span>
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: s.timer,
        color: "#fff",
        background: "#e53935",
        borderRadius: 6,
        padding: "2px 8px",
        fontWeight: 600,
        letterSpacing: 0.5,
        width: "fit-content",
      }}>
        <span style={{ opacity: 0.85 }}>⏱</span>
        Скидка сгорит через {formatted}
      </span>
    </span>
  );
}
