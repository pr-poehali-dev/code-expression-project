import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import BrandLogo from "@/components/BrandLogo";

const LK_API = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";

function sid() { return localStorage.getItem("lk_session") || ""; }

interface PromoResult { applied: boolean; error?: string; bonus_energy?: number; school_name?: string; }

interface Props {
  email: string;
  verifyToken?: string | null; // токен из ?verify=... в URL
  promo?: PromoResult | null;  // результат применения промокода школы-партнёра при регистрации
  onVerified: () => void;
}

export default function LkEmailVerify({ email, verifyToken, promo, onVerified }: Props) {
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error" | "resending" | "resent">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const hasSession = !!sid();

  // Если токен пришёл из URL — сразу верифицируем
  useEffect(() => {
    if (!verifyToken) return;
    setStatus("verifying");
    fetch(`${LK_API}?action=email_verify&token=${encodeURIComponent(verifyToken)}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setStatus("success");
          // Если есть активная сессия — автоматически переходим в кабинет
          // Если нет (открыл ссылку в другом браузере) — показываем кнопку "Войти"
          if (hasSession) {
            setTimeout(() => onVerified(), 2000);
          }
        } else {
          setStatus("error");
          setErrorMsg(d.error || "Ссылка недействительна");
        }
      })
      .catch(() => { setStatus("error"); setErrorMsg("Ошибка сети, попробуйте ещё раз"); });
  }, [verifyToken]);

  async function resend() {
    setStatus("resending");
    try {
      await fetch(`${LK_API}?action=resend_verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
      });
      setStatus("resent");
    } catch {
      setStatus("idle");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(120% 100% at 70% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, sans-serif", padding: "24px", position: "relative", overflow: "hidden",
    }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>

      <div style={{ width: "100%", maxWidth: 440, position: "relative", animation: "fadeIn 0.4s ease" }}>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <BrandLogo variant="light" size="lg" />
        </div>

        <div style={{ background: "#fff", borderRadius: 4, overflow: "hidden", boxShadow: "0 32px 64px rgba(0,0,0,0.35)" }}>

          {/* Заголовок */}
          <div style={{ background: "linear-gradient(135deg,#1a9fae,#136e7a)", padding: "28px 32px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              {status === "success"
                ? <Icon name="CheckCircle" size={28} style={{ color: "#fff" }} />
                : status === "error"
                  ? <Icon name="AlertCircle" size={28} style={{ color: "#fff" }} />
                  : status === "verifying"
                    ? <div style={{ width: 28, height: 28, border: "3px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    : <Icon name="Mail" size={28} style={{ color: "#fff" }} />
              }
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
              {status === "success" ? "Email подтверждён!" : status === "error" ? "Ошибка" : "Подтвердите email"}
            </div>
          </div>

          <div style={{ padding: "32px" }}>

            {/* Верификация по токену из URL */}
            {status === "verifying" && (
              <p style={{ fontSize: 14, color: GRAY, textAlign: "center", lineHeight: 1.7 }}>
                Проверяем ссылку...
              </p>
            )}

            {status === "success" && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 15, color: "#1a1a1a", fontWeight: 600, marginBottom: 8 }}>
                  Аккаунт активирован
                </p>
                {hasSession ? (
                  <>
                    <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.7 }}>
                      Перенаправляем вас в кабинет...
                    </p>
                    <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
                      <div style={{ width: 24, height: 24, border: "3px solid #eee", borderTopColor: TEAL, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.7, marginBottom: 20 }}>
                      Email успешно подтверждён. Войдите в кабинет.
                    </p>
                    <a
                      href="/cabinet"
                      style={{ display: "inline-block", padding: "13px 32px", borderRadius: 8, background: `linear-gradient(135deg,#1a9fae,#136e7a)`, color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "Inter, sans-serif" }}
                    >
                      Войти в кабинет
                    </a>
                  </>
                )}
              </div>
            )}

            {status === "error" && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "#e55", marginBottom: 20, lineHeight: 1.6 }}>{errorMsg}</p>
                <button
                  onClick={resend}
                  style={{ padding: "12px 24px", borderRadius: 8, border: "none", background: TEAL, color: DARK, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                >
                  Отправить новое письмо
                </button>
              </div>
            )}

            {/* Экран ожидания (после регистрации, без токена) */}
            {status === "idle" && !verifyToken && (
              <>
                {promo?.applied && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "hsl(45,90%,96%)", border: "1px solid hsl(45,80%,75%)", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
                    <Icon name="Zap" size={18} style={{ color: "hsl(40,90%,45%)", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "hsl(30,70%,30%)", lineHeight: 1.6 }}>
                      Начислено <strong>{promo.bonus_energy} ⚡</strong> по промокоду школы «{promo.school_name}»
                    </span>
                  </div>
                )}
                {promo?.error === "already_used" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
                    <Icon name="AlertCircle" size={18} style={{ color: "#ea580c", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#9a3412", lineHeight: 1.6 }}>
                      Этот промокод уже был использован ранее — бонус не начислен
                    </span>
                  </div>
                )}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>✉️</div>
                  <p style={{ fontSize: 15, color: DARK, fontWeight: 600, margin: "0 0 8px" }}>
                    Письмо отправлено
                  </p>
                  <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.7, margin: 0 }}>
                    Мы отправили ссылку для подтверждения на<br />
                    <strong style={{ color: DARK }}>{email}</strong>
                  </p>
                </div>

                <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", marginBottom: 20, fontSize: 12, color: GRAY, lineHeight: 1.7 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                    <Icon name="Info" size={14} style={{ color: TEAL, marginTop: 1, flexShrink: 0 }} />
                    <span>Перейдите по ссылке в письме, чтобы активировать аккаунт.</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <Icon name="AlertCircle" size={14} style={{ color: "#f59e0b", marginTop: 1, flexShrink: 0 }} />
                    <span>Не нашли письмо? Проверьте папку «Спам».</span>
                  </div>
                </div>

                {status === "resent" ? (
                  <div style={{ textAlign: "center", padding: "12px", background: "hsl(185,85%,96%)", borderRadius: 8, border: `1px solid ${TEAL}`, fontSize: 13, color: "#136e7a", fontWeight: 600 }}>
                    Письмо отправлено повторно
                  </div>
                ) : (
                  <button
                    onClick={resend}
                    disabled={status === "resending"}
                    style={{ width: "100%", padding: "12px", borderRadius: 8, border: `1.5px solid #E2E8F0`, background: "#fff", color: GRAY, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    {status === "resending"
                      ? <><div style={{ width: 14, height: 14, border: "2px solid #ddd", borderTopColor: TEAL, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Отправляем...</>
                      : <><Icon name="RefreshCw" size={14} /> Отправить письмо повторно</>
                    }
                  </button>
                )}
              </>
            )}

            {status === "resent" && !verifyToken && (
              <div style={{ textAlign: "center" }}>
                <Icon name="CheckCircle" size={32} style={{ color: TEAL, marginBottom: 12 }} />
                <p style={{ fontSize: 14, color: DARK, fontWeight: 600 }}>Письмо отправлено повторно</p>
                <p style={{ fontSize: 13, color: GRAY }}>Проверьте почту <strong>{email}</strong></p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}