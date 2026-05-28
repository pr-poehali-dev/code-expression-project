import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, TOOLS, getUsedTools } from "./DemoShared";
import { EmailModal, AlreadyUsedModal } from "./DemoModals";

interface Props {
  emailModal: { id: string; title: string } | null;
  alreadyUsed: { title: string } | null;
  onToolClick: (id: string, title: string, free: boolean) => void;
  onEmailConfirm: (email: string, name: string) => void;
  onEmailClose: () => void;
  onAlreadyUsedClose: () => void;
}

export default function DemoToolsPage({
  emailModal,
  alreadyUsed,
  onToolClick,
  onEmailConfirm,
  onEmailClose,
  onAlreadyUsedClose,
}: Props) {
  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f0", fontFamily: "Montserrat, sans-serif" }}>
      <DokNavbar />

      {emailModal && (
        <EmailModal
          toolTitle={emailModal.title}
          onConfirm={onEmailConfirm}
          onClose={onEmailClose}
        />
      )}
      {alreadyUsed && (
        <AlreadyUsedModal
          toolTitle={alreadyUsed.title}
          onClose={onAlreadyUsedClose}
        />
      )}

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${ACCENT_DARK}, ${ACCENT})`,
        padding: "clamp(36px,6vw,64px) 20px clamp(32px,5vw,56px)",
        paddingTop: "calc(68px + clamp(36px,6vw,64px))",
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
                onClick={() => onToolClick(tool.id, tool.title, tool.free)}
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
