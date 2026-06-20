import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, Spinner, actionBtn, inputStyle, labelStyle } from "./LkAdminShared";

const GEN_URL = "https://functions.poehali.dev/d572afc5-ec2c-41fa-a73e-7a63c926d5c3";
const ADMIN_TOKEN = "Sss07011974ssS";

const TEAL = ACCENT;
const DARK = "#1a1a1a";
const GRAY = "#64748b";
const SERIF = "Cormorant, serif";

interface Chapter {
  num: number;
  title: string;
  summary: string;
}

interface GeneratedChapter extends Chapter {
  text: string;
  images: string[];
  structure_used?: string;
}

async function apiFetch(action: string, extra: object = {}): Promise<Record<string, unknown>> {
  const res = await fetch(GEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN },
    body: JSON.stringify({ action, ...extra }),
  });
  return res.json();
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function TrainingGeneratorSection() {
  const [tab, setTab] = useState<"input" | "chapters" | "result">("input");
  const [scenarioText, setScenarioText] = useState("");
  const [fileName, setFileName] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [generated, setGenerated] = useState<GeneratedChapter[]>([]);
  const [splitLoading, setSplitLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [error, setError] = useState("");
  const [selectedChapters, setSelectedChapters] = useState<Set<number>>(new Set());
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setFileName(file.name);
    const b64 = await fileToBase64(file);
    const res = await apiFetch("parse_file", { file_base64: b64, filename: file.name });
    if (res.error) { setError("Ошибка чтения файла: " + res.error); return; }
    setScenarioText(res.text || "");
  };

  const handleSplit = async () => {
    if (!scenarioText.trim()) { setError("Вставь или загрузи сценарий"); return; }
    setError("");
    setSplitLoading(true);
    const res = await apiFetch("split", { scenario: scenarioText });
    setSplitLoading(false);
    if (res.error) { setError(res.error); return; }
    setChapters(res.chapters || []);
    setSelectedChapters(new Set((res.chapters || []).map((c: Chapter) => c.num)));
    setTab("chapters");
  };

  const handleGenerate = async () => {
    const toGenerate = chapters.filter(c => selectedChapters.has(c.num));
    if (!toGenerate.length) { setError("Выбери хотя бы одну главу"); return; }
    setError("");
    setGenLoading(true);
    setGenerated([]);
    setGenProgress(0);
    const results: GeneratedChapter[] = [];
    for (let i = 0; i < toGenerate.length; i++) {
      setGenProgress(Math.round(((i) / toGenerate.length) * 100));
      const res = await apiFetch("generate_chapter", {
        chapter: toGenerate[i],
        scenario_context: scenarioText,
        chapter_index: i,
        total_chapters: toGenerate.length,
      });
      if (!res.error) results.push(res);
    }
    setGenProgress(100);
    setGenLoading(false);
    setGenerated(results);
    setTab("result");
  };

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const downloadImage = async (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop() || "image.png";
    a.target = "_blank";
    a.click();
  };

  const resetAll = () => {
    setTab("input");
    setScenarioText("");
    setFileName("");
    setChapters([]);
    setGenerated([]);
    setError("");
    setGenProgress(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 14,
    border: "1.5px solid #e8e8e4",
    padding: "24px 28px",
    marginBottom: 16,
  };

  const tabBtn = (id: typeof tab) => ({
    padding: "9px 20px",
    borderRadius: 10,
    border: "none",
    background: tab === id ? TEAL : "#f1f5f9",
    color: tab === id ? "#fff" : GRAY,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "Montserrat, sans-serif",
  } as React.CSSProperties);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: DARK, margin: 0 }}>Генератор тренингов</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: GRAY }}>Загрузи сценарий → ИИ разобьёт на главы → напишет тексты и создаст изображения</p>
        </div>
        {tab !== "input" && (
          <button onClick={resetAll} style={{ ...actionBtn("#64748b") }}>
            <Icon name="RotateCcw" size={14} /> Новый сценарий
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <button style={tabBtn("input")} onClick={() => setTab("input")}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="FileText" size={14} /> Сценарий</span>
        </button>
        {chapters.length > 0 && (
          <button style={tabBtn("chapters")} onClick={() => setTab("chapters")}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="List" size={14} /> Главы ({chapters.length})</span>
          </button>
        )}
        {generated.length > 0 && (
          <button style={tabBtn("result")} onClick={() => setTab("result")}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="Sparkles" size={14} /> Результат ({generated.length})</span>
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: "hsl(0,70%,97%)", border: "1.5px solid hsl(0,70%,85%)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "hsl(0,70%,40%)", fontWeight: 600 }}>
          {error}
        </div>
      )}

      {tab === "input" && (
        <div style={card}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={labelStyle}>Вставить текст сценария</label>
              <textarea
                value={scenarioText}
                onChange={e => setScenarioText(e.target.value)}
                placeholder="Вставь сюда полный текст сценария тренинга — главы, темы, идеи..."
                rows={14}
                style={{ ...inputStyle, resize: "vertical", fontSize: 13, lineHeight: 1.7 }}
              />
              <div style={{ fontSize: 12, color: GRAY, marginTop: 6 }}>
                {scenarioText.length > 0 && `${scenarioText.length.toLocaleString()} символов`}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Или загрузить файл</label>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: "2px dashed #e2e8f0", borderRadius: 12, padding: "32px 20px",
                  textAlign: "center", cursor: "pointer", background: "#f8fafc",
                  transition: "border-color 0.2s",
                }}
              >
                <Icon name="Upload" size={28} style={{ color: TEAL, marginBottom: 10 }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 4 }}>
                  {fileName || "Выбрать файл"}
                </div>
                <div style={{ fontSize: 12, color: GRAY }}>Word (.docx), PDF, TXT</div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".docx,.doc,.pdf,.txt"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </div>

              {fileName && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "hsl(145,60%,96%)", borderRadius: 8, fontSize: 13, color: "hsl(145,60%,35%)", display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="CheckCircle" size={15} />
                  Файл загружен: {fileName}
                </div>
              )}

              <div style={{ marginTop: 20, padding: "14px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e8e8e4" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: DARK, marginBottom: 8 }}>Как работает:</div>
                <div style={{ fontSize: 12, color: GRAY, lineHeight: 1.8 }}>
                  1. Загружаешь сценарий тренинга<br />
                  2. ИИ разбивает на логические главы<br />
                  3. Выбираешь нужные главы<br />
                  4. ИИ пишет текст + генерирует изображения<br />
                  5. Копируешь текст / скачиваешь фото
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSplit}
              disabled={splitLoading || !scenarioText.trim()}
              style={{ ...actionBtn(scenarioText.trim() ? TEAL : "#ccc"), opacity: splitLoading ? 0.7 : 1 }}
            >
              {splitLoading ? <><Icon name="Loader" size={14} /> Разбиваю на главы...</> : <><Icon name="Scissors" size={14} /> Разбить на главы</>}
            </button>
          </div>
        </div>
      )}

      {tab === "chapters" && (
        <div>
          <div style={card}>
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
            <div style={{ ...card, textAlign: "center" }}>
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
                onClick={handleGenerate}
                disabled={selectedChapters.size === 0}
                style={{ ...actionBtn(selectedChapters.size > 0 ? TEAL : "#ccc") }}
              >
                <Icon name="Sparkles" size={14} />
                Сгенерировать {selectedChapters.size > 0 ? `${selectedChapters.size} гл.` : ""}
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "result" && generated.length > 0 && (
        <div>
          {generated.map((ch, idx) => (
            <div key={ch.num} style={{ ...card, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>
                    Глава {ch.num}
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: DARK, margin: 0 }}>{ch.title}</h3>
                </div>
                <button
                  onClick={() => copyText(ch.text, idx)}
                  style={{ ...actionBtn(copiedIdx === idx ? "hsl(145,60%,38%)" : TEAL), flexShrink: 0 }}
                >
                  <Icon name={copiedIdx === idx ? "CheckCheck" : "Copy"} size={14} />
                  {copiedIdx === idx ? "Скопировано!" : "Копировать текст"}
                </button>
              </div>

              <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.9, whiteSpace: "pre-wrap", marginBottom: ch.images.length > 0 ? 20 : 0 }}>
                {ch.text}
              </div>

              {ch.images.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
                    Изображения к главе
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                    {ch.images.map((url, imgIdx) => (
                      <div key={imgIdx} style={{ borderRadius: 10, overflow: "hidden", border: "1.5px solid #e8e8e4", position: "relative" }}>
                        <img
                          src={url}
                          alt={`${ch.title} — изображение ${imgIdx + 1}`}
                          style={{ width: "100%", display: "block", aspectRatio: "1", objectFit: "cover" }}
                        />
                        <button
                          onClick={() => downloadImage(url)}
                          style={{
                            position: "absolute", bottom: 8, right: 8,
                            background: "rgba(0,0,0,0.7)", color: "#fff", border: "none",
                            borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600,
                            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                          }}
                        >
                          <Icon name="Download" size={13} /> Скачать
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 8 }}>
            <button onClick={() => setTab("chapters")} style={{ ...actionBtn("#64748b") }}>
              <Icon name="ArrowLeft" size={14} /> Назад к главам
            </button>
            <button onClick={resetAll} style={{ ...actionBtn(TEAL) }}>
              <Icon name="Plus" size={14} /> Новый тренинг
            </button>
          </div>
        </div>
      )}

      {tab === "result" && generated.length === 0 && (
        <div style={{ ...card, textAlign: "center", padding: "40px 24px" }}>
          <Spinner />
        </div>
      )}
    </div>
  );
}