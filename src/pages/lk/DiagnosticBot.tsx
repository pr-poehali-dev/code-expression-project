import { useState, useEffect, useRef } from "react";
import { lkApi } from "@/lib/lkApi";
import Icon from "@/components/ui/icon";
import { backBtn, ACCENT } from "./LkTestsTypes";

const COLOR = "hsl(210,85%,45%)";
const COLOR_BG = "hsl(210,85%,96%)";

interface Symptom {
  id: number;
  slug: string;
  name: string;
  zone_slug: string;
}

interface Technique {
  title: string;
  description: string;
  video_url: string;
}

interface TechniqueZone {
  zone_name: string;
  techniques: Technique[];
}

interface DiagCard {
  zone_name: string;
  possible_causes: string;
  compensation_zones: string;
  compensation_slugs: string[];
  check_visual: string;
  check_tactile: string;
  emotional_factors: string;
  red_flags: string;
  recommendations: string;
  client_explanation: string;
}

interface DiagResult {
  found: boolean;
  query: string;
  matched_symptom: string;
  zone_slug: string;
  card: DiagCard;
  techniques_by_zone: Record<string, TechniqueZone>;
}

function getKinescopeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/kinescope\.io\/(?:embed\/)?([a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}

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

interface Props {
  onBack: () => void;
}

export default function DiagnosticBot({ onBack }: Props) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Symptom[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [expandedTech, setExpandedTech] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    lkApi.diagSymptoms().then(setSymptoms).catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim()) { setFiltered([]); setShowDropdown(false); return; }
    const q = query.toLowerCase();
    const matches = symptoms.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.slug.includes(q)
    );
    setFiltered(matches);
    setShowDropdown(matches.length > 0);
  }, [query, symptoms]);

  const search = async (q: string, slug?: string) => {
    setShowDropdown(false);
    setLoading(true);
    setResult(null);
    setNotFound(false);
    setExpandedTech(null);
    try {
      const data = slug
        ? await lkApi.diagSearchBySlug(slug)
        : await lkApi.diagSearch(q);
      if (data.found) {
        setResult(data);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (s: Symptom) => {
    setQuery(s.name);
    search(s.name, s.slug);
  };

  const handleSearch = () => {
    if (query.trim()) search(query.trim());
  };

  if (result) {
    const card = result.card;
    const techZones = Object.entries(result.techniques_by_zone);
    return (
      <div>
        <button onClick={() => { setResult(null); setQuery(""); }} style={backBtn}>
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

          {/* Техники из шпаргалки */}
          {techZones.length > 0 && (
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
          )}

          {techZones.length === 0 && (
            <div style={{ background: "#fafaf8", borderRadius: 14, padding: "16px 20px", fontSize: 13, color: "#aaa", textAlign: "center" }}>
              Техники для этой зоны пока не добавлены в шпаргалку
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} style={backBtn}>
        <Icon name="ArrowLeft" size={16} /> Назад
      </button>

      <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>
        Системная диагностика
      </h1>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 28px", lineHeight: 1.6 }}>
        Введите жалобу клиента или выберите из списка — система покажет возможные причины, компенсаторные зоны и техники из шпаргалки
      </p>

      {/* Поле ввода */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Icon name="Search" size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#bbb", pointerEvents: "none" }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSearch(); if (e.key === "Escape") setShowDropdown(false); }}
              onFocus={() => { if (filtered.length > 0) setShowDropdown(true); }}
              placeholder="Боль в шее, поясница, тревога..."
              style={{
                width: "100%", padding: "13px 16px 13px 42px",
                borderRadius: 12, border: "1.5px solid #e8e8e4",
                fontSize: 14, fontFamily: "Montserrat, sans-serif",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            style={{
              padding: "13px 22px", borderRadius: 12, border: "none",
              background: query.trim() ? COLOR : "#e8e8e4",
              color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: query.trim() ? "pointer" : "default",
              fontFamily: "Montserrat, sans-serif", whiteSpace: "nowrap",
              transition: "background 0.15s",
            }}
          >
            {loading ? "..." : "Найти"}
          </button>
        </div>

        {/* Дропдаун */}
        {showDropdown && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 60,
            background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            border: "1.5px solid #f0f0ec", zIndex: 50, overflow: "hidden", marginTop: 4,
          }}>
            {filtered.map(s => (
              <button
                key={s.slug}
                onClick={() => handleSelect(s)}
                style={{
                  width: "100%", padding: "11px 16px", textAlign: "left",
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 13, fontFamily: "Montserrat, sans-serif", color: "#333",
                  borderBottom: "1px solid #f5f5f0", display: "flex", alignItems: "center", gap: 10,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8f8f5")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                <Icon name="Activity" size={13} style={{ color: COLOR, flexShrink: 0 }} />
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Быстрый выбор из списка */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#aaa", marginBottom: 10 }}>Частые жалобы:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {symptoms.map(s => (
            <button
              key={s.slug}
              onClick={() => handleSelect(s)}
              style={{
                padding: "7px 14px", borderRadius: 20, border: "1.5px solid #e8e8e4",
                background: "#fafaf8", fontSize: 12, fontWeight: 600,
                color: "#555", cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = COLOR; (e.currentTarget as HTMLElement).style.color = COLOR; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e8e8e4"; (e.currentTarget as HTMLElement).style.color = "#555"; }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <div style={{ width: 28, height: 28, border: "3px solid #eee", borderTopColor: COLOR, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {notFound && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "32px 24px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <Icon name="SearchX" size={36} style={{ color: "#ddd", marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 700, color: "#555", marginBottom: 6 }}>Жалоба не распознана</div>
          <div style={{ fontSize: 13, color: "#aaa" }}>Попробуйте выбрать из списка частых жалоб выше</div>
        </div>
      )}

      {/* Описание инструмента */}
      {!loading && !notFound && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {[
            { icon: "Search", label: "Возможные причины" },
            { icon: "GitBranch", label: "Компенсаторные зоны" },
            { icon: "Eye", label: "Что проверить визуально" },
            { icon: "Hand", label: "Что проверить руками" },
            { icon: "Heart", label: "Эмоциональные факторы" },
            { icon: "AlertTriangle", label: "Красные флаги" },
            { icon: "ClipboardCheck", label: "Рекомендации" },
            { icon: "BookOpen", label: "Техники из шпаргалки" },
          ].map(item => (
            <div key={item.icon} style={{
              background: "#fff", borderRadius: 12, padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 10,
              border: "1.5px solid #f0f0ec",
            }}>
              <Icon name={item.icon} size={14} style={{ color: COLOR, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "#666" }}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
