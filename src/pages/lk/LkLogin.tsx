import { useState } from "react";
import { Link } from "react-router-dom";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";
import BrandLogo from "@/components/BrandLogo";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const inputStyle = (focused: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "12px 14px",
  borderRadius: 4,
  border: `1px solid ${focused ? TEAL : "#E2E8F0"}`,
  fontSize: 14,
  outline: "none",
  fontFamily: "Inter, sans-serif",
  boxSizing: "border-box",
  color: DARK,
  background: "#fff",
  transition: "border-color 0.2s",
});

export default function LkLogin() {
  const { login, register } = useLkAuth();
  const [tab, setTab] = useState<"login" | "register">("login");

  // Login fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [userType, setUserType] = useState<"salon" | "solo_master">("salon");

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // focus states
  const [focus, setFocus] = useState<Record<string, boolean>>({});
  const onFocus = (k: string) => setFocus(p => ({ ...p, [k]: true }));
  const onBlur = (k: string) => setFocus(p => ({ ...p, [k]: false }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError("Необходимо принять политику конфиденциальности"); return; }
    setError("");
    setLoading(true);
    try {
      await register(fullName, email, regPassword, userType);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `radial-gradient(120% 100% at 70% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, sans-serif", padding: "24px", position: "relative", overflow: "hidden",
    }}>

      <div style={{ width: "100%", maxWidth: 440, position: "relative" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link to="/" style={{ textDecoration: "none", display: "inline-flex", justifyContent: "center" }}>
            <BrandLogo variant="light" size="lg" />
          </Link>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 32px 64px rgba(0,0,0,0.35)",
        }}>
          {/* Tabs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #E2E8F0" }}>
            {(["login", "register"] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(""); }}
                style={{
                  padding: "18px", border: "none", cursor: "pointer",
                  fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500,
                  letterSpacing: "0.2px",
                  background: tab === t ? "#fff" : "#F8FAFC",
                  color: tab === t ? DARK : GRAY,
                  borderBottom: tab === t ? `2px solid ${TEAL}` : "2px solid transparent",
                  transition: "all 0.2s",
                }}>
                {t === "login" ? "Войти" : "Регистрация"}
              </button>
            ))}
          </div>

          <div style={{ padding: "36px 32px" }}>
            {/* Tab: Login */}
            {tab === "login" && (
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 4, fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: DARK, marginBottom: 6 }}>
                  Личный кабинет
                </div>
                <p style={{ fontSize: 13, color: GRAY, margin: "0 0 28px", fontWeight: 300 }}>
                  Введите логин и пароль для входа
                </p>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    Логин
                  </label>
                  <input
                    type="text" value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Введите логин или email"
                    required
                    style={inputStyle(!!focus.username)}
                    onFocus={() => onFocus("username")}
                    onBlur={() => onBlur("username")}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    Пароль
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"} value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Введите пароль"
                      required
                      style={{ ...inputStyle(!!focus.password), paddingRight: 44 }}
                      onFocus={() => onFocus("password")}
                      onBlur={() => onBlur("password")}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: GRAY, padding: 4 }}>
                      <Icon name={showPw ? "EyeOff" : "Eye"} size={17} />
                    </button>
                  </div>
                </div>

                {error && <ErrorBox message={error} />}

                <button type="submit" disabled={loading} style={submitStyle(loading)}>
                  {loading ? "Вхожу..." : "Войти"}
                </button>

                <p style={{ textAlign: "center", fontSize: 13, color: GRAY, marginTop: 20, fontWeight: 300 }}>
                  Нет аккаунта?{" "}
                  <button type="button" onClick={() => { setTab("register"); setError(""); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: TEAL, fontSize: 13, fontWeight: 500, padding: 0 }}>
                    Зарегистрироваться
                  </button>
                </p>
              </form>
            )}

            {/* Tab: Register */}
            {tab === "register" && (
              <form onSubmit={handleRegister}>
                <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: DARK, marginBottom: 6 }}>
                  Создать аккаунт
                </div>
                <p style={{ fontSize: 13, color: GRAY, margin: "0 0 20px", fontWeight: 300 }}>
                  Зарегистрируйтесь и получите 100 энергий в подарок
                </p>

                <div style={{ marginBottom: 22 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    Я регистрируюсь как
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {([
                      { key: "salon", icon: "Building2", title: "Салон", desc: "Владелец салона" },
                      { key: "solo_master", icon: "User", title: "Мастер", desc: "Работаю сам" },
                    ] as const).map(opt => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setUserType(opt.key)}
                        style={{
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                          padding: "14px 10px", borderRadius: 6, cursor: "pointer",
                          border: `1.5px solid ${userType === opt.key ? TEAL : "#E2E8F0"}`,
                          background: userType === opt.key ? "rgba(45,212,191,0.08)" : "#fff",
                          transition: "all 0.2s",
                        }}
                      >
                        <Icon name={opt.icon} size={18} style={{ color: userType === opt.key ? TEAL : GRAY }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{opt.title}</span>
                        <span style={{ fontSize: 11, color: GRAY, fontWeight: 300 }}>{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    Ваше имя
                  </label>
                  <input
                    type="text" value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Иван Иванов"
                    required
                    style={inputStyle(!!focus.fullName)}
                    onFocus={() => onFocus("fullName")}
                    onBlur={() => onBlur("fullName")}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    Email
                  </label>
                  <input
                    type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="salon@example.com"
                    required
                    style={inputStyle(!!focus.email)}
                    onFocus={() => onFocus("email")}
                    onBlur={() => onBlur("email")}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    Пароль
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"} value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Минимум 6 символов"
                      required minLength={6}
                      style={{ ...inputStyle(!!focus.regPw), paddingRight: 44 }}
                      onFocus={() => onFocus("regPw")}
                      onBlur={() => onBlur("regPw")}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: GRAY, padding: 4 }}>
                      <Icon name={showPw ? "EyeOff" : "Eye"} size={17} />
                    </button>
                  </div>
                </div>

                {/* Checkbox */}
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginBottom: 24 }}>
                  <div
                    onClick={() => setAgreed(!agreed)}
                    style={{
                      width: 18, height: 18, borderRadius: 2, flexShrink: 0, marginTop: 1,
                      border: `1.5px solid ${agreed ? TEAL : "#CBD5E1"}`,
                      background: agreed ? TEAL : "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s", cursor: "pointer",
                    }}>
                    {agreed && <Icon name="Check" size={12} style={{ color: "#fff" }} />}
                  </div>
                  <span style={{ fontSize: 13, color: GRAY, lineHeight: 1.6, fontWeight: 300 }}>
                    Я принимаю{" "}
                    <Link to="/privacy" target="_blank"
                      style={{ color: TEAL, textDecoration: "none", fontWeight: 500 }}
                      onClick={e => e.stopPropagation()}>
                      политику конфиденциальности
                    </Link>{" "}
                    и даю согласие на обработку персональных данных
                  </span>
                </label>

                {error && <ErrorBox message={error} />}

                <button type="submit" disabled={loading || !agreed} style={submitStyle(loading || !agreed)}>
                  {loading ? "Регистрирую..." : "Создать аккаунт"}
                </button>

                <p style={{ textAlign: "center", fontSize: 13, color: GRAY, marginTop: 20, fontWeight: 300 }}>
                  Уже есть аккаунт?{" "}
                  <button type="button" onClick={() => { setTab("login"); setError(""); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: TEAL, fontSize: 13, fontWeight: 500, padding: 0 }}>
                    Войти
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 24, fontWeight: 300 }}>
          © 2026 Промт Диалог. Платформа роста салона.
        </p>
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div style={{
      background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: 4,
      padding: "11px 14px", marginBottom: 20, fontSize: 13, color: "#BE123C",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <Icon name="AlertCircle" size={15} style={{ flexShrink: 0 }} />
      {message}
    </div>
  );
}

function submitStyle(disabled: boolean): React.CSSProperties {
  return {
    width: "100%", padding: "14px", borderRadius: 4, border: "none",
    background: disabled ? "#E2E8F0" : `linear-gradient(135deg, #2DD4BF, #14B8A6)`,
    color: disabled ? "#94A3B8" : "#0F172A",
    fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif",
    cursor: disabled ? "not-allowed" : "pointer",
    letterSpacing: "0.3px", transition: "all 0.2s",
  };
}