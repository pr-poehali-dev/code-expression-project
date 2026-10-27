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
  const resetToken = new URLSearchParams(window.location.search).get("reset") || "";
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "reset">(resetToken ? "reset" : "register");
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ business_name: "", contact_name: "", email: "", password: "", consent_rules: false, consent_privacy: false, consent_offer: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string | boolean) => setF(p => ({ ...p, [k]: v }));
  const allChecked = f.consent_rules && f.consent_privacy && f.consent_offer;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "forgot") {
      setBusy(true); setError("");
      try { await partnerRequest("password_forgot", { body: { email: f.email }, session: "" }); setSent(true); }
      catch (err) { setError((err as Error).message); }
      finally { setBusy(false); }
      return;
    }
    if (mode === "reset") {
      if (f.password.length < 8) { setError("Пароль должен быть не короче 8 символов"); return; }
      setBusy(true); setError("");
      try {
        const res = await partnerRequest<{ session: string }>("password_reset", { body: { token: resetToken, password: f.password }, session: "" });
        partnerSession.set(res.session);
        window.history.replaceState({}, "", window.location.pathname);
        onDone();
      } catch (err) { setError((err as Error).message); }
      finally { setBusy(false); }
      return;
    }
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
            <Icon name="Handshake" size={15} /> Партнерская программа
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, margin: "0 0 8px", color: DARK }}>
            {mode === "register" ? "Станьте партнером" : mode === "forgot" ? "Восстановление пароля" : mode === "reset" ? "Новый пароль" : "Вход для партнеров"}
          </h1>
          <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.6, margin: "0 0 18px" }}>
            {mode === "register"
              ? "Расскажите о своей услуге. ИИ предложит ее пользователям платформы, когда она действительно решает их задачу. Участие бесплатное."
              : mode === "forgot" ? "Укажите email, на который зарегистрирован кабинет. Мы отправим ссылку для создания нового пароля."
              : mode === "reset" ? "Придумайте новый пароль для входа в кабинет."
              : "Войдите, чтобы управлять предложениями и отправлять размещение на проверку."}
          </p>
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            {mode === "register" && (<>
              <input style={inputCss} placeholder="Название организации или ваше имя" value={f.business_name} onChange={e => set("business_name", e.target.value)} maxLength={255} />
              <input style={inputCss} placeholder="Контактное лицо" value={f.contact_name} onChange={e => set("contact_name", e.target.value)} maxLength={255} />
            </>)}
            {mode !== "reset" && <input style={inputCss} type="email" placeholder="Email" value={f.email} onChange={e => set("email", e.target.value)} autoComplete="email" />}
            {mode !== "forgot" && <input style={inputCss} type="password" placeholder={mode === "reset" ? "Новый пароль, не короче 8 символов" : mode === "register" ? "Пароль, не короче 8 символов" : "Пароль"} value={f.password} onChange={e => set("password", e.target.value)} autoComplete={mode === "register" || mode === "reset" ? "new-password" : "current-password"} />}
            {mode === "login" && <button type="button" onClick={() => { setMode("forgot"); setError(""); setSent(false); }} style={{ background: "none", border: "none", color: "#0F766E", fontWeight: 600, cursor: "pointer", fontSize: 13.5, padding: 0, textAlign: "left" }}>Забыли пароль?</button>}
            {mode === "register" && (
              <div style={{ display: "grid", gap: 10, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 14px" }}>
                <Check value={f.consent_rules} onChange={v => set("consent_rules", v)}>
                  Прочитал и принимаю <a href="/partner/rules" target="_blank" rel="noopener noreferrer" style={lnk}>Правила партнерской программы</a>: один раз публикую материал о «Промт Диалог» для запуска показов, а все предложения проходят модерацию
                </Check>
                <Check value={f.consent_privacy} onChange={v => set("consent_privacy", v)}>
                  Ознакомлен с <a href="/privacy" target="_blank" rel="noopener noreferrer" style={lnk}>Политикой конфиденциальности</a> и даю согласие на обработку моих персональных данных
                </Check>
                <Check value={f.consent_offer} onChange={v => set("consent_offer", v)}>
                  Принимаю <a href="/offer" target="_blank" rel="noopener noreferrer" style={lnk}>Договор-оферту</a>, включая раздел 18 «Партнерская программа»: участие бесплатное, рекомендации не являются рекламой
                </Check>
              </div>
            )}
            {sent && mode === "forgot" && <Notice kind="success">Если кабинет с таким email есть, мы отправили на него письмо со ссылкой. Она действует 1 час. Проверьте также папку «Спам».</Notice>}
            {error && <Notice kind="error">{error}</Notice>}
            <Btn type="submit" disabled={busy || (mode === "register" && !allChecked) || (mode === "forgot" && !f.email)} full>{busy ? "Подождите…" : mode === "register" ? "Создать кабинет" : mode === "forgot" ? "Отправить ссылку" : mode === "reset" ? "Сохранить пароль и войти" : "Войти"}</Btn>
          </form>
          {mode === "register" && <div style={{ textAlign: "center", marginTop: 14, fontSize: 13 }}><a href="/partner/rules" target="_blank" rel="noopener noreferrer" style={lnk}>Как работает программа и какие правила</a></div>}
          {(mode === "forgot" || mode === "reset") ? (
            <div style={{ textAlign: "center", marginTop: 16, fontSize: 14 }}>
              <button onClick={() => { setMode("login"); setError(""); setSent(false); }} style={{ background: "none", border: "none", color: "#0F766E", fontWeight: 700, cursor: "pointer", fontSize: 14, padding: 0 }}>Вернуться ко входу</button>
            </div>
          ) : (
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: GRAY }}>
            {mode === "register" ? "Уже есть кабинет? " : "Еще нет кабинета? "}
            <button onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(""); }} style={{ background: "none", border: "none", color: "#0F766E", fontWeight: 700, cursor: "pointer", fontSize: 14, padding: 0 }}>
              {mode === "register" ? "Войти" : "Зарегистрироваться"}
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
