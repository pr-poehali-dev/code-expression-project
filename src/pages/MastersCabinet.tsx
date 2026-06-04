import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import BrandLogo from "@/components/BrandLogo";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const DARK2 = "#080E1C";
const SERIF = "'Cormorant Garamond', serif";
const GOLD = "#C9A96E";
const AUTH_API = "https://functions.poehali.dev/2abd3fa5-1c57-42ac-80f2-040581a0423b";

function getSession() { return localStorage.getItem("master_session") || ""; }
function clearSession() { localStorage.removeItem("master_session"); }

function fmt(n: number) { return Math.round(n).toLocaleString("ru-RU"); }

interface Master {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  ref_code: string;
  ref_url: string;
  created_at: string;
}

interface Balance {
  pending_amount: number;
  available_amount: number;
  total_earned: number;
  total_withdrawn: number;
}

// Заглушка баланса (пока нет отдельного API)
const EMPTY_BALANCE: Balance = { pending_amount: 0, available_amount: 0, total_earned: 0, total_withdrawn: 0 };

function copyText(text: string, setCopied: (v: boolean) => void) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    const el = document.createElement("textarea");
    el.value = text; el.style.cssText = "position:fixed;top:-9999px;opacity:0";
    document.body.appendChild(el); el.focus(); el.select();
    document.execCommand("copy"); document.body.removeChild(el);
  } catch { /* ignore */ }
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
}

