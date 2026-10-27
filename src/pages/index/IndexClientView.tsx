import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const CLIENTS = [
  { n: 1, title: "Мне важно доверие", tag: "Потенциальный интерес", bg: "rgba(16,185,129,0.16)", color: "#34D399", quote: "Почему я должна доверить свое тело именно вам?" },
  { n: 2, title: "Я ценю свое время", tag: "Недостаточно информации", bg: "rgba(245,158,11,0.16)", color: "#FBBF24", quote: "Шесть тысяч за час. Как записаться?" },
  { n: 3, title: "Я сравниваю варианты", tag: "Высокий риск отказа", bg: "rgba(239,68,68,0.16)", color: "#F87171", quote: "За что здесь доплачивать? Рядом дешевле." },
];

const POINTS = [
  "Три клиента оценивают вашу услугу, цену или рекламу",
  "Видно, что привлекает, что смущает и что менять",
  "Можно задать вопрос клиентам и сравнить версии текста",
];

function openClientView() {
  try { sessionStorage.setItem("lk_tab", "clientview"); } catch { /* ignore */ }
}

export function IndexClientView() {
  return (
    <section id="client-view" style={{ background: "#fff", padding: "96px 24px" }}>
      <div className="icv-card" style={{
        maxWidth: 1240, margin: "0 auto", borderRadius: 24, overflow: "hidden", position: "relative",
        background: `radial-gradient(120% 120% at 15% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        padding: "64px 56px", display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 48, alignItems: "center",
        boxShadow: "0 24px 70px rgba(15,23,42,0.22)",
      }}>
        <div style={{ position: "absolute", top: "-20%", right: "-8%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.16) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ position: "relative" }}>
          <span style={{ display: "inline-block", background: TEAL, color: DARK, fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", padding: "7px 16px", borderRadius: 100, marginBottom: 24 }}>
            Начните с этого
          </span>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4.4vw,56px)", fontWeight: 500, color: "#fff", lineHeight: 1.06, margin: "0 0 18px", letterSpacing: "-0.5px" }}>
            Покажи глазами клиента
          </h2>
          <p style={{ fontSize: "clamp(15px,1.5vw,17px)", color: "rgba(255,255,255,0.72)", lineHeight: 1.7, margin: "0 0 22px", fontWeight: 300 }}>
            Проверьте предложение до запуска рекламы, чтобы не тратить деньги на неподходящий маркетинг.
          </p>
          <ul style={{ listStyle: "none", margin: "0 0 32px", padding: 0, display: "grid", gap: 12 }}>
            {POINTS.map(p => (
              <li key={p} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.55 }}>
                <Icon name="Check" size={18} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="icv-actions" style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Link to="/cabinet" onClick={openClientView} style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 32px", borderRadius: 2,
              background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, fontSize: 15, fontWeight: 700, textDecoration: "none",
            }}>
              Попробовать инструмент <Icon name="ArrowRight" size={16} />
            </Link>
            <Link to="/instrumenty/client-view" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 28px", borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none",
            }}>
              Подробнее <Icon name="ArrowRight" size={15} />
            </Link>
          </div>
        </div>

        <div style={{ position: "relative", display: "grid", gap: 12 }}>
          {CLIENTS.map(c => (
            <div key={c.n} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: "#fff" }}>{c.title}</div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: c.bg, color: c.color }}>{c.tag}</span>
              </div>
              <div style={{ fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,0.78)", lineHeight: 1.55, borderLeft: `3px solid ${TEAL}`, paddingLeft: 12 }}>«{c.quote}»</div>
            </div>
          ))}
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
            Пример для массажной студии. Клиенты условные, это не реальные люди.
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 960px) {
          .icv-card { grid-template-columns: 1fr !important; padding: 44px 28px !important; gap: 36px !important; }
        }
        @media (max-width: 520px) {
          #client-view { padding: 56px 16px !important; }
          .icv-card { padding: 36px 20px !important; border-radius: 18px !important; }
          .icv-actions { flex-direction: column; }
          .icv-actions > a { width: 100%; box-sizing: border-box; }
        }
      `}</style>
    </section>
  );
}

