import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, DARK } from "./ReviewsShared";

const BASE_PRICE_PER_ENERGY = 990 / 150;

const PACKAGES = [
  { name: "Старт", price: 990, energy: 150, desc: "Чтобы попробовать", features: ["Все инструменты", "Техническая поддержка"], popular: false },
  { name: "Бизнес", price: 2990, energy: 550, desc: "Для частой работы", features: ["Все инструменты", "Приоритетная поддержка"], popular: true },
  { name: "Рост", price: 4990, energy: 1200, desc: "Для постоянной работы", features: ["Все инструменты", "Приоритетная поддержка"], popular: false },
  { name: "Премиум", price: 9990, energy: 3000, desc: "Самая низкая цена энергии", features: ["Все инструменты", "VIP-поддержка", "Личный менеджер"], popular: false },
].map((p) => ({
  ...p,
  perEnergy: p.price / p.energy,
  saving: Math.round((1 - p.price / p.energy / BASE_PRICE_PER_ENERGY) * 100),
}));

const fmt = (n: number) => n.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function ReviewsPackages() {
  return (
    <section style={{ padding: "64px 0 100px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Zap" size={14} style={{ color: ACCENT }} />
          </div>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: "#fff" }}>Тарифы</span>
        </div>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 640, margin: "0 0 36px" }}>
          Подписки нет: после регистрации платформа бесплатна, а за инструменты вы платите энергией. Запрос стоит от 3,3 ₽, купленная энергия не сгорает и возвращается при сбое.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }} className="rev-pack-grid">
          {PACKAGES.map((p) => (
            <div key={p.name} style={{
              background: p.popular ? "rgba(45,212,191,0.07)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${p.popular ? "rgba(45,212,191,0.4)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 18, padding: "24px 20px", display: "flex", flexDirection: "column",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#fff" }}>{p.name}</span>
                {p.popular && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, border: "1px solid rgba(45,212,191,0.4)", borderRadius: 20, padding: "2px 10px" }}>Популярный</span>
                )}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 16 }}>{p.desc}</div>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: 34, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>
                {p.price.toLocaleString("ru-RU")} ₽
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "8px 0 4px" }}>{p.energy.toLocaleString("ru-RU")} энергии</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", marginBottom: 18 }}>
                {fmt(p.perEnergy)} ₽ за энергию{p.saving > 0 ? `, выгода ${p.saving}%` : ""}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {p.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "rgba(255,255,255,0.75)" }}>
                    <Icon name="Check" size={14} style={{ color: ACCENT, flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32 }}>
          <Link to="/tseny" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 2,
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`, color: DARK,
            fontSize: 14, fontWeight: 600, textDecoration: "none",
          }}>
            Подробнее о тарифах
            <Icon name="ArrowRight" size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
