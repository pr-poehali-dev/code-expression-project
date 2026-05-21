import { useState, useEffect } from "react";
import { lkApi } from "@/lib/lkApi";
import Icon from "@/components/ui/icon";
import { ACCENT, BodyZone, Technique, Spinner, labelStyle, inputStyle, actionBtn, iconBtn } from "./LkAdminShared";

export function BodySection() {
  const [zones, setZones] = useState<BodyZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editZone, setEditZone] = useState<BodyZone | null>(null);
  const [editTech, setEditTech] = useState<Partial<Technique> & { zone_id?: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => lkApi.adminBodyZones().then(setZones).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const saveZone = async () => {
    if (!editZone) return;
    setSaving(true);
    try { await lkApi.adminBodyZoneSave(editZone); setEditZone(null); load(); }
    finally { setSaving(false); }
  };

  const saveTech = async () => {
    if (!editTech) return;
    setSaving(true);
    try { await lkApi.adminTechniqueSave(editTech); setEditTech(null); load(); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <p style={{ fontSize: 13, color: "#aaa", marginBottom: 16 }}>
        Кликни на зону чтобы добавить описание, диагностику и техники
      </p>

      {editZone && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Зона: {editZone.name}</h3>
          {[
            { key: "description", label: "Общее описание", rows: 3 },
            { key: "diagnosis",   label: "Диагностика",    rows: 5 },
            { key: "video_url",   label: "Видео диагностики (Kinescope URL)", rows: 1 },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={labelStyle}>{f.label}</label>
              <textarea
                rows={f.rows}
                value={(editZone as Record<string, string>)[f.key] || ""}
                onChange={e => setEditZone(p => p ? { ...p, [f.key]: e.target.value } : null)}
                style={{ ...inputStyle, height: f.rows * 28, resize: "vertical" }}
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={saveZone} disabled={saving} style={actionBtn(ACCENT)}>
              {saving ? "Сохраняю..." : "Сохранить"}
            </button>
            <button onClick={() => setEditZone(null)} style={actionBtn("#999")}>Отмена</button>
          </div>
        </div>
      )}

      {editTech && (
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>
            {editTech.id ? "Редактировать технику" : "Новая техника"}
          </h3>
          {[
            { key: "title",       label: "Название",              rows: 1 },
            { key: "description", label: "Описание / инструкция", rows: 5 },
            { key: "video_url",   label: "Видео (Kinescope URL)",  rows: 1 },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={labelStyle}>{f.label}</label>
              <textarea
                rows={f.rows}
                value={(editTech as Record<string, string | number | undefined>)[f.key] as string || ""}
                onChange={e => setEditTech(p => p ? { ...p, [f.key]: e.target.value } : null)}
                style={{ ...inputStyle, height: f.rows * 28, resize: "vertical" }}
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={saveTech} disabled={saving} style={actionBtn(ACCENT)}>
              {saving ? "Сохраняю..." : "Сохранить"}
            </button>
            <button onClick={() => setEditTech(null)} style={actionBtn("#999")}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {zones.map(zone => (
          <div key={zone.id} style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{zone.name}</div>
                <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                  {zone.diagnosis ? "✓ Диагностика" : "— нет диагностики"} · {zone.techniques.length} техник
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button onClick={() => setEditZone(zone)} style={iconBtn} title="Редактировать зону">
                  <Icon name="Edit2" size={15} />
                </button>
                <button
                  onClick={() => setEditTech({ zone_id: zone.id, title: "", description: "", video_url: "", sort_order: zone.techniques.length })}
                  style={iconBtn}
                  title="Добавить технику"
                >
                  <Icon name="Plus" size={15} />
                </button>
              </div>
            </div>
            {zone.techniques.length > 0 && (
              <div style={{ borderTop: "1px solid #f5f5f0", padding: "0 18px 10px" }}>
                {zone.techniques.map(tech => (
                  <div key={tech.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #fafafa" }}>
                    <Icon name="Zap" size={13} style={{ color: ACCENT, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#444", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {tech.title}
                    </span>
                    {tech.video_url && <Icon name="Video" size={13} style={{ color: "#aaa", flexShrink: 0 }} />}
                    <button onClick={() => setEditTech(tech)} style={{ ...iconBtn, width: 28, height: 28, flexShrink: 0 }}>
                      <Icon name="Edit2" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
