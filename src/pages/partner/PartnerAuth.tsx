import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { partnerRequest, partnerSession } from "./api";
import { TEAL, DARK, GRAY } from "./data";
import { Btn, Notice, card, inputCss } from "./ui";

const lnk: React.CSSProperties = { color: "#0F766E", fontWeight: 600 };

function Check({ value, onChange, children }: { value: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: GRAY, lineHeight: 1.5, cursor: "pointer" }}>
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} style={{ marginTop: 3, accentColor: TEAL, flexShrink: 0 }} />
      <span>{children}</span>
    </label>
  );
}

export default function PartnerAuth({ onDone }: { onDone: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [f, setF] = useState({ business_name: "", contact_name: "", email: "", password: "", consent_rules: false, consent_privacy: false, consent_offer: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string | boolean) => setF(p => ({ ...p, [k]: v }));
  const allChecked = f.consent_rules && f.consent_privacy && f.consent_offer;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register" && !allChecked) { setError("Для создания кабинета отметьте все три согласия"); return; }
    setBusy(true); setError("");
    try {
      const res = await partnerRequest<{ session: string }>(mode, { body: f, session: "" });
      partnerSession.set(res.session);
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 60%, #060B16 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <Link to="/" style={{ display: "block", textAlign: "center", color: "#fff", textDecoration: "none", fontFamily: "'Cormorant Garamond', serif", fontSize: 26, marginBottom: 18 }}>Промт Диалог</Link>
        <div style={{ ...card, padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#0F766E", fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
            <Icon name="Handshake" size={15} /> Партнёрская программа
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, margin: "0 0 8px", color: DARK }}>
            {mode === "register" ? "Станьте партнёром" : "Вход для партнёров"}
          </h1>
          <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.6, margin: "0 0 18px" }}>
            {mode === "register"
              ? "Расскажите о своей услуге. ИИ предложит её пользователям платформы, когда она действительно решает их задачу. Участие бесплатное."
              : "Войдите, чтобы управлять предложениями и подтверждать размещение."}
          </p>
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            {mode === "register" && (<>
              <input style={inputCss} placeholder="Название организации или ваше имя" value={f.business_name} onChange={e => set("business_name", e.target.value)} maxLength={255} />
              <input style={inputCss} placeholder="Контактное лицо" value={f.contact_name} onChange={e => set("contact_name", e.target.value)} maxLength={255} />
            </>)}
            <input style={inputCss} type="email" placeholder="Email" value={f.email} onChange={e => set("email", e.target.value)} autoComplete="email" />
            <input style={inputCss} type="password" placeholder={mode === "register" ? "Пароль, не короче 8 символов" : "Пароль"} value={f.password} onChange={e => set("password", e.target.value)} autoComplete={mode === "register" ? "new-password" : "current-password"} />
            {mode === "register" && (
              <div style={{ display: "grid", gap: 10, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 14px" }}>
                <Check value={f.consent_rules} onChange={v => set("consent_rules", v)}>
                  Прочитал и принимаю <a href="/partner/rules" target="_blank" rel="noopener noreferrer" style={lnk}>Правила партнёрской программы</a>: раз в 14 дней публикую материал о «Промт Диалог», а все предложения проходят модерацию
                </Check>
                <Check value={f.consent_privacy} onChange={v => set("consent_privacy", v)}>
                  Ознакомлен с <a href="/privacy" target="_blank" rel="noopener noreferrer" style={lnk}>Политикой конфиденциальности</a> и даю согласие на обработку моих персональных данных
                </Check>
                <Check value={f.consent_offer} onChange={v => set("consent_offer", v)}>
                  Принимаю <a href="/offer" target="_blank" rel="noopener noreferrer" style={lnk}>Договор-оферту</a>, включая раздел 18 «Партнёрская программа»: участие бесплатное, рекомендации не являются рекламой
                </Check>
              </div>
            )}
            {error && <Notice kind="error">{error}</Notice>}
            <Btn type="submit" disabled={busy || (mode === "register" && !allChecked)} full>{busy ? "Подождите…" : mode === "register" ? "Создать кабинет" : "Войти"}</Btn>
          </form>
          {mode === "register" && <div style={{ textAlign: "center", marginTop: 14, fontSize: 13 }}><a href="/partner/rules" target="_blank" rel="noopener noreferrer" style={lnk}>Как работает программа и какие правила</a></div>}
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: GRAY }}>
            {mode === "register" ? "Уже есть кабинет? " : "Ещё нет кабинета? "}
            <button onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(""); }} style={{ background: "none", border: "none", color: "#0F766E", fontWeight: 700, cursor: "pointer", fontSize: 14, padding: 0 }}>
              {mode === "register" ? "Войти" : "Зарегистрироваться"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
