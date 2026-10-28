import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import func2url from "../../../backend/func2url.json";

const URL_ = (func2url as Record<string, string>)["partner-api"] || "";
const PRESENTATION = "https://drive.google.com/uc?export=download&id=1hk1SYzwpmscgL9s6nGF-zwxm5fUMEgoX";
const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";
const MAX = 200;

const input: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "13px 15px", borderRadius: 10, border: "1px solid #CBD5E1",
  fontSize: 15, fontFamily: "inherit", color: DARK, background: "#fff", outline: "none",
};
const label: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 6 };

export default function ContactSection() {
  const [f, setF] = useState({ name: "", site_url: "", email: "", phone: "", message: "" });
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) { setError("Подтвердите согласие с политикой конфиденциальности"); return; }
    setBusy(true); setError("");
    try {
      const res = await fetch(`${URL_}?action=inquiry`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, consent_privacy: true }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Не удалось отправить. Попробуйте еще раз");
      setDone(true);
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <section style={{ background: "#F8FAFC", padding: "92px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 48, alignItems: "start" }} className="pl-contact">
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0F766E", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 14 }}>Остались вопросы</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.12 }}>Готовы обсудить партнерство?</h2>
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.75, fontWeight: 300, margin: "0 0 28px" }}>
            Оставьте контакты и коротко опишите вопрос. Мы свяжемся с вами и все расскажем.
          </p>
          <div style={{ background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 70%)`, borderRadius: 18, padding: "26px 26px 28px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-40%", right: "-15%", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.2) 0%, transparent 65%)" }} />
            <div style={{ position: "relative" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon name="FileDown" size={24} style={{ color: DARK }} />
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 26, color: "#fff", fontWeight: 600, marginBottom: 8, lineHeight: 1.15 }}>Презентация программы</div>
              <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, fontWeight: 300, margin: "0 0 20px" }}>Условия, механика рекомендаций и этапы участия в одном файле.</p>
              <a href={PRESENTATION} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 26px", borderRadius: 10, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
                <Icon name="Download" size={18} />Скачать презентацию
              </a>
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 20, padding: "32px 30px", boxShadow: "0 20px 50px rgba(15,23,42,0.07)" }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                <Icon name="Check" size={32} style={{ color: "#0F766E" }} />
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 28, color: DARK, fontWeight: 600, marginBottom: 8 }}>Спасибо, заявка отправлена</div>
              <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.65, margin: 0 }}>Мы свяжемся с вами в ближайшее время.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
              <div>
                <label style={label}>Имя</label>
                <input style={input} required maxLength={150} value={f.name} onChange={e => set("name", e.target.value)} placeholder="Как к вам обращаться" autoComplete="name" />
              </div>
              <div>
                <label style={label}>Ссылка на сайт</label>
                <input style={input} required maxLength={300} value={f.site_url} onChange={e => set("site_url", e.target.value)} placeholder="https://" autoComplete="url" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="pl-contact-row">
                <div>
                  <label style={label}>Email</label>
                  <input style={input} required type="email" maxLength={255} value={f.email} onChange={e => set("email", e.target.value)} placeholder="name@mail.ru" autoComplete="email" />
                </div>
                <div>
                  <label style={label}>Телефон</label>
                  <input style={input} required type="tel" maxLength={40} value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="+7 900 000-00-00" autoComplete="tel" />
                </div>
              </div>
              <div>
                <label style={label}>Ваш вопрос</label>
                <textarea style={{ ...input, minHeight: 100, resize: "vertical" }} maxLength={MAX} value={f.message} onChange={e => set("message", e.target.value)} placeholder="Коротко опишите, что хотите обсудить" />
                <div style={{ textAlign: "right", fontSize: 12, color: f.message.length >= MAX ? "#B91C1C" : GRAY, marginTop: 4 }}>{f.message.length} / {MAX}</div>
              </div>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: GRAY, lineHeight: 1.5, cursor: "pointer" }}>
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ marginTop: 3, accentColor: TEAL, flexShrink: 0, width: 16, height: 16 }} />
                <span>Я согласен с <Link to="/privacy" target="_blank" style={{ color: "#0F766E", fontWeight: 600 }}>политикой конфиденциальности</Link> и обработкой персональных данных</span>
              </label>
              {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 10, padding: "10px 14px", fontSize: 13.5 }}>{error}</div>}
              <button type="submit" disabled={busy || !agree} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 28px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, fontSize: 16, fontWeight: 700, cursor: busy || !agree ? "not-allowed" : "pointer", opacity: busy || !agree ? 0.55 : 1, fontFamily: "inherit" }}>
                {busy ? "Отправляем..." : "Отправить заявку"}<Icon name="Send" size={17} />
              </button>
            </form>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .pl-contact { grid-template-columns: 1fr !important; gap: 32px !important; } }
        @media (max-width: 520px) { .pl-contact-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
