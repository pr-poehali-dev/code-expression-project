import { useState } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { lkApi } from "@/lib/lkApi";
import Icon from "@/components/ui/icon";
import { getRoleLabel } from "./LkDashboardTypes";

const ACCENT = "hsl(185,85%,32%)";
const SERIF = "'Cormorant Garamond', serif";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 8,
  border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none",
  fontFamily: "Montserrat, sans-serif", boxSizing: "border-box",
  background: "#fff", color: "#0F172A", transition: "border-color 0.2s",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "28px 28px 24px", marginBottom: 16, boxShadow: "0 1px 3px rgba(15,23,42,0.05)", border: "1px solid #E8ECF0" }}>
      <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "#0F172A", margin: "0 0 20px" }}>{title}</h2>
      {children}
    </div>
  );
}

function SuccessMsg({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "hsl(145,60%,96%)", border: "1px solid hsl(145,60%,78%)", borderRadius: 8, padding: "10px 14px", marginTop: 14, fontSize: 13, color: "hsl(145,60%,30%)", fontWeight: 600 }}>
      <Icon name="CheckCircle" size={15} />
      {text}
    </div>
  );
}

function ErrorMsg({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff0f0", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginTop: 14, fontSize: 13, color: "#dc2626" }}>
      <Icon name="AlertCircle" size={15} />
      {text}
    </div>
  );
}

