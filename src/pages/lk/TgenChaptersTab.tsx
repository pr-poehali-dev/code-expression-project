import Icon from "@/components/ui/icon";
import { actionBtn } from "./LkAdminShared";
import { TEAL, DARK, GRAY, CARD_STYLE } from "./TgenTypes";
import type { Chapter } from "./TgenTypes";

interface Props {
  chapters: Chapter[];
  selectedChapters: Set<number>;
  setSelectedChapters: (v: Set<number>) => void;
  genLoading: boolean;
  genProgress: number;
  onGenerate: () => void;
}

export function TgenChaptersTab({ chapters, selectedChapters, setSelectedChapters, genLoading, genProgress, onGenerate }: Props) {
  return (
    <div>
      <div style={CARD_STYLE}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: DARK }}>Главы тренинга</div>
            <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>Выбери главы для генерации</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setSelectedChapters(new Set(chapters.map(c => c.num)))}
              style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: GRAY, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              Все
            </button>
            <button
              onClick={() => setSelectedChapters(new Set())}
              style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: GRAY, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              Сбросить
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {chapters.map((ch) => {
            const selected = selectedChapters.has(ch.num);
            return (
              <div
                key={ch.num}
                onClick={() => {
                  const ns = new Set(selectedChapters);
                  if (selected) { ns.delete(ch.num); } else { ns.add(ch.num); }
                  setSelectedChapters(ns);
                }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px",
                  borderRadius: 10, border: `1.5px solid ${selected ? TEAL : "#e8e8e4"}`,
                  background: selected ? "hsl(185,85%,97%)" : "#fafafa", cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 6, border: `2px solid ${selected ? TEAL : "#ccc"}`,
                  background: selected ? TEAL : "#fff", flexShrink: 0, marginTop: 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {selected && <Icon name="Check" size={13} style={{ color: "#fff" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>
                    Глава {ch.num}: {ch.title}
                  </div>
                  <div style={{ fontSize: 12, color: GRAY, marginTop: 4, lineHeight: 1.6 }}>{ch.summary}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {genLoading && (
        <div style={{ ...CARD_STYLE, textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 12 }}>
            Генерирую материалы... {genProgress}%
          </div>
          <div style={{ background: "#f1f5f9", borderRadius: 100, height: 8, overflow: "hidden", margin: "0 auto", maxWidth: 400 }}>
            <div style={{ height: "100%", background: `linear-gradient(90deg, ${TEAL}, hsl(185,85%,50%))`, width: `${genProgress}%`, transition: "width 0.5s", borderRadius: 100 }} />
          </div>
          <div style={{ fontSize: 12, color: GRAY, marginTop: 10 }}>
            Пишу тексты и создаю изображения — это занимает 1-3 минуты на главу
          </div>
        </div>
      )}

      {!genLoading && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onGenerate}
            disabled={selectedChapters.size === 0}
            style={{ ...actionBtn(selectedChapters.size > 0 ? TEAL : "#ccc") }}
          >
            <Icon name="Sparkles" size={14} />
            Сгенерировать {selectedChapters.size > 0 ? `${selectedChapters.size} гл.` : ""}
          </button>
        </div>
      )}
    </div>
  );
}
