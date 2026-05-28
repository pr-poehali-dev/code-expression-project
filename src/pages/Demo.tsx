import { useState } from "react";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";
import BarriersBot from "./lk/BarriersBot";
import MindsetSpecialistBot from "./lk/MindsetSpecialistBot";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";

const STORAGE_KEY = "demo_used_tools";

function getUsedTools(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function markToolUsed(id: string, email: string) {
  const used = getUsedTools();
  used[id] = email;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(used));
}

const TOOLS = [
  {
    id: "barriers",
    icon: "Shield",
    color: "hsl(20,85%,52%)",
    colorBg: "hsl(20,85%,96%)",
    title: "Внутренние барьеры",
    desc: "Выяви психологические блоки, мешающие профессиональному росту",
    free: true,
  },
  {
    id: "mindset-spec",
    icon: "Brain",
    color: "hsl(260,70%,52%)",
    colorBg: "hsl(260,70%,97%)",
    title: "Развитие специалиста",
    desc: "Клиенты, позиционирование, личный бренд, практика — персональный AI-план",
    free: true,
  },
  {
    id: "diag",
    icon: "Stethoscope",
    color: "hsl(210,85%,45%)",
    colorBg: "hsl(210,85%,96%)",
    title: "Системная диагностика клиента",
    desc: "Жалоба → причины, компенсации, красные флаги и техники из шпаргалки",
    free: false,
  },
  {
    id: "mindset",
    icon: "MessageCircle",
    color: "hsl(280,60%,55%)",
    colorBg: "hsl(280,60%,96%)",
    title: "Мышление с премиум-клиентами",
    desc: "Тест + персональные советы по общению с клиентами высокого сегмента",
    free: false,
  },
  {
    id: "finance",
    icon: "TrendingUp",
    color: "hsl(145,60%,40%)",
    colorBg: "hsl(145,60%,95%)",
    title: "Финансовая грамотность",
    desc: "Проверь и прокачай знания в управлении доходом специалиста",
    free: false,
  },
  {
    id: "profile",
    icon: "ScanFace",
    color: "hsl(240,70%,55%)",
    colorBg: "hsl(240,70%,97%)",
    title: "Финансовый профиль PRO",
    desc: "Определи уровень финансового мышления, привычек и зрелости",
    free: false,
  },
  {
    id: "salon",
    icon: "Scissors",
    color: "hsl(335,80%,50%)",
    colorBg: "hsl(335,80%,97%)",
    title: "Диагностика роста салона PRO",
    desc: "Где салон теряет деньги — и как увеличить прибыль без нового потока",
    free: false,
  },
  {
    id: "body",
    icon: "User",
    color: ACCENT,
    colorBg: "hsl(185,85%,96%)",
    title: "Шпаргалка по телу",
    desc: "Кликни на зону тела → диагностика, техники и видео",
    free: false,
  },
];

type ActiveTool = "barriers" | "mindset-spec" | null;

interface EmailModalProps {
  toolTitle: string;
  onConfirm: (email: string) => void;
  onClose: () => void;
}

function EmailModal({ toolTitle, onConfirm, onClose }: EmailModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      setError("Введите корректный email");
      return;
    }
    onConfirm(email.trim().toLowerCase());
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "32px 28px",
        maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <Icon name="Mail" size={26} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, margin: "0 0 8px", color: "#1a1a1a" }}>
            Бесплатный доступ
          </h2>
          <p style={{ fontSize: 14, color: "#777", margin: 0, lineHeight: 1.6 }}>
            Введите email, чтобы получить результат инструмента <strong>«{toolTitle}»</strong>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            placeholder="your@email.com"
            autoFocus
            style={{
              width: "100%", padding: "13px 16px", borderRadius: 12, border: error ? "1.5px solid #e55" : "1.5px solid #e0e0d8",
              fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif",
              marginBottom: error ? 6 : 16,
            }}
          />
          {error && <p style={{ fontSize: 12, color: "#e55", margin: "0 0 12px" }}>{error}</p>}
          <button type="submit" style={{
            width: "100%", padding: "13px", borderRadius: 12,
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
            border: "none", color: "#fff", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "Montserrat, sans-serif", marginBottom: 10,
          }}>
            Начать бесплатно
          </button>
          <button type="button" onClick={onClose} style={{
            width: "100%", padding: "11px", borderRadius: 12,
            background: "transparent", border: "1.5px solid #e0e0d8",
            color: "#888", fontSize: 14, cursor: "pointer", fontFamily: "Montserrat, sans-serif",
          }}>
            Отмена
          </button>
        </form>
      </div>
    </div>
  );
}

