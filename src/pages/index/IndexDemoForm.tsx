import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { setPodelamTrial } from "@/lib/podelamTrial";
import { calcGapAmount, calcGrowthPoints, fmt, DemoGrowthPoint } from "@/lib/podelamDemoCalc";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

interface FormState {
  niche: string;
  avg_check: string;
  current_revenue: string;
  target_revenue: string;
  base_size: string;
  repeat_rate: string;
  free_slots_per_week: string;
  has_addon_services: boolean;
  addon_services_text: string;
  lead_source: string;
}

const INITIAL: FormState = {
  niche: "", avg_check: "", current_revenue: "", target_revenue: "",
  base_size: "", repeat_rate: "", free_slots_per_week: "",
  has_addon_services: false, addon_services_text: "", lead_source: "",
};

export default function IndexDemoForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [result, setResult] = useState<{ gap: number; points: DemoGrowthPoint[] } | null>(null);

  const set = (k: keyof FormState, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0",
    fontSize: 14, fontFamily: "Inter,sans-serif", background: "#fff", boxSizing: "border-box",
    color: DARK, outline: "none",
  };
  const label: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: GRAY, marginBottom: 6, display: "block" };

  const handleCalc = () => {
    if (!form.avg_check || !form.current_revenue || !form.target_revenue) {
      setError("Заполните средний чек, текущий и желаемый доход");
      return;
    }
    if (!agreed) {
      setError("Примите политику конфиденциальности");
      return;
    }
    setError("");
    const profile = {
      avg_check: Number(form.avg_check) || 0,
      current_revenue: Number(form.current_revenue) || 0,
      target_revenue: Number(form.target_revenue) || 0,
      base_size: Number(form.base_size) || 0,
      repeat_rate: Number(form.repeat_rate) || 0,
      free_slots_per_week: Number(form.free_slots_per_week) || 0,
      has_addon_services: form.has_addon_services,
      addon_services_text: form.addon_services_text,
    };
    setResult({ gap: calcGapAmount(profile), points: calcGrowthPoints(profile) });
  };

  const handleRegister = () => {
    setPodelamTrial({
      niche: form.niche,
      avg_check: Number(form.avg_check) || 0,
      current_revenue: Number(form.current_revenue) || 0,
      target_revenue: Number(form.target_revenue) || 0,
      clients_per_month: 0,
      base_size: Number(form.base_size) || 0,
      repeat_rate: Number(form.repeat_rate) || 0,
      free_slots_per_week: Number(form.free_slots_per_week) || 0,
      has_addon_services: form.has_addon_services,
      addon_services_text: form.addon_services_text.trim(),
      lead_source: form.lead_source,
    });
    navigate("/cabinet");
  };

  return (
    <section id="demo-form" style={{ padding: "120px 32px", background: `radial-gradient(120% 100% at 20% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "5%", left: "-8%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 56, alignItems: "start" }} className="demo-form-grid">
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Попробуйте бесплатно</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              Узнайте, где лежат ваши деньги
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.62)", lineHeight: 1.7, fontWeight: 300, marginBottom: 28 }}>
              Заполните несколько цифр о своей ситуации — «ПоДелам» посчитает разрыв до цели и покажет точки роста. План действий откроется после регистрации.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["Calculator", "Расчёт по формулам — без затрат на ИИ"],
                ["Lock", "Результат закрыт до регистрации"],
                ["Sparkles", "После входа — уже готовый план в кабинете"],
              ].map(([icon, text], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={icon} size={16} style={{ color: TEAL }} />
                  </div>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: 300 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 18, padding: "28px 26px", boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>
            {!result ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={label}>Средний чек, ₽ *</label>
                    <input style={inputStyle} type="number" value={form.avg_check} onChange={e => set("avg_check", e.target.value)} placeholder="2500" />
                  </div>
                  <div>
                    <label style={label}>Размер базы клиентов</label>
                    <input style={inputStyle} type="number" value={form.base_size} onChange={e => set("base_size", e.target.value)} placeholder="120" />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={label}>Доход сейчас, ₽/мес *</label>
                    <input style={inputStyle} type="number" value={form.current_revenue} onChange={e => set("current_revenue", e.target.value)} placeholder="110000" />
                  </div>
                  <div>
                    <label style={label}>Желаемый доход, ₽/мес *</label>
                    <input style={inputStyle} type="number" value={form.target_revenue} onChange={e => set("target_revenue", e.target.value)} placeholder="180000" />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={label}>% повторных визитов</label>
                    <input style={inputStyle} type="number" value={form.repeat_rate} onChange={e => set("repeat_rate", e.target.value)} placeholder="35" />
                  </div>
                  <div>
                    <label style={label}>Свободных окон в неделю</label>
                    <input style={inputStyle} type="number" value={form.free_slots_per_week} onChange={e => set("free_slots_per_week", e.target.value)} placeholder="7" />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={label}>Ниша / услуга</label>
                  <input style={inputStyle} value={form.niche} onChange={e => set("niche", e.target.value)} placeholder="Например: массаж, маникюр, стрижки" />
                </div>
                <div style={{ marginBottom: 18 }}>
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
                        style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
                        value={form.addon_services_text}
                        onChange={e => set("addon_services_text", e.target.value)}
                        placeholder="Например: уход за кожей головы — 800 ₽, пакет из 4 массажей — 6000 ₽"
                      />
                    </div>
                  )}
                </div>

                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 16 }}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => { setAgreed(e.target.checked); if (e.target.checked) setError(""); }}
                    style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1 }}
                  />
                  <span style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.5 }}>
                    Я принимаю{" "}
                    <Link to="/privacy" target="_blank" style={{ color: TEAL2, textDecoration: "none", fontWeight: 500 }} onClick={e => e.stopPropagation()}>
                      политику конфиденциальности
                    </Link>{" "}
                    и даю согласие на обработку персональных данных
                  </span>
                </label>

                {error && <div style={{ fontSize: 13, color: "#DC2626", background: "#FEF2F2", borderRadius: 8, padding: "8px 12px", marginBottom: 16 }}>{error}</div>}

                <button
                  onClick={handleCalc}
                  disabled={!agreed}
                  style={{
                    width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                    background: agreed ? `linear-gradient(135deg,${TEAL},${TEAL2})` : "#E2E8F0",
                    color: agreed ? DARK : "#94A3B8", fontSize: 15, fontWeight: 700, cursor: agreed ? "pointer" : "not-allowed",
                    fontFamily: "Inter,sans-serif",
                  }}
                >
                  Показать точки роста
                </button>
              </>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <Icon name="Target" size={18} style={{ color: TEAL2 }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>
                    Не хватает {fmt(Math.max(0, result.gap))} ₽ до цели
                  </div>
                </div>

                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, filter: "blur(6px)", userSelect: "none", pointerEvents: "none" }}>
                    {result.points.map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: "#F8FAFC", border: "1px solid #E8ECF0" }}>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: DARK }}>{p.title}</div>
                          <div style={{ fontSize: 12, color: "#94A3B8" }}>{p.action}</div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "hsl(145,60%,35%)", whiteSpace: "nowrap" }}>+{fmt(p.potential)} ₽</div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 12, textAlign: "center",
                    background: "rgba(255,255,255,0.35)", borderRadius: 12, padding: 16,
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="Lock" size={18} style={{ color: TEAL }} />
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: DARK, maxWidth: 280 }}>
                      План найден. Зарегистрируйтесь, чтобы открыть точки роста и получить дела на сегодня
                    </div>
                    <button
                      onClick={handleRegister}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "12px 24px", borderRadius: 10, border: "none",
                        background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
                        color: DARK, fontSize: 14, fontWeight: 700, cursor: "pointer",
                        fontFamily: "Inter,sans-serif", whiteSpace: "nowrap",
                      }}
                    >
                      <Icon name="Unlock" size={15} />
                      Открыть план бесплатно
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setResult(null)}
                  style={{ marginTop: 16, background: "none", border: "none", color: GRAY, fontSize: 12.5, cursor: "pointer", fontFamily: "Inter,sans-serif", padding: 0 }}
                >
                  ← Изменить данные
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .demo-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}