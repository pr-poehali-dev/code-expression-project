import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, backBtn } from "./LkTestsTypes";
import { COLOR, COLOR_BG, DiagResult, getKinescopeId } from "./DiagnosticTypes";

// ── Примитивные блоки ─────────────────────────────────────────────────────────

function Section({ icon, title, children, color = "#555" }: { icon: string; title: string; children: React.ReactNode; color?: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={icon} size={15} style={{ color }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function TextBlock({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {text.split(",").map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{ color: COLOR, fontSize: 14, marginTop: 2, flexShrink: 0 }}>·</span>
          <span style={{ fontSize: 13, color: "#444", lineHeight: 1.55 }}>{item.trim()}</span>
        </div>
      ))}
    </div>
  );
}

// ── AI-блок ───────────────────────────────────────────────────────────────────

function AiBlock({ icon, title, text, color }: { icon: string; title: string; text: string; color: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1.5px solid #f0f0ec", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={icon} size={14} style={{ color }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>{title}</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#bbb", fontWeight: 600 }}>✦ AI</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {text.split("\n").filter(Boolean).map((line, i) => {
          const isStep = /^\d+[.)]\s/.test(line.trim()) || line.trim().startsWith("-") || line.trim().startsWith("•");
          const clean = line.replace(/^\d+[.)]\s*/, "").replace(/^[-•]\s*/, "").trim();
          return isStep ? (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color, fontSize: 14, lineHeight: "20px", flexShrink: 0 }}>·</span>
              <span style={{ fontSize: 13, color: "#444", lineHeight: 1.6 }}>{clean}</span>
            </div>
          ) : (
            <p key={i} style={{ fontSize: 13, color: "#444", lineHeight: 1.65, margin: 0 }}>{line}</p>
          );
        })}
      </div>
    </div>
  );
}

// ── Техники из шпаргалки ──────────────────────────────────────────────────────