interface AlreadyUsedModalProps {
  toolTitle: string;
  onClose: () => void;
}

function AlreadyUsedModal({ toolTitle, onClose }: AlreadyUsedModalProps) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "32px 28px",
        maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        textAlign: "center",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: "hsl(20,85%,96%)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
        }}>
          <Icon name="Lock" size={26} style={{ color: "hsl(20,85%,52%)" }} />
        </div>
        <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, margin: "0 0 10px", color: "#1a1a1a" }}>
          Вы уже использовали этот инструмент
        </h2>
        <p style={{ fontSize: 14, color: "#777", margin: "0 0 24px", lineHeight: 1.6 }}>
          Инструмент <strong>«{toolTitle}»</strong> доступен бесплатно только один раз. Чтобы использовать его снова — получите доступ к платформе.
        </p>
        <a href="/tarify" style={{
          display: "block", padding: "13px", borderRadius: 12,
          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
          color: "#fff", fontSize: 15, fontWeight: 700,
          textDecoration: "none", fontFamily: "Montserrat, sans-serif", marginBottom: 10,
        }}>
          Получить полный доступ
        </a>
        <button onClick={onClose} style={{
          width: "100%", padding: "11px", borderRadius: 12,
          background: "transparent", border: "1.5px solid #e0e0d8",
          color: "#888", fontSize: 14, cursor: "pointer", fontFamily: "Montserrat, sans-serif",
        }}>
          Закрыть
        </button>
      </div>
    </div>
  );
}

