import { useState } from "react";
import Icon from "@/components/ui/icon";
import { PodelamResource } from "../podelamShared";

// ── «Мои ресурсы» — постоянный чек-лист площадок под карточкой Пульса ──────────────────────
function ResourceRow({ r, onSave }: { r: PodelamResource; onSave: (key: string, connected: boolean, url: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState(r.url || "");

  const toggle = () => {
    if (!r.connected) { setEditing(true); return; }
    onSave(r.key, false, "");
  };

  const save = () => {
    onSave(r.key, true, url.trim());
    setEditing(false);
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={toggle}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: `1.5px solid ${r.connected ? "#2DD4BF" : "rgba(255,255,255,0.25)"}`, background: r.connected ? "#2DD4BF" : "transparent", cursor: "pointer" }}
        >
          {r.connected && <Icon name="Check" size={12} style={{ color: "#0F172A" }} />}
        </button>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#fff", flex: 1 }}>{r.label}</span>
        {r.connected && r.url && (
          <a href={r.url.startsWith("http") ? r.url : `https://${r.url}`} target="_blank" rel="noreferrer"
             style={{ fontSize: 11, color: "#2DD4BF", display: "flex", alignItems: "center", gap: 3 }}>
            <Icon name="ExternalLink" size={11} /> Ссылка
          </a>
        )}
        {r.connected && (
          <button onClick={() => setEditing(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}>
            <Icon name="Pencil" size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
          </button>
        )}
      </div>
      {editing && (
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Ссылка на профиль/страницу (необязательно)"
            style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 7, padding: "7px 10px", fontSize: 12, color: "#fff", fontFamily: "Montserrat,sans-serif" }}
          />
          <button onClick={save} style={{ background: "#2DD4BF", border: "none", borderRadius: 7, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: "#0F172A", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            Сохранить
          </button>
        </div>
      )}
    </div>
  );
}

export default function ResourcesChecklist({ resources, onSave }: { resources: PodelamResource[]; onSave: (key: string, connected: boolean, url: string) => void }) {
  const [open, setOpen] = useState(false);
  const connectedCount = resources.filter(r => r.connected).length;
  const pct = resources.length > 0 ? Math.round(connectedCount / resources.length * 100) : 0;

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 18, marginTop: 18 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: open ? 14 : 0 }}
      >
        <Icon name="ListChecks" size={15} style={{ color: "#2DD4BF" }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#2DD4BF", textTransform: "uppercase", letterSpacing: 1, flex: 1, textAlign: "left" }}>Мои ресурсы</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{connectedCount} из {resources.length}</span>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={15} style={{ color: "rgba(255,255,255,0.4)" }} />
      </button>
      {!open && (
        <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#2DD4BF,#14B8A6)", borderRadius: 3 }} />
        </div>
      )}
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, marginBottom: 4 }}>
            Отметьте, где вы уже присутствуете — ИИ учтёт это и не будет советовать завести то, что уже есть, а подскажет,
            что размещать на уже подключённых площадках.
          </div>
          {resources.map(r => <ResourceRow key={r.key} r={r} onSave={onSave} />)}
        </div>
      )}
    </div>
  );
}
