import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT } from "./LkAdminShared";

const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
function sid() { return localStorage.getItem("lk_session") || ""; }

interface ToolCost {
  id: number; tool_key: string; name: string;
  category: string; energy_cost: number; is_free: boolean;
}
interface Salon { id: number; name: string; credits_balance: number; username: string; full_name: string; }

const CATEGORY_LABELS: Record<string, string> = {
  marketing:     "Маркетинг",
  analytics:     "Аналитика",
  images:        "Изображения",
  specialist:    "Специалисты",
  communication: "Коммуникации",
  free:          "Бесплатные",
};

export function EnergySection() {
  const [tools, setTools]     = useState<ToolCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState<string | null>(null);
  const [edited, setEdited]   = useState<Record<string, string>>({});
  const [saved, setSaved]     = useState<string | null>(null);

  // Пополнение баланса
  const [salons, setSalons]   = useState<Salon[]>([]);
  const [salonId, setSalonId] = useState("");
  const [amount, setAmount]   = useState("");
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupMsg, setTopupMsg]         = useState("");

  useEffect(() => {
    fetch(`${LK_URL}?action=tool_costs`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json()).then(d => Array.isArray(d) && setTools(d))
      .catch(() => {}).finally(() => setLoading(false));
    fetch(`${LK_URL}?action=admin_salons`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json()).then(d => Array.isArray(d) && setSalons(d))
      .catch(() => {});
  }, []);

  async function saveCost(tool: ToolCost) {
    const val = edited[tool.tool_key];
    if (val === undefined) return;
    setSaving(tool.tool_key);
    try {
      await fetch(`${LK_URL}?action=tool_costs_update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ tool_key: tool.tool_key, energy_cost: parseInt(val) }),
      });
      setTools(p => p.map(t => t.tool_key === tool.tool_key ? { ...t, energy_cost: parseInt(val) } : t));
      setSaved(tool.tool_key);
      setTimeout(() => setSaved(null), 2000);
    } finally { setSaving(null); }
  }

  async function handleTopup() {
    if (!salonId || !amount) return;
    setTopupLoading(true); setTopupMsg("");
    try {
      const r = await fetch(`${LK_URL}?action=energy_topup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ salon_id: parseInt(salonId), amount: parseInt(amount) }),
      });
      const d = await r.json();
      if (d.ok) setTopupMsg(`✅ Начислено. Новый баланс: ${d.new_balance} ⚡`);
      else setTopupMsg(`❌ ${d.error}`);
    } finally { setTopupLoading(false); }
  }

  const byCategory = Object.entries(CATEGORY_LABELS).map(([cat, label]) => ({
    cat, label, items: tools.filter(t => t.category === cat),
  })).filter(g => g.items.length > 0);

  const inp: React.CSSProperties = { padding: "7px 10px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, fontFamily: "Montserrat,sans-serif", background: "#fff", color: "#0F172A", outline: "none", width: 70, textAlign: "center" };

  return (
    <div>
      {/* Ручное пополнение */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 22px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>⚡ Пополнить баланс салона</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 5 }}>Салон</div>
            <select
              value={salonId}
              onChange={e => setSalonId(e.target.value)}
              style={{ ...inp, width: "100%", cursor: "pointer" }}
            >
              <option value="">Выберите салон...</option>
              {salons.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.username}) — {s.credits_balance} ⚡
                </option>
              ))}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#777", marginBottom: 5 }}>Количество ⚡</div>
            <input style={{ ...inp, width: 120 }} type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="150" />
          </div>
          <button onClick={handleTopup} disabled={topupLoading || !salonId || !amount} style={{ padding: "9px 18px", borderRadius: 9, border: "none", background: (!salonId || !amount) ? "#ccc" : ACCENT, color: "#fff", fontSize: 13, fontWeight: 700, cursor: (!salonId || !amount) ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif" }}>
            {topupLoading ? "..." : "Начислить"}
          </button>
        </div>
        {topupMsg && <div style={{ marginTop: 10, fontSize: 13, color: "#555" }}>{topupMsg}</div>}
      </div>

      {/* Таблица стоимостей */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Стоимость инструментов</div>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>Изменения применяются сразу для всех салонов</div>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#bbb" }}>Загрузка...</div>
        ) : (
          byCategory.map(({ cat, label, items }) => (
            <div key={cat}>
              <div style={{ padding: "10px 22px", background: "#f8f8f5", fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1 }}>
                {label}
              </div>
              {items.map(tool => {
                const val = edited[tool.tool_key] ?? String(tool.energy_cost);
                const changed = val !== String(tool.energy_cost);
                const isSaved = saved === tool.tool_key;
                return (
                  <div key={tool.tool_key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 22px", borderBottom: "1px solid #F1F5F9" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#0F172A", fontWeight: 500 }}>{tool.name}</div>
                      <div style={{ fontSize: 11, color: "#bbb", marginTop: 1 }}>{tool.tool_key}</div>
                    </div>
                    {tool.is_free ? (
                      <span style={{ fontSize: 12, color: "hsl(145,60%,40%)", fontWeight: 700, background: "hsl(145,60%,96%)", borderRadius: 6, padding: "3px 10px" }}>Бесплатно</span>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input
                          style={{ ...inp, borderColor: changed ? ACCENT : "#E2E8F0" }}
                          type="number" min="0" max="100"
                          value={val}
                          onChange={e => setEdited(p => ({ ...p, [tool.tool_key]: e.target.value }))}
                        />
                        <span style={{ fontSize: 12, color: "#aaa" }}>⚡</span>
                        {changed && (
                          <button onClick={() => saveCost(tool)} disabled={saving === tool.tool_key}
                            style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                            {saving === tool.tool_key ? "..." : "Сохранить"}
                          </button>
                        )}
                        {isSaved && <Icon name="Check" size={16} style={{ color: "hsl(145,60%,40%)" }} />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}