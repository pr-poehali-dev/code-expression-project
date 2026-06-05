import { useState } from "react";
import Icon from "@/components/ui/icon";
import { AdGroup, ACCENT, DIRECT_COLOR, copyToClipboard } from "./LkMarketingDirect.types";
import { AdPreview, ImageGenButton } from "./LkMarketingDirectAdCard";

// ── Блок запросов и минус-слов группы ────────────────────────────────────────
export function KeywordsBlock({ keywords, minusWords }: { keywords: string[]; minusWords: string[] }) {
  const [kwCopied, setKwCopied] = useState(false);
  const [minusCopied, setMinusCopied] = useState(false);

  const copyKw = () => {
    copyToClipboard(keywords.join("\n"));
    setKwCopied(true);
    setTimeout(() => setKwCopied(false), 2000);
  };

  const copyMinus = () => {
    copyToClipboard(minusWords.join(", "));
    setMinusCopied(true);
    setTimeout(() => setMinusCopied(false), 2000);
  };

  if (!keywords?.length && !minusWords?.length) return null;

  return (
    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      {keywords?.length > 0 && (
        <div style={{ background: "hsl(185,85%,97%)", border: "1px solid hsl(185,85%,82%)", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="Search" size={13} style={{ color: ACCENT }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>Ключевые запросы</span>
            </div>
            <button
              onClick={copyKw}
              style={{ display: "flex", alignItems: "center", gap: 4, background: kwCopied ? ACCENT : "transparent", color: kwCopied ? "#fff" : ACCENT, border: `1px solid ${ACCENT}`, borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
            >
              <Icon name={kwCopied ? "Check" : "Copy"} size={11} />
              {kwCopied ? "Скопировано" : "Скопировать"}
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {keywords.map((kw, i) => (
              <div key={i} style={{ fontSize: 12, color: "#334155", background: "#fff", borderRadius: 6, padding: "5px 10px", border: "1px solid hsl(185,85%,88%)" }}>
                {kw}
              </div>
            ))}
          </div>
        </div>
      )}

      {minusWords?.length > 0 && (
        <div style={{ background: "hsl(0,75%,97%)", border: "1px solid hsl(0,75%,85%)", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="MinusCircle" size={13} style={{ color: "hsl(0,70%,50%)" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "hsl(0,70%,45%)" }}>Минус-слова</span>
            </div>
            <button
              onClick={copyMinus}
              style={{ display: "flex", alignItems: "center", gap: 4, background: minusCopied ? "hsl(0,70%,50%)" : "transparent", color: minusCopied ? "#fff" : "hsl(0,70%,45%)", border: "1px solid hsl(0,70%,75%)", borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
            >
              <Icon name={minusCopied ? "Check" : "Copy"} size={11} />
              {minusCopied ? "Скопировано" : "Скопировать"}
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {minusWords.map((w, i) => (
              <span key={i} style={{ fontSize: 11, color: "hsl(0,60%,40%)", background: "#fff", borderRadius: 5, padding: "3px 8px", border: "1px solid hsl(0,70%,88%)" }}>
                −{w}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: "#94A3B8" }}>
            Формат для Директа: через запятую
          </div>
        </div>
      )}
    </div>
  );
}

// ── Общие минус-слова кампании ────────────────────────────────────────────────
export function CampaignMinusBlock({ minusWords }: { minusWords: string[] }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copy = () => {
    copyToClipboard(minusWords.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const preview = minusWords.slice(0, 12);
  const rest = minusWords.slice(12);

  return (
    <div style={{ marginTop: 24, background: "hsl(0,70%,97%)", border: "1.5px solid hsl(0,70%,85%)", borderRadius: 14, padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "hsl(0,70%,92%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="MinusCircle" size={16} style={{ color: "hsl(0,70%,45%)" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Минус-слова кампании</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Объединены из всех групп · {minusWords.length} слов</div>
          </div>
        </div>
        <button
          onClick={copy}
          style={{ display: "flex", alignItems: "center", gap: 6, background: copied ? "hsl(0,70%,45%)" : "#fff", color: copied ? "#fff" : "hsl(0,70%,45%)", border: "1.5px solid hsl(0,70%,75%)", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
        >
          <Icon name={copied ? "Check" : "Copy"} size={13} />
          {copied ? "Скопировано!" : "Скопировать все"}
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {(expanded ? minusWords : preview).map((w, i) => (
          <span key={i} style={{ fontSize: 11, color: "hsl(0,60%,38%)", background: "#fff", borderRadius: 5, padding: "3px 9px", border: "1px solid hsl(0,70%,88%)", fontWeight: 500 }}>
            −{w}
          </span>
        ))}
        {!expanded && rest.length > 0 && (
          <button
            onClick={() => setExpanded(true)}
            style={{ fontSize: 11, color: "#94A3B8", background: "#fff", border: "1px solid #E8ECF0", borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
          >
            +{rest.length} ещё
          </button>
        )}
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 5 }}>
        <Icon name="Info" size={11} />
        Вставьте в настройки кампании в Директе → «Минус-слова» — через запятую
      </div>
    </div>
  );
}

// ── Группа объявлений ─────────────────────────────────────────────────────────
export function AdGroupCard({ group, index, salonName, sourceKeywords }: { group: AdGroup; index: number; salonName: string; sourceKeywords: string[] }) {
  const [open, setOpen] = useState(index < 2);

  return (
    <div style={{ border: "1.5px solid #E8ECF0", borderRadius: 16, overflow: "hidden" }}>
      <div
        onClick={() => setOpen(p => !p)}
        style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: open ? "hsl(25,90%,97%)" : "#fff", borderBottom: open ? "1px solid #FFE4CC" : "none", transition: "background 0.15s" }}
      >
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "hsl(25,90%,93%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="MousePointerClick" size={16} style={{ color: DIRECT_COLOR }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{group.group}</div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{group.ads.length} варианта объявления</div>
        </div>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: "#94A3B8" }} />
      </div>

      {open && (
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
            {group.ads.map((ad, i) => (
              <AdPreview key={i} ad={ad} idx={i} salonName={salonName} />
            ))}
          </div>
          <KeywordsBlock
            keywords={group.keywords ?? []}
            minusWords={group.minus_words ?? []}
          />
          <ImageGenButton groupName={group.group} keywords={sourceKeywords} ads={group.ads} />
        </div>
      )}
    </div>
  );
}