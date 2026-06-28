import { useState, useEffect } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { saveSession } from "@/lib/lkApi";
import Icon from "@/components/ui/icon";

const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";

interface InviteInfo {
  full_name: string;
  role_code: string;
  role_label: string;
  salon_name: string;
  salon_logo: string | null;
  expires_at: string;
}

const inp: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 10,
  border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "Montserrat,sans-serif",
  background: "#fff", boxSizing: "border-box", color: "#0F172A", outline: "none",
};

export default function LkJoinPage() {
  const token = new URLSearchParams(window.location.search).get("token") ||
    window.location.pathname.split("/join/")[1]?.split("?")[0] || "";

  const { user } = useLkAuth();

  const [invite, setInvite]     = useState<InviteInfo | null>(null);
  const [loadErr, setLoadErr]   = useState("");
  const [loading, setLoading]   = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState("");
  const [done, setDone]         = useState(false);

  useEffect(() => {
    if (!token) { setLoadErr("Ссылка приглашения недействительна."); setLoading(false); return; }
    fetch(`${LK_URL}?action=invite_info&token=${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setLoadErr(d.error);
        else setInvite(d);
      })
      .catch(() => setLoadErr("Ошибка загрузки приглашения"))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) { setError("Введите логин"); return; }
    if (password.length < 6) { setError("Пароль не менее 6 символов"); return; }
    setSubmitting(true); setError("");
    try {
      const r = await fetch(`${LK_URL}?action=invite_accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, username: username.trim().toLowerCase(), password }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Ошибка"); return; }
      saveSession(d.session_id);
      setDone(true);
      setTimeout(() => { window.location.href = "/cabinet"; }, 1500);
    } catch { setError("Ошибка соединения"); }
    finally { setSubmitting(false); }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f0" }}>
      <Icon name="Loader" size={28} style={{ color: ACCENT, animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f0", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
      <div style={{ width: "100%", maxWidth: 420, animation: "fadeIn 0.4s ease" }}>

        {/* Лого */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: ACCENT, letterSpacing: -0.5 }}>Промт Диалог</div>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>

          {loadErr ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "hsl(0,75%,97%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon name="AlertCircle" size={28} style={{ color: "hsl(0,75%,55%)" }} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Приглашение недействительно</div>
              <div style={{ fontSize: 13, color: "#888" }}>{loadErr}</div>
              <a href="/cabinet" style={{ display: "inline-block", marginTop: 20, fontSize: 13, color: ACCENT, fontWeight: 600 }}>Войти в кабинет →</a>
            </div>
          ) : done ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "hsl(145,60%,96%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon name="CheckCircle2" size={28} style={{ color: "hsl(145,60%,35%)" }} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Добро пожаловать!</div>
              <div style={{ fontSize: 13, color: "#888" }}>Перенаправляем в кабинет...</div>
            </div>
          ) : invite && (
            <>
              {/* Карточка салона */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#f8f8f5", borderRadius: 14, marginBottom: 24 }}>
                {invite.salon_logo ? (
                  <img src={invite.salon_logo} alt="" style={{ width: 44, height: 44, borderRadius: 11, objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: `hsla(185,85%,32%,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="Building2" size={20} style={{ color: ACCENT }} />
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{invite.salon_name}</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>приглашает вас в команду</div>
                </div>
              </div>

              {/* Роль */}
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>
                  {invite.full_name}
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `hsla(185,85%,32%,0.08)`, borderRadius: 8, padding: "5px 14px" }}>
                  <Icon name="BadgeCheck" size={14} style={{ color: ACCENT }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{invite.role_label}</span>
                </div>
              </div>

              {/* Форма */}
              <form onSubmit={handleAccept}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#777", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>Придумайте логин</label>
                  <input style={inp} value={username} onChange={e => setUsername(e.target.value)}
                    placeholder="например: anna_master" autoComplete="username" />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#777", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>Пароль</label>
                  <div style={{ position: "relative" }}>
                    <input style={{ ...inp, paddingRight: 44 }} type={showPw ? "text" : "password"}
                      value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="минимум 6 символов" autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                      <Icon name={showPw ? "EyeOff" : "Eye"} size={16} style={{ color: "#bbb" }} />
                    </button>
                  </div>
                </div>

                {error && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "hsl(0,75%,97%)", border: "1px solid hsl(0,75%,90%)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "hsl(0,75%,45%)" }}>
                    <Icon name="AlertCircle" size={14} />{error}
                  </div>
                )}

                <button type="submit" disabled={submitting} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: submitting ? "#ccc" : `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: submitting ? "none" : `0 4px 18px hsla(185,85%,32%,0.3)` }}>
                  {submitting
                    ? <><Icon name="Loader" size={16} style={{ animation: "spin 1s linear infinite" }} />Создаём аккаунт...</>
                    : <><Icon name="UserPlus" size={16} />Принять приглашение</>
                  }
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: 16 }}>
                <a href="/cabinet" style={{ fontSize: 12, color: "#aaa", textDecoration: "none" }}>
                  Уже есть аккаунт? <span style={{ color: ACCENT, fontWeight: 600 }}>Войти</span>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}