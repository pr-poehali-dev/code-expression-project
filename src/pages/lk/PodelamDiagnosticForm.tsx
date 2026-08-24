import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, PODELAM_FAST_URL, sid } from "./podelamShared";

// ── Форма диагностики (8-12 вопросов) ─────────────────────────────────────────
export default function DiagnosticForm({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] = useState({
    niche: "", avg_check: "", current_revenue: "", target_revenue: "",
    clients_per_month: "", base_size: "", repeat_rate: "", free_slots_per_week: "",
    has_addon_services: false, addon_services_text: "", lead_source: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0",
    fontSize: 14, fontFamily: "Montserrat,sans-serif", background: "#fff", boxSizing: "border-box",
    color: "#0F172A", outline: "none",
  };
  const label: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" };

  const submit = async () => {
    if (!form.avg_check || !form.current_revenue || !form.target_revenue) {
      setError("Заполните средний чек, текущий и желаемый доход");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${PODELAM_FAST_URL}?action=podelam_save_profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({
          niche: form.niche,
          avg_check: Number(form.avg_check),
          current_revenue: Number(form.current_revenue),
          target_revenue: Number(form.target_revenue),
          clients_per_month: Number(form.clients_per_month) || 0,
          base_size: Number(form.base_size) || 0,
          repeat_rate: Number(form.repeat_rate) || 0,
          free_slots_per_week: Number(form.free_slots_per_week) || 0,
          has_addon_services: form.has_addon_services,
          addon_services_text: form.addon_services_text.trim(),
          lead_source: form.lead_source,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка сохранения"); return; }
      onSaved();
    } catch {
      setError("Не удалось сохранить. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Icon name="Compass" size={26} style={{ color: "#fff" }} />
        </div>
        <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>ПоДелам — навигатор дохода</h1>
        <p style={{ fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.6 }}>
          Расскажите о своей ситуации — ИИ найдёт, где лежат деньги, и составит план на сегодня из ваших инструментов.
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={label}>Ниша / услуга</label>
          <input style={inputStyle} value={form.niche} onChange={e => set("niche", e.target.value)} placeholder="Например: массаж, маникюр, стрижки" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={label}>Средний чек, ₽ *</label>
            <input style={inputStyle} type="number" value={form.avg_check} onChange={e => set("avg_check", e.target.value)} placeholder="2500" />
          </div>
          <div>
            <label style={label}>Клиентов в месяц</label>
            <input style={inputStyle} type="number" value={form.clients_per_month} onChange={e => set("clients_per_month", e.target.value)} placeholder="44" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={label}>Доход сейчас, ₽ в месяц *</label>
            <input style={inputStyle} type="number" value={form.current_revenue} onChange={e => set("current_revenue", e.target.value)} placeholder="110000" />
          </div>
          <div>
            <label style={label}>Желаемый доход, ₽ в месяц *</label>
            <input style={inputStyle} type="number" value={form.target_revenue} onChange={e => set("target_revenue", e.target.value)} placeholder="180000" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={label}>Размер базы клиентов</label>
            <input style={inputStyle} type="number" value={form.base_size} onChange={e => set("base_size", e.target.value)} placeholder="120" />
          </div>
          <div>
            <label style={label}>% повторных визитов</label>
            <input style={inputStyle} type="number" value={form.repeat_rate} onChange={e => set("repeat_rate", e.target.value)} placeholder="35" />
          </div>
        </div>

        <div>
          <label style={label}>Свободных окон в неделю</label>
          <input style={inputStyle} type="number" value={form.free_slots_per_week} onChange={e => set("free_slots_per_week", e.target.value)} placeholder="7" />
        </div>

        <div>
          <label style={label}>Откуда приходят записи</label>
          <input style={inputStyle} value={form.lead_source} onChange={e => set("lead_source", e.target.value)} placeholder="Instagram, сарафанное радио, реклама..." />
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.has_addon_services}
              onChange={e => {
                const checked = e.target.checked;
                setForm(p => ({ ...p, has_addon_services: checked, addon_services_text: checked ? p.addon_services_text : "" }));
              }}
              style={{ width: 18, height: 18 }}
            />
            <span style={{ fontSize: 13, color: "#374151" }}>Есть дополнительные услуги / пакеты</span>
          </label>
          {form.has_addon_services && (
            <div style={{ marginTop: 10 }}>
              <label style={label}>Какие именно? (название и цена — так ИИ даст точнее рекомендации)</label>
              <textarea
                style={{ ...inputStyle, minHeight: 64, resize: "vertical", fontFamily: "Montserrat,sans-serif" }}
                value={form.addon_services_text}
                onChange={e => set("addon_services_text", e.target.value)}
                placeholder="Например: уход за кожей головы — 800 ₽, парафинотерапия — 500 ₽, пакет из 4 массажей — 6000 ₽"
              />
            </div>
          )}
        </div>

        {error && <div style={{ fontSize: 13, color: "#DC2626", background: "#FEF2F2", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}

        <button
          onClick={submit}
          disabled={saving}
          style={{
            padding: "13px 0", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
            color: "#fff", fontSize: 15, fontWeight: 700, cursor: saving ? "default" : "pointer",
            fontFamily: "Montserrat,sans-serif", opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Считаем…" : "Получить план роста дохода"}
        </button>
      </div>
    </div>
  );
}