// ── Компонент реф-ссылки ──────────────────────────────────────────────────────
function RefCard({ master }: { master: Master }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  return (
    <div style={{ background: "linear-gradient(135deg,rgba(45,212,191,0.08),rgba(20,184,166,0.04))", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 20, padding: "28px 24px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Link" size={18} style={{ color: TEAL }} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Ваша реферальная ссылка</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Поделитесь с владельцем салона</div>
        </div>
      </div>

      {/* Ссылка */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Ссылка</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", fontSize: 13, color: "rgba(255,255,255,0.8)", wordBreak: "break-all", lineHeight: 1.4 }}>
            {master.ref_url}
          </div>
          <button onClick={() => copyText(master.ref_url, setCopiedLink)}
            style={{ flexShrink: 0, padding: "11px 16px", borderRadius: 10, border: "none", background: copiedLink ? "rgba(45,212,191,0.2)" : "rgba(255,255,255,0.07)", color: copiedLink ? TEAL : "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
            <Icon name={copiedLink ? "Check" : "Copy"} size={14} />
            {copiedLink ? "Скопировано" : "Копировать"}
          </button>
        </div>
      </div>

      {/* Код */}
      <div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Реферальный код</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 18px", fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: 2, fontFamily: "monospace" }}>
            {master.ref_code}
          </div>
          <button onClick={() => copyText(master.ref_code, setCopiedCode)}
            style={{ padding: "11px 16px", borderRadius: 10, border: "none", background: copiedCode ? "rgba(45,212,191,0.2)" : "rgba(255,255,255,0.07)", color: copiedCode ? TEAL : "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
            <Icon name={copiedCode ? "Check" : "Copy"} size={14} />
            {copiedCode ? "Скопировано" : "Копировать"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
        Когда владелец салона зарегистрируется по вашей ссылке — вы будете автоматически привязаны как партнёр и начнёте получать 10% с его трат.
      </div>
    </div>
  );
}

// ── Карточка баланса ──────────────────────────────────────────────────────────
function BalanceCard({ balance }: { balance: Balance }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 24px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(201,169,110,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Wallet" size={18} style={{ color: GOLD }} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Баланс</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "rgba(45,212,191,0.07)", border: "1px solid rgba(45,212,191,0.15)", borderRadius: 14, padding: "16px" }}>
          <div style={{ fontSize: 10, color: TEAL, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Доступно к выводу</div>
          <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: "#fff" }}>{fmt(balance.available_amount)} ₽</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>мин. 5 000 ₽</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Ожидает (30 дней)</div>
          <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{fmt(balance.pending_amount)} ₽</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>Всего заработано</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{fmt(balance.total_earned)} ₽</div>
        </div>
        <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>Выведено</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{fmt(balance.total_withdrawn)} ₽</div>
        </div>
      </div>

      {balance.available_amount >= 5000 ? (
        <button style={{ width: "100%", padding: "13px", borderRadius: 10, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, border: "none", color: DARK, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>
          Запросить вывод
        </button>
      ) : (
        <div style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center", lineHeight: 1.6 }}>
          Для вывода накопите минимум 5 000 ₽ на доступном балансе.<br />
          Не хватает: <strong style={{ color: "rgba(255,255,255,0.6)" }}>{fmt(5000 - balance.available_amount)} ₽</strong>
        </div>
      )}
    </div>
  );
}

// ── Инструкция ────────────────────────────────────────────────────────────────
function InstructionCard() {
  const steps = [
    { icon: "Send", title: "Поделитесь ссылкой", desc: "Отправьте реферальную ссылку владельцу салона — в личном сообщении, по WhatsApp или email. Представьте как «полезный инструмент для салона»." },
    { icon: "UserCheck", title: "Владелец регистрируется", desc: "Он переходит по ссылке и создаёт аккаунт на платформе «Про Диалог». Привязка происходит автоматически — вы нигде не упоминаетесь." },
    { icon: "Banknote", title: "Получаете 10%", desc: "С каждой траты салона на платформе вам начисляется 10%. Средства появятся в разделе «Ожидает» и станут доступны через 30 дней." },
    { icon: "CreditCard", title: "Выводите деньги", desc: "Как только накопится 5 000 ₽ — запросите вывод. Укажите ИНН (самозанятый или ИП). Перевод в течение 5 рабочих дней." },
  ];

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 24px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="BookOpen" size={18} style={{ color: "rgba(255,255,255,0.6)" }} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Как приглашать</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={s.icon} size={16} style={{ color: TEAL }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, fontWeight: 300 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Главный кабинет ───────────────────────────────────────────────────────────
export default function MastersCabinet() {
  const navigate = useNavigate();
  const [master, setMaster] = useState<Master | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"main" | "instruction" | "settings">("main");

  useEffect(() => {
    const sid = getSession();
    if (!sid) { navigate("/masters/login"); return; }
    fetch(AUTH_API, { headers: { "X-Master-Session": sid } })
      .then(r => r.json())
      .then(data => {
        if (data.master) setMaster(data.master);
        else { clearSession(); navigate("/masters/login"); }
      })
      .catch(() => { clearSession(); navigate("/masters/login"); })
      .finally(() => setLoading(false));
  }, [navigate]);

  const logout = async () => {
    const sid = getSession();
    await fetch(AUTH_API, { method: "POST", headers: { "Content-Type": "application/json", "X-Master-Session": sid }, body: JSON.stringify({ action: "logout" }) }).catch(() => {});
    clearSession();
    navigate("/masters");
  };

  if (loading) return (
    <div style={{ background: DARK2, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name="Loader2" size={32} style={{ color: TEAL, animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!master) return null;

  const tabs = [
    { id: "main", label: "Главная", icon: "LayoutDashboard" },
    { id: "instruction", label: "Инструкция", icon: "BookOpen" },
    { id: "settings", label: "Настройки", icon: "Settings" },
  ] as const;

  return (
    <div style={{ fontFamily: "Inter,sans-serif", background: DARK2, minHeight: "100vh", color: "#fff" }}>

      {/* Шапка */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, background: "rgba(8,14,28,0.96)", backdropFilter: "blur(16px)" }}>
        <Link to="/masters" style={{ textDecoration: "none" }}>
          <BrandLogo variant="light" size="md" />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: DARK }}>
              {master.full_name.charAt(0).toUpperCase()}
            </div>
            <span className="m-cab-name">{master.full_name}</span>
          </div>
          <button onClick={logout} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 12px", color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: 12, fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
            <Icon name="LogOut" size={13} /> Выйти
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px" }}>

        {/* Приветствие */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid rgba(201,169,110,0.3)`, borderRadius: 100, padding: "4px 12px", marginBottom: 12 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD }} />
            <span style={{ fontSize: 10, color: GOLD, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Личный кабинет партнёра</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(24px,4vw,36px)", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>
            Привет, {master.full_name.split(" ")[0]}!
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "6px 0 0", fontWeight: 300 }}>
            Ваш код: <span style={{ color: TEAL, fontWeight: 600 }}>{master.ref_code}</span> · {master.email}
          </p>
        </div>

        {/* Табы */}
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ flex: 1, padding: "9px 8px", borderRadius: 9, border: "none", background: activeTab === t.id ? "rgba(255,255,255,0.09)" : "transparent", color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: activeTab === t.id ? 600 : 400, cursor: "pointer", fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s" }}>
              <Icon name={t.icon} size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Контент */}
        {activeTab === "main" && (
          <div>
            <RefCard master={master} />
            <BalanceCard balance={EMPTY_BALANCE} />
          </div>
        )}

        {activeTab === "instruction" && <InstructionCard />}

        {activeTab === "settings" && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 24px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 20 }}>Профиль</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Имя и фамилия", value: master.full_name },
                { label: "Email", value: master.email },
                { label: "Телефон", value: master.phone || "—" },
                { label: "Дата регистрации", value: new Date(master.created_at).toLocaleDateString("ru-RU") },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{row.label}</span>
                  <span style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>
              Для изменения данных или вопросов по выплатам — напишите на{" "}
              <a href="mailto:info@promtdialog.ru" style={{ color: TEAL, textDecoration: "none" }}>info@promtdialog.ru</a>
            </div>
          </div>
        )}

        {/* Нижний промо-блок */}
        {activeTab === "main" && (
          <div style={{ marginTop: 8, padding: "18px 20px", background: "rgba(45,212,191,0.05)", border: "1px solid rgba(45,212,191,0.12)", borderRadius: 14, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <Icon name="Lightbulb" size={20} style={{ color: GOLD, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>Совет: поделитесь ссылкой сегодня</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                Чем раньше владелец зарегистрируется — тем быстрее начнут копиться ваши 10%.
              </div>
            </div>
            <a href={`https://wa.me/?text=${encodeURIComponent(`Привет! Нашла полезный инструмент для салона — платформа «Про Диалог». Попробуй бесплатно: ${master.ref_url}`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ padding: "9px 16px", borderRadius: 9, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.2)", color: TEAL, textDecoration: "none", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="MessageCircle" size={14} /> WhatsApp
            </a>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 480px) { .m-cab-name { display: none; } }
      `}</style>
    </div>
  );
}
