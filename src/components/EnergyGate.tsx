import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const PACKAGES = [
  { name: "Старт", price: 990, energy: 150, popular: false },
  { name: "Бизнес", price: 2990, energy: 550, popular: true },
  { name: "Рост", price: 4990, energy: 1200, popular: false },
  { name: "Премиум", price: 9990, energy: 3000, popular: false },
];

interface EnergyGateEvent {
  message: string;
  noSalon?: boolean;
}

// Глобальный эмиттер — вызывается из lkApi при 402
let _show: ((e: EnergyGateEvent) => void) | null = null;

export function showEnergyGate(e: EnergyGateEvent) {
  if (_show) _show(e);
}

export default function EnergyGate() {
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState<EnergyGateEvent | null>(null);

  useEffect(() => {
    _show = (e) => { setEvent(e); setOpen(true); };
    return () => { _show = null; };
  }, []);

  if (!open || !event) return null;

  const close = () => setOpen(false);
  const noSalon = event.noSalon;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, fontFamily: "Inter, sans-serif",
    }} onClick={close}>
      <div style={{
        background: "#fff", borderRadius: 8, maxWidth: 620, width: "100%",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${DARK}, #112B3C)`, padding: "32px 32px 28px", position: "relative" }}>
          <button onClick={close} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: 4 }}>
            <Icon name="X" size={20} />
          </button>

          {noSalon ? (
            <>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon name="Building2" size={24} style={{ color: TEAL }} />
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: "#fff", margin: "0 0 8px" }}>
                Сначала создайте профиль салона
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.6 }}>
                Инструменты платформы привязаны к вашему салону. Заполните профиль и получите 100 энергий в подарок.
              </p>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="Zap" size={24} style={{ color: TEAL }} />
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontFamily: SERIF, fontSize: 38, fontWeight: 600, color: TEAL, lineHeight: 1 }}>0</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>энергий</span>
                </div>
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: "#fff", margin: "0 0 8px" }}>
                Баланс энергий исчерпан
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.6 }}>
                {event.message}
              </p>
            </>
          )}
        </div>

        <div style={{ padding: "28px 32px" }}>
          {noSalon ? (
            <div style={{ textAlign: "center" }}>
              <Link to="/cabinet" onClick={close} style={{
                display: "inline-block", padding: "14px 40px", borderRadius: 4,
                background: `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
                color: DARK, fontSize: 15, fontWeight: 600, textDecoration: "none",
              }}>
                Создать профиль салона →
              </Link>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: GRAY, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 16 }}>
                Выберите пакет энергий
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {PACKAGES.map((pkg) => (
                  <div key={pkg.name} style={{
                    border: `1.5px solid ${pkg.popular ? TEAL : "#E2E8F0"}`,
                    borderRadius: 6, padding: "16px",
                    background: pkg.popular ? "rgba(45,212,191,0.04)" : "#fff",
                    position: "relative",
                  }}>
                    {pkg.popular && (
                      <div style={{ position: "absolute", top: -1, right: 12, background: TEAL, color: DARK, fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: "0 0 6px 6px", letterSpacing: "1px" }}>
                        ПОПУЛЯРНЫЙ
                      </div>
                    )}
                    <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 4 }}>{pkg.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                      <Icon name="Zap" size={14} style={{ color: TEAL }} />
                      <span style={{ fontSize: 16, fontWeight: 700, color: TEAL }}>{pkg.energy.toLocaleString()}</span>
                      <span style={{ fontSize: 12, color: GRAY }}>энергий</span>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: DARK, fontFamily: SERIF }}>{pkg.price.toLocaleString()} ₽</div>
                    <button disabled style={{ marginTop: 12, width: "100%", padding: "9px", borderRadius: 4, border: "none", background: "#F1F5F9", color: GRAY, fontSize: 12, fontWeight: 600, cursor: "not-allowed", fontFamily: "Inter, sans-serif" }}>
                      Скоро
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ background: "#F8FAFC", borderRadius: 6, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="Info" size={16} style={{ color: GRAY, flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 13, color: GRAY, lineHeight: 1.5, fontWeight: 300 }}>
                  Оплата через ЮKassa появится в ближайшее время. Следите за обновлениями в кабинете.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