function TechniquesSection({ techZones }: { techZones: [string, { zone_name: string; techniques: { title: string; description: string; video_url: string }[] }][] }) {
  const [expandedTech, setExpandedTech] = useState<string | null>(null);

  if (techZones.length === 0) {
    return (
      <div style={{ background: "#fafaf8", borderRadius: 14, padding: "16px 20px", fontSize: 13, color: "#aaa", textAlign: "center" }}>
        Техники для этой зоны пока не добавлены в шпаргалку
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase", margin: "8px 0 12px" }}>
        Техники из шпаргалки
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {techZones.map(([slug, zone]) => (
          <div key={slug} style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #f0f0ec", overflow: "hidden" }}>
            <button
              onClick={() => setExpandedTech(expandedTech === slug ? null : slug)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 18px", background: "none", border: "none", cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: COLOR_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="BookOpen" size={14} style={{ color: COLOR }} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{zone.zone_name}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{zone.techniques.length} техник</div>
                </div>
              </div>
              <Icon name={expandedTech === slug ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: "#bbb" }} />
            </button>

            {expandedTech === slug && (
              <div style={{ borderTop: "1px solid #f0f0ec", padding: "12px 18px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
                {zone.techniques.map((tech, i) => {
                  const kId = getKinescopeId(tech.video_url);
                  return (
                    <div key={i}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{tech.title}</div>
                      {tech.description && (
                        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.55, marginBottom: kId ? 10 : 0 }}>{tech.description}</div>
                      )}
                      {kId && (
                        <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "16/9" }}>
                          <iframe
                            src={`https://kinescope.io/embed/${kId}`}
                            style={{ width: "100%", height: "100%", border: "none" }}
                            allow="autoplay; fullscreen"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Главный компонент результата ──────────────────────────────────────────────

interface Props {
  result: DiagResult;
  aiSections: Record<string, string> | null;
  aiLoading: boolean;
  onReset: () => void;
}

export default function DiagnosticResult({ result, aiSections, aiLoading, onReset }: Props) {
  const card = result.card;
  const techZones = Object.entries(result.techniques_by_zone);

  return (
    <div>
      <button onClick={onReset} style={backBtn}>
        <Icon name="ArrowLeft" size={16} /> Новая диагностика
      </button>

      {/* Заголовок */}
      <div style={{ background: `linear-gradient(135deg, ${COLOR}, hsl(210,85%,35%))`, borderRadius: 20, padding: "24px 28px", marginBottom: 20, color: "#fff" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.75, marginBottom: 6 }}>
          Системная диагностика
        </div>
        <div style={{ fontSize: "clamp(18px,3vw,26px)", fontFamily: "Cormorant, serif", fontWeight: 700, marginBottom: 4 }}>
          {card.zone_name}
        </div>
        {result.matched_symptom && (
          <div style={{ fontSize: 13, opacity: 0.85 }}>
            Жалоба: {result.matched_symptom}
          </div>
        )}
        <div style={{ marginTop: 12, fontSize: 12, background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px", display: "inline-block" }}>
          ⚠️ Инструмент не ставит диагнозы — помогает выстроить системную гипотезу
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Красные флаги — первыми */}
        {card.red_flags && (
          <div style={{ background: "#fff5f5", borderRadius: 16, padding: "16px 20px", border: "1.5px solid #fecaca" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Icon name="AlertTriangle" size={16} style={{ color: "#e55" }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e55" }}>Красные флаги</span>
            </div>
            <TextBlock text={card.red_flags} />
          </div>
        )}

        {/* Возможные причины */}
        {card.possible_causes && (
          <Section icon="Search" title="Возможные причины" color={COLOR}>
            <TextBlock text={card.possible_causes} />
          </Section>
        )}

        {/* Компенсаторные зоны */}
        {card.compensation_zones && (
          <Section icon="GitBranch" title="Компенсаторные зоны" color="hsl(280,60%,50%)">
            <TextBlock text={card.compensation_zones} />
          </Section>
        )}

        {/* Что проверить визуально */}
        {card.check_visual && (
          <Section icon="Eye" title="Что проверить визуально" color="hsl(145,60%,40%)">
            <TextBlock text={card.check_visual} />
          </Section>
        )}

        {/* Что проверить тактильно */}
        {card.check_tactile && (
          <Section icon="Hand" title="Что проверить руками" color="hsl(25,85%,50%)">
            <TextBlock text={card.check_tactile} />
          </Section>
        )}

        {/* Эмоциональные факторы */}
        {card.emotional_factors && (
          <Section icon="Heart" title="Возможные эмоциональные факторы" color="hsl(335,80%,50%)">
            <TextBlock text={card.emotional_factors} />
          </Section>
        )}

        {/* Рекомендации */}
        {card.recommendations && (
          <Section icon="ClipboardCheck" title="Рекомендации по работе" color={ACCENT}>
            <TextBlock text={card.recommendations} />
          </Section>
        )}

        {/* Что объяснить клиенту */}
        {card.client_explanation && (
          <div style={{ background: "hsl(185,85%,95%)", borderRadius: 16, padding: "18px 20px", border: `1.5px solid ${ACCENT}30` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Icon name="MessageCircle" size={15} style={{ color: ACCENT }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>Что объяснить клиенту</span>
            </div>
            <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
              «{card.client_explanation}»
            </p>
          </div>
        )}

        {/* AI-рекомендации */}
        {aiLoading && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: `1.5px solid ${COLOR}30`, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 20, height: 20, border: `2px solid ${COLOR_BG}`, borderTopColor: COLOR, borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#aaa" }}>AI готовит персональные рекомендации...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {aiSections && (() => {
          const how = aiSections["КАК ПРОВОДИТЬ ДИАГНОСТИКУ"];
          const psycho = aiSections["ПСИХОСОМАТИКА"];
          const logic = aiSections["ЛОГИКА РАБОТЫ"];
          const explain = aiSections["ЧТО ОБЪЯСНИТЬ КЛИЕНТУ"];
          return (
            <>
              {how && <AiBlock icon="Stethoscope" title="Как проводить диагностику" text={how} color={COLOR} />}
              {psycho && <AiBlock icon="Heart" title="Психосоматика" text={psycho} color="hsl(335,80%,48%)" />}
              {logic && <AiBlock icon="GitBranch" title="Логика работы" text={logic} color="hsl(280,60%,50%)" />}
              {explain && (
                <div style={{ background: "hsl(185,85%,95%)", borderRadius: 16, padding: "16px 20px", border: `1.5px solid ${ACCENT}30` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Icon name="MessageCircle" size={14} style={{ color: ACCENT }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase" as const, letterSpacing: 0.5 }}>Что объяснить клиенту</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, color: "#bbb", fontWeight: 600 }}>✦ AI</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#444", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>«{explain}»</p>
                </div>
              )}
            </>
          );
        })()}

        {/* Техники из шпаргалки */}
        <TechniquesSection techZones={techZones} />

      </div>
    </div>
  );
}
