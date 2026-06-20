import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, Spinner, actionBtn, inputStyle, labelStyle } from "./LkAdminShared";

// ─── Генератор изображений для тренинга ──────────────────────────────────────

const AI_IMAGE_URL = "https://functions.poehali.dev/4b0ee2e5-a98e-40b8-bb9a-8a11d39d6e5a";
const ADMIN_IMAGE_TOKEN = "Sss07011974ssS";

const ASPECT_OPTIONS = [
  { value: "1024x1024", label: "Квадрат",  sub: "1:1",  icon: "Square"     },
  { value: "1024x1792", label: "Портрет",  sub: "2:3",  icon: "Smartphone" },
  { value: "1792x1024", label: "Пейзаж",   sub: "3:2",  icon: "Monitor"    },
];

interface HistoryItem {
  id: number; url: string; prompt: string; aspect_ratio: string; created_at: string;
}

function sid() { return localStorage.getItem("lk_session") || ""; }

async function triggerDownload(url: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "training-image.png";
    a.click();
    URL.revokeObjectURL(a.href);
  } catch {
    const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.click();
  }
}

export function TrainingImageGenSection() {
  const [prompt, setPrompt]       = useState("");
  const [aspect, setAspect]       = useState("1024x1024");
  const [loading, setLoading]     = useState(false);
  const [imageUrl, setImageUrl]   = useState<string | null>(null);
  const [error, setError]         = useState("");
  const [history, setHistory]     = useState<HistoryItem[]>([]);
  const [histLoading, setHistLoading] = useState(false);
  const [histLoaded, setHistLoaded]   = useState(false);
  const [downloading, setDownloading] = useState(false);

  const loadHistory = () => {
    setHistLoading(true);
    fetch(AI_IMAGE_URL, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setHistory(d); })
      .finally(() => { setHistLoading(false); setHistLoaded(true); });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) { setError("Введи описание изображения"); return; }
    setLoading(true); setError(""); setImageUrl(null);
    try {
      const res = await fetch(AI_IMAGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ prompt: prompt.trim(), aspect_ratio: aspect }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка генерации"); return; }
      const url = data.images?.[0]?.url;
      if (url) {
        setImageUrl(url);
        loadHistory();
        setDownloading(true);
        triggerDownload(url).finally(() => setDownloading(false));
      } else {
        setError("Изображение не вернулось. Проверь историю ниже.");
        loadHistory();
      }
    } catch {
      setError("Долгий ответ. Изображение могло сохраниться — проверь историю.");
      loadHistory();
    } finally {
      setLoading(false);
    }
  };

  const card: React.CSSProperties = {
    background: "#fff", borderRadius: 14, border: "1.5px solid #e8e8e4",
    padding: "24px 28px", marginBottom: 16,
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>Генератор изображений</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Опиши задачу из тренинга — ИИ создаст иллюстрацию, схему или инфографику. Хранится 6 дней.</p>
      </div>

      <div style={card}>
        {/* Предупреждение во время генерации */}
        {loading && (
          <div style={{ background: "hsl(0,90%,97%)", border: "1.5px solid hsl(0,80%,85%)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Icon name="AlertTriangle" size={16} style={{ color: "hsl(0,75%,55%)", flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 12, color: "hsl(0,65%,40%)", lineHeight: 1.5 }}>
              <strong>Не закрывай страницу!</strong> Генерация идёт 1–3 минуты.
            </div>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Описание изображения</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={loading}
            rows={4}
            placeholder="Например: инфографика «5 шагов к закрытию сделки», схема воронки продаж, иллюстрация доверия между клиентом и мастером..."
            style={{ ...inputStyle, resize: "vertical", fontSize: 13, lineHeight: 1.7 }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Формат</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {ASPECT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => !loading && setAspect(opt.value)}
                style={{
                  padding: "10px 8px", borderRadius: 10, textAlign: "center",
                  border: `1.5px solid ${aspect === opt.value ? ACCENT : "#e2e8f0"}`,
                  background: aspect === opt.value ? `hsla(185,85%,32%,0.07)` : "#fff",
                  cursor: loading ? "default" : "pointer", fontFamily: "Montserrat,sans-serif",
                }}
              >
                <Icon name={opt.icon} size={16} style={{ color: aspect === opt.value ? ACCENT : "#bbb", display: "block", margin: "0 auto 4px" }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: aspect === opt.value ? ACCENT : "#333" }}>{opt.label}</div>
                <div style={{ fontSize: 10, color: "#aaa" }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ background: "hsl(0,70%,97%)", border: "1.5px solid hsl(0,70%,85%)", borderRadius: 10, padding: "11px 14px", marginBottom: 14, fontSize: 13, color: "hsl(0,70%,40%)", fontWeight: 600 }}>
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          style={{
            ...actionBtn(loading || !prompt.trim() ? "#ccc" : "hsl(40,90%,48%)"),
            width: "100%", justifyContent: "center", padding: "14px", fontSize: 14,
            boxShadow: loading || !prompt.trim() ? "none" : "0 4px 18px hsla(40,90%,50%,0.3)",
          }}
        >
          <Icon name={loading ? "Loader" : "Sparkles"} size={16} style={loading ? { animation: "spin 1s linear infinite" } : {}} />
          {loading ? "Генерирую... подождите" : "Сгенерировать и скачать"}
        </button>
      </div>

      {imageUrl && (
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="CheckCircle" size={15} style={{ color: "hsl(145,60%,40%)" }} /> Изображение готово
          </div>
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1.5px solid #e8e8e4", marginBottom: 14 }}>
            <img src={imageUrl} alt="Результат" style={{ width: "100%", display: "block" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { setDownloading(true); triggerDownload(imageUrl).finally(() => setDownloading(false)); }}
              disabled={downloading}
              style={{ ...actionBtn(ACCENT) }}
            >
              <Icon name={downloading ? "Loader" : "Download"} size={14} />
              {downloading ? "Скачиваю..." : "Скачать ещё раз"}
            </button>
            <button onClick={() => { setImageUrl(null); setPrompt(""); setError(""); }} style={{ ...actionBtn("#64748b") }}>
              <Icon name="RotateCcw" size={14} /> Новое изображение
            </button>
          </div>
        </div>
      )}

      {/* История */}
      <div style={{ ...card, marginBottom: 0 }}>
        <button
          onClick={() => { if (!histLoaded) loadHistory(); setHistLoaded(v => !v); }}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, width: "100%" }}
        >
          <Icon name="Clock" size={15} style={{ color: ACCENT }} />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#1a1a1a", textAlign: "left" }}>
            Мои изображения {history.length > 0 && `(${history.length})`}
          </span>
          <Icon name={histLoaded ? "ChevronUp" : "ChevronDown"} size={15} style={{ color: "#aaa" }} />
        </button>

        {histLoaded && (
          <div style={{ marginTop: 16 }}>
            {histLoading ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}><Spinner /></div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0", fontSize: 13, color: "#aaa" }}>Изображений пока нет</div>
            ) : (
              <>
                <div style={{ fontSize: 12, color: "#aaa", marginBottom: 12 }}>Хранятся 6 дней. Нажми для скачивания.</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
                  {history.map(item => (
                    <div key={item.id} style={{ borderRadius: 10, overflow: "hidden", border: "1.5px solid #e8e8e4" }}>
                      <img
                        src={item.url} alt=""
                        style={{ width: "100%", display: "block", aspectRatio: item.aspect_ratio === "1024x1792" ? "2/3" : item.aspect_ratio === "1792x1024" ? "3/2" : "1/1", objectFit: "cover" }}
                      />
                      <div style={{ padding: "8px 10px" }}>
                        <button
                          onClick={() => triggerDownload(item.url)}
                          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: `hsla(185,85%,32%,0.08)`, border: "none", borderRadius: 7, padding: "6px 8px", cursor: "pointer", color: ACCENT, fontSize: 11, fontWeight: 700, fontFamily: "Montserrat,sans-serif" }}
                        >
                          <Icon name="Download" size={12} /> Скачать
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const GEN_URL = "https://functions.poehali.dev/d572afc5-ec2c-41fa-a73e-7a63c926d5c3";
const ADMIN_TOKEN = "Sss07011974ssS";
const LS = "tgen_v1"; // ключ localStorage

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

interface SavedState {
  tab: "input" | "chapters" | "result";
  scenarioText: string;
  fileName: string;
  chapters: Chapter[];
  generated: GeneratedChapter[];
  selectedNums: number[];
}

function loadSaved(): SavedState | null {
  try {
    const raw = localStorage.getItem(LS);
    return raw ? (JSON.parse(raw) as SavedState) : null;
  } catch (_) {
    return null;
  }
}

function save(state: SavedState) {
  try { localStorage.setItem(LS, JSON.stringify(state)); } catch (_) { /* ignore */ }
}

function clearSaved() {
  try { localStorage.removeItem(LS); } catch (_) { /* ignore */ }
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
  const saved = loadSaved();

  const [tab, setTabRaw] = useState<"input" | "chapters" | "result">(saved?.tab ?? "input");
  const [scenarioText, setScenarioTextRaw] = useState(saved?.scenarioText ?? "");
  const [fileName, setFileNameRaw] = useState(saved?.fileName ?? "");
  const [chapters, setChaptersRaw] = useState<Chapter[]>(saved?.chapters ?? []);
  const [generated, setGeneratedRaw] = useState<GeneratedChapter[]>(saved?.generated ?? []);
  const [selectedChapters, setSelectedChaptersRaw] = useState<Set<number>>(
    new Set(saved?.selectedNums ?? [])
  );
  const [splitLoading, setSplitLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [error, setError] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Хелперы: устанавливают state и сохраняют в localStorage
  const persist = (patch: Partial<SavedState>) => {
    const cur: SavedState = {
      tab, scenarioText, fileName, chapters, generated,
      selectedNums: [...selectedChapters],
      ...patch,
    };
    save(cur);
  };

  const setTab = (v: "input" | "chapters" | "result") => { setTabRaw(v); persist({ tab: v }); };
  const setScenarioText = (v: string) => { setScenarioTextRaw(v); persist({ scenarioText: v }); };
  const setFileName = (v: string) => { setFileNameRaw(v); persist({ fileName: v }); };
  const setSelectedChapters = (v: Set<number>) => {
    setSelectedChaptersRaw(v);
    persist({ selectedNums: [...v] });
  };

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
    const newChapters: Chapter[] = (res.chapters as Chapter[]) || [];
    const newNums = newChapters.map(c => c.num);
    setChaptersRaw(newChapters);
    setSelectedChaptersRaw(new Set(newNums));
    setTabRaw("chapters");
    save({ tab: "chapters", scenarioText, fileName, chapters: newChapters, generated, selectedNums: newNums });
  };

  const handleGenerate = async () => {
    const toGenerate = chapters.filter(c => selectedChapters.has(c.num));
    if (!toGenerate.length) { setError("Выбери хотя бы одну главу"); return; }
    setError("");
    setGenLoading(true);
    setGeneratedRaw([]);
    setGenProgress(0);
    const results: GeneratedChapter[] = [];
    for (let i = 0; i < toGenerate.length; i++) {
      setGenProgress(Math.round((i / toGenerate.length) * 100));
      const res = await apiFetch("generate_chapter", {
        chapter: toGenerate[i],
        scenario_context: scenarioText,
        chapter_index: i,
        total_chapters: toGenerate.length,
      });
      if (!res.error) {
        results.push(res as unknown as GeneratedChapter);
        // сохраняем после каждой главы — если вкладка закроется, уже готовые не потеряются
        save({ tab: "result", scenarioText, fileName, chapters, generated: results, selectedNums: [...selectedChapters] });
        setGeneratedRaw([...results]);
      }
    }
    setGenProgress(100);
    setGenLoading(false);
    setTabRaw("result");
    save({ tab: "result", scenarioText, fileName, chapters, generated: results, selectedNums: [...selectedChapters] });
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
    clearSaved();
    setTabRaw("input");
    setScenarioTextRaw("");
    setFileNameRaw("");
    setChaptersRaw([]);
    setGeneratedRaw([]);
    setSelectedChaptersRaw(new Set());
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
          <p style={{ margin: "4px 0 0", fontSize: 13, color: GRAY }}>
            Загрузи сценарий → ИИ разобьёт на главы → напишет тексты и создаст изображения
            {(chapters.length > 0 || generated.length > 0) && (
              <span style={{ marginLeft: 10, fontSize: 11, color: "hsl(145,60%,38%)", fontWeight: 600 }}>
                ● Сохранено
              </span>
            )}
          </p>
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