export default function LkProfile() {
  const { user, refreshUser } = useLkAuth();

  // Данные аккаунта
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notifEmail, setNotifEmail] = useState((user as Record<string, unknown>)?.notification_email as string || "");
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Смена пароля
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInfo(true); setInfoMsg(null);
    try {
      await lkApi.profileUpdate(fullName, email, notifEmail || undefined);
      await refreshUser();
      setInfoMsg({ ok: true, text: "Данные успешно обновлены" });
    } catch (err) {
      setInfoMsg({ ok: false, text: err instanceof Error ? err.message : "Ошибка сохранения" });
    } finally { setSavingInfo(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { setPwMsg({ ok: false, text: "Пароли не совпадают" }); return; }
    if (newPw.length < 6) { setPwMsg({ ok: false, text: "Минимум 6 символов" }); return; }
    setSavingPw(true); setPwMsg(null);
    try {
      await lkApi.changePassword(currentPw, newPw);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setPwMsg({ ok: true, text: "Пароль успешно изменён" });
    } catch (err) {
      setPwMsg({ ok: false, text: err instanceof Error ? err.message : "Ошибка смены пароля" });
    } finally { setSavingPw(false); }
  };

  return (
    <div style={{ maxWidth: 600 }}>

      {/* Шапка */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: SERIF, fontSize: "clamp(22px,3vw,30px)", fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px" }}>
          Мой профиль
        </h1>
        <p style={{ fontSize: 13, color: "#999", margin: 0 }}>
          Управляйте данными вашего аккаунта
        </p>
      </div>

      {/* Карточка пользователя */}
      <div style={{ background: `linear-gradient(135deg, hsl(185,85%,32%), hsl(185,85%,24%))`, borderRadius: 16, padding: "22px 24px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: SERIF }}>
          {(user?.full_name || user?.username || "?")[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{user?.full_name || user?.username}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{user?.email}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{getRoleLabel(user?.role || "", user?.specialization)} · @{user?.username}</div>
        </div>
      </div>

      {/* Данные аккаунта */}
      <Section title="Данные аккаунта">
        <form onSubmit={handleSaveInfo}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>
              Имя
            </label>
            <input
              value={fullName} onChange={e => setFullName(e.target.value)}
              placeholder="Иван Иванов" required style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = ACCENT}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#E2E8F0"}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>
              Email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="email@example.com" required style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = ACCENT}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#E2E8F0"}
            />
          </div>

          {infoMsg && (infoMsg.ok ? <SuccessMsg text={infoMsg.text} /> : <ErrorMsg text={infoMsg.text} />)}

          <button type="submit" disabled={savingInfo} style={{
            marginTop: 18, padding: "11px 28px", borderRadius: 10, border: "none",
            background: savingInfo ? "#ccc" : `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,24%))`,
            color: "#fff", fontSize: 14, fontWeight: 600, cursor: savingInfo ? "not-allowed" : "pointer",
            fontFamily: "Montserrat, sans-serif", display: "flex", alignItems: "center", gap: 8,
          }}>
            {savingInfo ? <><Icon name="Loader" size={15} style={{ animation: "spin 1s linear infinite" }} /> Сохраняю...</> : <><Icon name="Save" size={15} /> Сохранить</>}
          </button>
        </form>
      </Section>

      {/* Смена пароля */}
      <Section title="Смена пароля">
        <form onSubmit={handleChangePassword}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#777", display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>
              Текущий пароль
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showCurrent ? "text" : "password"} value={currentPw}
                onChange={e => setCurrentPw(e.target.value)} required
                placeholder="Введите текущий пароль"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = ACCENT}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#e8e8e4"}
              />
              <button type="button" onClick={() => setShowCurrent(p => !p)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 4 }}>
                <Icon name={showCurrent ? "EyeOff" : "Eye"} size={16} />
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#777", display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>
              Новый пароль
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showNew ? "text" : "password"} value={newPw}
                onChange={e => setNewPw(e.target.value)} required minLength={6}
                placeholder="Минимум 6 символов"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = ACCENT}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#e8e8e4"}
              />
              <button type="button" onClick={() => setShowNew(p => !p)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 4 }}>
                <Icon name={showNew ? "EyeOff" : "Eye"} size={16} />
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#777", display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>
              Повторите новый пароль
            </label>
            <input
              type="password" value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)} required
              placeholder="Повторите пароль"
              style={{ ...inputStyle, borderColor: confirmPw && confirmPw !== newPw ? "#fca5a5" : "#e8e8e4" }}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = ACCENT}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = confirmPw && confirmPw !== newPw ? "#fca5a5" : "#e8e8e4"}
            />
            {confirmPw && confirmPw !== newPw && (
              <div style={{ fontSize: 12, color: "#ef4444", marginTop: 5 }}>Пароли не совпадают</div>
            )}
          </div>

          {pwMsg && (pwMsg.ok ? <SuccessMsg text={pwMsg.text} /> : <ErrorMsg text={pwMsg.text} />)}

          <button type="submit" disabled={savingPw} style={{
            marginTop: 18, padding: "11px 28px", borderRadius: 10, border: "none",
            background: savingPw ? "#ccc" : `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,24%))`,
            color: "#fff", fontSize: 14, fontWeight: 600, cursor: savingPw ? "not-allowed" : "pointer",
            fontFamily: "Montserrat, sans-serif", display: "flex", alignItems: "center", gap: 8,
          }}>
            {savingPw ? <><Icon name="Loader" size={15} style={{ animation: "spin 1s linear infinite" }} /> Меняю...</> : <><Icon name="Lock" size={15} /> Изменить пароль</>}
          </button>
        </form>
      </Section>

      {/* Email для заявок с лендинга */}
      <div style={{ background: "linear-gradient(135deg, hsl(185,85%,97%), hsl(185,85%,93%))", border: "1.5px solid hsl(185,85%,75%)", borderRadius: 16, padding: "22px 24px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Icon name="Mail" size={18} style={{ color: ACCENT }} />
          <h2 style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: "#0F172A", margin: 0 }}>Куда приходят заявки с лендинга</h2>
        </div>
        <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 14px", lineHeight: 1.5 }}>
          Когда посетитель вашего сайта заполнит форму — заявка придёт на этот email.
          Если оставите пустым, заявки пойдут на основной email аккаунта.
        </p>
        <input
          type="email" value={notifEmail} onChange={e => setNotifEmail(e.target.value)}
          placeholder={email || "email@example.com"}
          style={{ ...inputStyle, marginBottom: 12 }}
          onFocus={e => (e.target as HTMLInputElement).style.borderColor = ACCENT}
          onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#E2E8F0"}
        />
        <button
          onClick={async () => {
            setSavingInfo(true); setInfoMsg(null);
            try {
              await lkApi.profileUpdate(fullName, email, notifEmail || undefined);
              await refreshUser();
              setInfoMsg({ ok: true, text: "Email для заявок сохранён" });
            } catch (err) {
              setInfoMsg({ ok: false, text: err instanceof Error ? err.message : "Ошибка сохранения" });
            } finally { setSavingInfo(false); }
          }}
          disabled={savingInfo}
          style={{
            padding: "10px 24px", borderRadius: 10, border: "none",
            background: savingInfo ? "#ccc" : `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,24%))`,
            color: "#fff", fontSize: 14, fontWeight: 600, cursor: savingInfo ? "not-allowed" : "pointer",
            fontFamily: "Montserrat, sans-serif", display: "inline-flex", alignItems: "center", gap: 8,
          }}
        >
          <Icon name="Save" size={15} /> Сохранить
        </button>
        {infoMsg && <div style={{ marginTop: 10 }}>{infoMsg.ok ? <SuccessMsg text={infoMsg.text} /> : <ErrorMsg text={infoMsg.text} />}</div>}
      </div>

      {/* Инфо об аккаунте */}
      <Section title="Информация об аккаунте">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Логин", value: `@${user?.username}` },
            { label: "Роль", value: getRoleLabel(user?.role || "", user?.specialization) },
            { label: "Сегмент", value: user?.segment === "salon" ? "Салон красоты" : "Специалист" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f5f5f2" }}>
              <span style={{ fontSize: 13, color: "#999" }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{row.value}</span>
            </div>
          ))}
        </div>
      </Section>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}