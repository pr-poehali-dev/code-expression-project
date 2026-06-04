import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import BrandLogo from "@/components/BrandLogo";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const DARK2 = "#080E1C";
const SERIF = "'Cormorant Garamond', serif";
const GOLD = "#C9A96E";
const API = "https://functions.poehali.dev/2abd3fa5-1c57-42ac-80f2-040581a0423b";

function getSession() { return localStorage.getItem("master_session") || ""; }
function setSession(s: string) { localStorage.setItem("master_session", s); }

interface Props { mode: "register" | "login" }

export default function MastersAuth({ mode }: Props) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"register" | "login">(mode);

  // Форма регистрации
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regPass2, setRegPass2] = useState("");
  const [regTerms, setRegTerms] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Форма входа
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inp: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
    color: "#fff", fontSize: 14, outline: "none", fontFamily: "Inter,sans-serif",
    boxSizing: "border-box", transition: "border-color 0.15s",
  };

  const register = async () => {
    if (!regName || !regEmail || !regPass) return setError("Заполните все обязательные поля");
    if (regPass !== regPass2) return setError("Пароли не совпадают");
    if (regPass.length < 6) return setError("Пароль должен быть не менее 6 символов");
    if (!regTerms) return setError("Примите условия договора-оферты");
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", full_name: regName, email: regEmail, phone: regPhone, password: regPass, terms_agreed: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
      setSession(data.session_id);
      navigate("/masters/cabinet");
    } catch (e) { setError(e instanceof Error ? e.message : "Ошибка"); }
    finally { setLoading(false); }
  };

  const login = async () => {
    if (!loginEmail || !loginPass) return setError("Введите email и пароль");
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email: loginEmail, password: loginPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка входа");
      setSession(data.session_id);
      navigate("/masters/cabinet");
    } catch (e) { setError(e instanceof Error ? e.message : "Ошибка"); }
    finally { setLoading(false); }
  };

  const btnStyle: React.CSSProperties = {
    width: "100%", padding: "14px", borderRadius: 10,
    background: loading ? "rgba(45,212,191,0.5)" : `linear-gradient(135deg,${TEAL},${TEAL2})`,
    color: DARK, border: "none", fontSize: 15, fontWeight: 700,
    cursor: loading ? "default" : "pointer", fontFamily: "Inter,sans-serif",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  };

  return (
    <div style={{ fontFamily: "Inter,sans-serif", background: DARK2, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Навбар */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/masters" style={{ textDecoration: "none" }}>
          <BrandLogo variant="light" size="md" />
        </Link>
        <Link to="/masters" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="ArrowLeft" size={14} /> На главную
        </Link>
      </header>

      {/* Контент */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: 460 }}>

          {/* Бейдж */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid rgba(201,169,110,0.35)`, borderRadius: 100, padding: "5px 14px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
              <span style={{ fontSize: 11, color: GOLD, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Партнёрская программа</span>
            </div>
          </div>

          {/* Заголовок */}
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(28px,5vw,40px)", fontWeight: 500, color: "#fff", textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            {tab === "register" ? "Стать партнёром" : "Войти в кабинет"}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", textAlign: "center", margin: "0 0 32px" }}>
            {tab === "register" ? "Создайте аккаунт и получите реферальную ссылку" : "Добро пожаловать обратно"}
          </p>

          {/* Переключатель */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {(["register", "login"] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(null); }}
                style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: tab === t ? "rgba(255,255,255,0.08)" : "transparent", color: tab === t ? "#fff" : "rgba(255,255,255,0.45)", fontSize: 14, fontWeight: tab === t ? 600 : 400, cursor: "pointer", fontFamily: "Inter,sans-serif", transition: "all 0.15s" }}>
                {t === "register" ? "Регистрация" : "Вход"}
              </button>
            ))}
          </div>

          {/* Карточка формы */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 24px" }}>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "12px 14px", marginBottom: 20, fontSize: 13, color: "#FCA5A5", display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="AlertCircle" size={14} style={{ flexShrink: 0 }} /> {error}
              </div>
            )}

            {tab === "register" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6, fontWeight: 500 }}>Имя и фамилия *</label>
                  <input value={regName} onChange={e => setRegName(e.target.value)} placeholder="Анна Иванова" style={inp}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = TEAL}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6, fontWeight: 500 }}>Email *</label>
                  <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="anna@mail.ru" style={inp}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = TEAL}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6, fontWeight: 500 }}>Телефон</label>
                  <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="+7 900 000 00 00" style={inp}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = TEAL}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6, fontWeight: 500 }}>Пароль * (не менее 6 символов)</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPass ? "text" : "password"} value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="Придумайте пароль" style={{ ...inp, paddingRight: 44 }}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = TEAL}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"} />
                    <button onClick={() => setShowPass(!showPass)} type="button" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0 }}>
                      <Icon name={showPass ? "EyeOff" : "Eye"} size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6, fontWeight: 500 }}>Повторите пароль *</label>
                  <input type={showPass ? "text" : "password"} value={regPass2} onChange={e => setRegPass2(e.target.value)} placeholder="Повторите пароль" style={inp}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = TEAL}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>

                {/* Чекбокс оферты */}
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <div onClick={() => setRegTerms(!regTerms)} style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${regTerms ? TEAL : "rgba(255,255,255,0.2)"}`, background: regTerms ? TEAL : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "all 0.15s", cursor: "pointer" }}>
                    {regTerms && <Icon name="Check" size={11} style={{ color: DARK }} />}
                  </div>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                    Я принимаю условия{" "}
                    <Link to="/offer" target="_blank" style={{ color: TEAL, textDecoration: "none" }}>договора-оферты</Link>
                    {" "}и подтверждаю, что являюсь специалистом индустрии красоты
                  </span>
                </label>

                <button onClick={register} disabled={loading} style={btnStyle}>
                  {loading ? <><Icon name="Loader2" size={16} style={{ animation: "spin 1s linear infinite" }} /> Регистрируемся...</> : <>Создать аккаунт <Icon name="ArrowRight" size={16} /></>}
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6, fontWeight: 500 }}>Email</label>
                  <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="anna@mail.ru" style={inp}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = TEAL}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"}
                    onKeyDown={e => e.key === "Enter" && login()} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6, fontWeight: 500 }}>Пароль</label>
                  <div style={{ position: "relative" }}>
                    <input type={showLoginPass ? "text" : "password"} value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Ваш пароль" style={{ ...inp, paddingRight: 44 }}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = TEAL}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"}
                      onKeyDown={e => e.key === "Enter" && login()} />
                    <button onClick={() => setShowLoginPass(!showLoginPass)} type="button" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0 }}>
                      <Icon name={showLoginPass ? "EyeOff" : "Eye"} size={16} />
                    </button>
                  </div>
                </div>
                <button onClick={login} disabled={loading} style={btnStyle}>
                  {loading ? <><Icon name="Loader2" size={16} style={{ animation: "spin 1s linear infinite" }} /> Входим...</> : <>Войти <Icon name="ArrowRight" size={16} /></>}
                </button>
              </div>
            )}
          </div>

          {/* Переключалка снизу */}
          <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 20 }}>
            {tab === "register"
              ? <>Уже есть аккаунт?{" "}<button onClick={() => { setTab("login"); setError(null); }} style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", fontSize: 13, fontFamily: "Inter,sans-serif" }}>Войти</button></>
              : <>Нет аккаунта?{" "}<button onClick={() => { setTab("register"); setError(null); }} style={{ background: "none", border: "none", color: TEAL, cursor: "pointer", fontSize: 13, fontFamily: "Inter,sans-serif" }}>Зарегистрироваться</button></>
            }
          </p>

          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 12 }}>
            Партнёрская программа «Про Диалог» · Для мастеров салона красоты
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
