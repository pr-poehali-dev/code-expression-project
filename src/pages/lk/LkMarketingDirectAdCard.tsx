import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Ad, ACCENT, DIRECT_COLOR, IMAGE_API_URL, PREPARE_API_URL, copyToClipboard } from "./LkMarketingDirect.types";

// ── Индикатор длины ───────────────────────────────────────────────────────────
export function LenBadge({ len, max }: { len: number; max: number }) {
  const over = len > max;
  const warn = len > max * 0.9;
  const color = over ? "#DC2626" : warn ? "hsl(40,70%,38%)" : "hsl(145,60%,38%)";
  const bg    = over ? "#FEF2F2" : warn ? "hsl(40,90%,93%)" : "hsl(145,55%,93%)";
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color, background: bg, borderRadius: 5, padding: "2px 6px" }}>
      {len}/{max}
    </span>
  );
}

// ── Превью объявления Яндекс.Директ ──────────────────────────────────────────
export function AdPreview({ ad, idx, salonName }: { ad: Ad; idx: number; salonName: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyField = (key: string, text: string) => {
    copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const copyAll = () => {
    const text = `Заголовок 1: ${ad.title1}\nЗаголовок 2: ${ad.title2}\nТекст: ${ad.text}\nURL: ${ad.url_path}`;
    copyToClipboard(text);
    setCopied("all");
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div style={{ border: "1.5px solid #E8ECF0", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
      {/* Шапка */}
      <div style={{ background: "hsl(25,90%,97%)", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #FFE4CC" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: DIRECT_COLOR, letterSpacing: 0.5, textTransform: "uppercase" }}>
          Вариант {idx + 1}
        </span>
        <button
          onClick={copyAll}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, color: copied === "all" ? "hsl(145,60%,38%)" : "#94A3B8", fontFamily: "Montserrat,sans-serif", padding: 0 }}
        >
          <Icon name={copied === "all" ? "Check" : "Copy"} size={12} />
          {copied === "all" ? "Скопировано" : "Копировать всё"}
        </button>
      </div>

      {/* Превью как в Директе */}
      <div style={{ padding: "14px 16px", background: "#FAFBFF", borderBottom: "1px solid #E8ECF0" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1a73e8", lineHeight: 1.3, marginBottom: 2 }}>
          {ad.title1}{ad.title2 ? ` | ${ad.title2}` : ""}
        </div>
        <div style={{ fontSize: 12, color: "#188038", marginBottom: 4 }}>
          {salonName.toLowerCase().replace(/\s+/g, "-")}.ru/{ad.url_path}
        </div>
        <div style={{ fontSize: 13, color: "#3c4043", lineHeight: 1.5 }}>{ad.text}</div>
      </div>

      {/* Поля с индикаторами */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { key: "t1", label: "Заголовок 1", value: ad.title1, len: ad.title1_len || ad.title1.length, max: 35 },
          { key: "t2", label: "Заголовок 2", value: ad.title2, len: ad.title2_len || ad.title2.length, max: 30 },
          { key: "tx", label: "Текст",       value: ad.text,   len: ad.text_len   || ad.text.length,   max: 81 },
        ].map(f => (
          <div key={f.key} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</span>
                <LenBadge len={f.len} max={f.max} />
              </div>
              <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.4 }}>{f.value}</div>
            </div>
            <button
              onClick={() => copyField(f.key, f.value)}
              style={{ background: "none", border: "none", cursor: "pointer", color: copied === f.key ? "hsl(145,60%,38%)" : "#CBD5E1", padding: "2px 0", flexShrink: 0 }}
            >
              <Icon name={copied === f.key ? "Check" : "Copy"} size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Кнопка генерации картинки ─────────────────────────────────────────────────
export function ImageGenButton({ groupName, keywords, ads }: { groupName: string; keywords: string[]; ads: Ad[] }) {
  const [state, setState] = useState<"idle" | "preparing" | "generating" | "done" | "error">("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const sessionId = localStorage.getItem("lk_session") || "";

  const generate = async () => {
    setState("preparing");
    setErrMsg("");
    try {
      const prepRes = await fetch(PREPARE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({
          group_name: groupName,
          keywords,
          ads: ads.map(a => ({ title1: a.title1, title2: a.title2, text: a.text })),
        }),
      });
      const prepData = await prepRes.json();
      if (!prepRes.ok) throw new Error(prepData.error || "Ошибка подготовки");

      const prompt = prepData.prompt;
      setState("generating");

      const genRes = await fetch(IMAGE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({ prompt, aspect_ratio: "1024x1024", use_salon_context: false }),
      });
      const genData = await genRes.json();
      if (!genRes.ok) throw new Error(genData.error || "Ошибка генерации");
      const url = genData.images?.[0]?.url;
      if (!url) throw new Error("Сервис не вернул изображение");
      setImageUrl(url);
      setState("done");
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : "Ошибка");
      setState("error");
    }
  };

  if (state === "done" && imageUrl) return (
    <div style={{ marginTop: 14, borderRadius: 12, overflow: "hidden", border: "1.5px solid #E8ECF0" }}>
      <img src={imageUrl} alt="Рекламное изображение" style={{ width: "100%", display: "block", maxHeight: 320, objectFit: "cover" }} />
      <div style={{ padding: "10px 14px", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span style={{ fontSize: 11, color: "#64748B" }}>1024×1024 · Яндекс.Директ</span>
        <div style={{ display: "flex", gap: 8 }}>
          <a href={imageUrl} download="ad-image.png" target="_blank" rel="noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 5, background: ACCENT, color: "#fff", borderRadius: 7, padding: "6px 12px", fontSize: 11, fontWeight: 700, textDecoration: "none", fontFamily: "Montserrat,sans-serif" }}>
            <Icon name="Download" size={12} />
            Скачать
          </a>
          <button onClick={generate}
            style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px solid #E8ECF0", borderRadius: 7, padding: "6px 10px", fontSize: 11, fontWeight: 600, color: "#64748B", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            <Icon name="RefreshCw" size={12} />
            Ещё раз
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ marginTop: 14 }}>
      {(state === "preparing" || state === "generating") ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "hsl(280,60%,97%)", borderRadius: 10, padding: "12px 16px", border: "1px solid hsl(280,60%,88%)" }}>
          <Icon name="Loader2" size={16} style={{ color: "hsl(280,60%,52%)", animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 13, color: "hsl(280,60%,40%)", fontWeight: 600 }}>
            {state === "preparing" ? "Подготовка…" : "Генерирую изображение… ~30–60 сек"}
          </span>
        </div>
      ) : (
        <button onClick={generate}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "hsl(280,60%,97%)", border: "1.5px dashed hsl(280,60%,75%)", borderRadius: 10, padding: "11px 18px", fontSize: 13, fontWeight: 700, color: "hsl(280,60%,45%)", cursor: "pointer", fontFamily: "Montserrat,sans-serif", width: "100%" }}>
          <Icon name="ImagePlus" size={16} />
          Сгенерировать рекламное изображение 1024×1024 — 5 ⚡
        </button>
      )}
      {state === "error" && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#DC2626", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="AlertCircle" size={13} />
          {errMsg}
        </div>
      )}
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#94A3B8" }}>
        <Icon name="Info" size={11} />
        Сгенерированные изображения сохраняются в истории инструмента <b style={{ color: "#64748B" }}>«Генерация изображений»</b>
      </div>
    </div>
  );
}