export default function Demo() {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [emailModal, setEmailModal] = useState<{ id: string; title: string } | null>(null);
  const [alreadyUsed, setAlreadyUsed] = useState<{ title: string } | null>(null);

  function handleToolClick(id: string, title: string, free: boolean) {
    if (!free) return;
    const used = getUsedTools();
    if (used[id]) {
      setAlreadyUsed({ title });
      return;
    }
    setEmailModal({ id, title });
  }

  function handleEmailConfirm(email: string) {
    if (!emailModal) return;
    markToolUsed(emailModal.id, email);
    const id = emailModal.id;
    setEmailModal(null);
    setActiveTool(id as ActiveTool);
  }

  if (activeTool === "barriers") {
    return (
      <div style={{ minHeight: "100vh", background: "#f4f4f0", fontFamily: "Montserrat, sans-serif" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
          <BarriersBot onBack={() => setActiveTool(null)} />
        </div>
      </div>
    );
  }

  if (activeTool === "mindset-spec") {
    return (
      <div style={{ minHeight: "100vh", background: "#f4f4f0", fontFamily: "Montserrat, sans-serif" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
          <MindsetSpecialistBot onBack={() => setActiveTool(null)} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f0", fontFamily: "Montserrat, sans-serif" }}>
      <DokNavbar />

      {emailModal && (
        <EmailModal
          toolTitle={emailModal.title}
          onConfirm={handleEmailConfirm}
          onClose={() => setEmailModal(null)}
        />
      )}
      {alreadyUsed && (
        <AlreadyUsedModal
          toolTitle={alreadyUsed.title}
          onClose={() => setAlreadyUsed(null)}
        />
      )}

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${ACCENT_DARK}, ${ACCENT})`,
        padding: "clamp(36px,6vw,64px) 20px clamp(32px,5vw,56px)",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.15)", borderRadius: 20,
            padding: "6px 14px", marginBottom: 20,
            fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: 1,
            textTransform: "uppercase",
          }}>
            <Icon name="Zap" size={13} style={{ color: "#fff" }} />
            AI-инструменты для специалистов
          </div>
          <h1 style={{
            fontFamily: "Cormorant, serif",
            fontSize: "clamp(26px, 5vw, 48px)",
            fontWeight: 700, color: "#fff", margin: "0 0 14px", lineHeight: 1.2,
          }}>
            Попробуй инструменты роста бесплатно
          </h1>
          <p style={{ fontSize: "clamp(14px,2vw,16px)", color: "rgba(255,255,255,0.85)", margin: "0 0 28px", lineHeight: 1.65, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            2 инструмента доступны бесплатно — один раз. Остальные открываются с полным доступом к платформе.
          </p>
          <div className="demo-hero-btns">
            <a href="/tarify" style={{
              padding: "13px 28px", borderRadius: 12,
              background: "#fff", color: ACCENT_DARK,
              fontSize: 14, fontWeight: 700, textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
            }}>
              Тарифы для специалистов
            </a>
            <a href="/dlya-salonov/formats" style={{
              padding: "13px 28px", borderRadius: 12,
              background: "rgba(255,255,255,0.15)", color: "#fff",
              fontSize: 14, fontWeight: 700, textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
              border: "1.5px solid rgba(255,255,255,0.3)",
            }}>
              Тарифы для салонов
            </a>
          </div>
        </div>
      </div>

      {/* Инструменты */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(28px,5vw,48px) 16px" }}>
        <div className="demo-grid">
          {TOOLS.map(tool => {
            const used = getUsedTools();
            const wasUsed = !!used[tool.id];
            return (
              <div
                key={tool.id}
                onClick={() => handleToolClick(tool.id, tool.title, tool.free)}
                style={{
                  background: "#fff",
                  border: tool.free ? `1.5px solid ${tool.color}40` : "1.5px solid #f0f0ec",
                  borderRadius: 18,
                  padding: "22px 20px",
                  cursor: tool.free ? "pointer" : "default",
                  position: "relative",
                  transition: "all 0.2s",
                  opacity: !tool.free ? 0.7 : 1,
                  boxShadow: tool.free ? "0 2px 16px rgba(0,0,0,0.06)" : "none",
                }}
                onMouseEnter={e => {
                  if (tool.free) (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  if (tool.free) (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {/* Бейдж */}
                {tool.free ? (
                  <div style={{
                    position: "absolute", top: 14, right: 14,
                    background: wasUsed ? "#f0f0ec" : `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
                    color: wasUsed ? "#999" : "#fff",
                    fontSize: 10, fontWeight: 700, padding: "3px 10px",
                    borderRadius: 20, letterSpacing: 0.5,
                  }}>
                    {wasUsed ? "ИСПОЛЬЗОВАН" : "БЕСПЛАТНО"}
                  </div>
                ) : (
                  <div style={{
                    position: "absolute", top: 14, right: 14,
                    background: "#f4f4f0", color: "#aaa",
                    fontSize: 10, fontWeight: 700, padding: "3px 10px",
                    borderRadius: 20, display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <Icon name="Lock" size={10} /> ПОЛНЫЙ ДОСТУП
                  </div>
                )}

                <div style={{
                  width: 46, height: 46, borderRadius: 13,
                  background: tool.colorBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 14,
                }}>
                  <Icon name={tool.icon} size={22} style={{ color: tool.color }} />
                </div>

                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 7, lineHeight: 1.3 }}>
                  {tool.title}
                </div>
                <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
                  {tool.desc}
                </div>

                {tool.free && !wasUsed && (
                  <div style={{
                    marginTop: 16, display: "flex", alignItems: "center", gap: 6,
                    fontSize: 13, fontWeight: 700, color: ACCENT,
                  }}>
                    Попробовать бесплатно
                    <Icon name="ArrowRight" size={14} style={{ color: ACCENT }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA-блок */}
        <div className="demo-cta" style={{
          marginTop: 40,
          background: `linear-gradient(135deg, ${ACCENT_DARK}, ${ACCENT})`,
          textAlign: "center",
        }}>
          <h2 style={{
            fontFamily: "Cormorant, serif",
            fontSize: "clamp(20px, 3vw, 34px)",
            fontWeight: 700, color: "#fff", margin: "0 0 12px",
          }}>
            Хочешь доступ ко всем инструментам?
          </h2>
          <p style={{ fontSize: "clamp(13px,2vw,15px)", color: "rgba(255,255,255,0.85)", margin: "0 0 24px", lineHeight: 1.65, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            Полный доступ ко всем AI-инструментам роста — на 12 месяцев или безлимитно, в зависимости от тарифа.
          </p>
          <div className="demo-cta-btns">
            <a href="/tarify" style={{
              padding: "13px 28px", borderRadius: 12,
              background: "#fff", color: ACCENT_DARK,
              fontSize: 14, fontWeight: 700, textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
            }}>
              Тарифы для специалистов
            </a>
            <a href="/dlya-salonov/formats" style={{
              padding: "13px 28px", borderRadius: 12,
              background: "rgba(255,255,255,0.15)", color: "#fff",
              fontSize: 14, fontWeight: 700, textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
              border: "1.5px solid rgba(255,255,255,0.3)",
            }}>
              Тарифы для салонов
            </a>
          </div>
        </div>
      </div>

      <DokFooter />
    </div>
  );
}