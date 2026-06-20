import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { actionBtn, inputStyle, labelStyle } from "./LkAdminShared";
import {
  TEAL, DARK, GRAY, SERIF, CARD_STYLE,
  loadSaved, save, clearSaved, apiFetch, fileToBase64,
  type Chapter, type GeneratedChapter, type SavedState,
} from "./TgenTypes";
import { TgenChaptersTab } from "./TgenChaptersTab";
import { TgenResultTab } from "./TgenResultTab";

export { TrainingImageGenSection } from "./TgenImageSection";

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
    setScenarioText(res.text as string || "");
  };

  const handleSplit = async () => {
    if (!scenarioText.trim()) { setError("Вставь или загрузи сценарий"); return; }
    setError("");
    setSplitLoading(true);
    const res = await apiFetch("split", { scenario: scenarioText });
    setSplitLoading(false);
    if (res.error) { setError(res.error as string); return; }
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
        <div style={CARD_STYLE}>
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
                  4. ИИ пишет текст каждой главы<br />
                  5. Копируешь текст с заголовком
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
        <TgenChaptersTab
          chapters={chapters}
          selectedChapters={selectedChapters}
          setSelectedChapters={setSelectedChapters}
          genLoading={genLoading}
          genProgress={genProgress}
          onGenerate={handleGenerate}
        />
      )}

      {tab === "result" && (
        <TgenResultTab
          generated={generated}
          onBack={() => setTab("chapters")}
          onReset={resetAll}
        />
      )}
    </div>
  );
}