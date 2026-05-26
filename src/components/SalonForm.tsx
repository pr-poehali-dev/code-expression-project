import { useState } from "react";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 24%)";
const SEND_URL = "https://functions.poehali.dev/13844979-19e6-463d-bb8e-fddd2b08479f";

const ROLES = ["Владелец", "Управляющий", "Администратор", "Другое"];
const MASSAGE_STATUS = ["Да, есть", "Нет", "Запускаем"];
const FORMATS = [
  "5 шагов к массажу, который приносит деньги",
  "Аудит салона",
  "Обучение персонала",
  "Обучение администраторов",
  "Формат Стандарт",
  "Формат Премиум салон",
  "Dok Диалог Business",
  "Корпоративный доступ к платформе",
  "Пока не знаю, нужна консультация",
];

const inp: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 10,
  border: "1.5px solid #e0e0e0", fontSize: 14,
  fontFamily: "Montserrat, sans-serif", outline: "none",
  boxSizing: "border-box", background: "#fff", transition: "border-color 0.15s",
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#e55", marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function SalonForm({ defaultFormat }: { defaultFormat?: string }) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", role: "", salon: "", city: "",
    staff: "", format: defaultFormat ?? "", massage: "", comment: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Укажите имя";
    if (!form.phone.trim()) e.phone = "Укажите телефон";
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Некорректный email";
    if (!form.salon.trim()) e.salon = "Укажите название салона";
    if (!agreed) e.agreed = "Необходимо согласие";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true); setSubmitError("");

    const message = [
      `🏢 B2B-заявка — Для салонов`,
      `Имя: ${form.name}`,
      `Телефон: ${form.phone}`,
      form.email ? `Email: ${form.email}` : null,
      `Роль: ${form.role || "не указана"}`,
      `Салон: ${form.salon}`,
      form.city ? `Город: ${form.city}` : null,
      form.staff ? `Мастеров: ${form.staff}` : null,
      `Массаж сейчас: ${form.massage || "не указано"}`,
      `Интересует: ${form.format || "не указано"}`,
      form.comment ? `Комментарий: ${form.comment}` : null,
      `Страница: ${window.location.pathname}`,
    ].filter(Boolean).join("\n");

    try {
      await fetch(SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, contact: form.phone, message }),
      });
      setSent(true);
      type WY = Window & { ym?: (id: unknown, t: string, n: string) => void };
      if ((window as WY).ym) (window as WY).ym!(undefined, "reachGoal", "salon_form_submit_success");
    } catch {
      setSubmitError("Не удалось отправить. Попробуйте ещё раз или напишите напрямую.");
      type WY = Window & { ym?: (id: unknown, t: string, n: string) => void };
      if ((window as WY).ym) (window as WY).ym!(undefined, "reachGoal", "salon_form_submit_error");
    } finally {
      setLoading(false);
    }
  };

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = ACCENT);
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = "#e0e0e0");

  if (sent) return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: `hsl(185,85%,95%)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
      </div>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, marginBottom: 10 }}>Заявка принята</div>
      <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, maxWidth: 420, margin: "0 auto" }}>
        Спасибо. Мы получили заявку и свяжемся с вами, чтобы обсудить задачу салона и подходящий формат работы.
      </p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="salon-form-grid">
        <Field label="Имя" required>
          <input style={{ ...inp, borderColor: errors.name ? "#e55" : "#e0e0e0" }} value={form.name} onChange={set("name")} placeholder="Ваше имя" onFocus={focus} onBlur={blur} />
          {errors.name && <div style={{ fontSize: 12, color: "#e55", marginTop: 4 }}>{errors.name}</div>}
        </Field>
        <Field label="Телефон" required>
          <input style={{ ...inp, borderColor: errors.phone ? "#e55" : "#e0e0e0" }} value={form.phone} onChange={set("phone")} placeholder="+7 999 000 00 00" onFocus={focus} onBlur={blur} />
          {errors.phone && <div style={{ fontSize: 12, color: "#e55", marginTop: 4 }}>{errors.phone}</div>}
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="salon-form-grid">
        <Field label="Email">
          <input style={{ ...inp, borderColor: errors.email ? "#e55" : "#e0e0e0" }} value={form.email} onChange={set("email")} placeholder="mail@example.com" type="email" onFocus={focus} onBlur={blur} />
          {errors.email && <div style={{ fontSize: 12, color: "#e55", marginTop: 4 }}>{errors.email}</div>}
        </Field>
        <Field label="Роль">
          <select style={inp} value={form.role} onChange={set("role")} onFocus={focus} onBlur={blur}>
            <option value="">Выберите роль</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="salon-form-grid">
        <Field label="Название салона" required>
          <input style={{ ...inp, borderColor: errors.salon ? "#e55" : "#e0e0e0" }} value={form.salon} onChange={set("salon")} placeholder="Название вашего салона" onFocus={focus} onBlur={blur} />
          {errors.salon && <div style={{ fontSize: 12, color: "#e55", marginTop: 4 }}>{errors.salon}</div>}
        </Field>
        <Field label="Город">
          <input style={inp} value={form.city} onChange={set("city")} placeholder="Москва" onFocus={focus} onBlur={blur} />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="salon-form-grid">
        <Field label="Количество мастеров">
          <input style={inp} value={form.staff} onChange={set("staff")} placeholder="Например: 5" onFocus={focus} onBlur={blur} />
        </Field>
        <Field label="Массажное направление сейчас">
          <select style={inp} value={form.massage} onChange={set("massage")} onFocus={focus} onBlur={blur}>
            <option value="">Выберите...</option>
            {MASSAGE_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Что актуально">
        <select style={inp} value={form.format} onChange={set("format")} onFocus={focus} onBlur={blur}>
          <option value="">Выберите направление</option>
          {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </Field>

      <Field label="Комментарий">
        <textarea style={{ ...inp, minHeight: 90, resize: "vertical" } as React.CSSProperties} value={form.comment} onChange={set("comment")} placeholder="Опишите задачу или вопрос" onFocus={focus} onBlur={blur} />
      </Field>

      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3, accentColor: ACCENT, flexShrink: 0, width: 16, height: 16 }} />
        <span style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
          Согласен с{" "}
          <a href="/privacy" target="_blank" style={{ color: ACCENT, textDecoration: "none" }}>политикой конфиденциальности</a>
        </span>
      </label>
      {errors.agreed && <div style={{ fontSize: 12, color: "#e55", marginTop: -8 }}>{errors.agreed}</div>}

      {submitError && <div style={{ fontSize: 13, color: "#e55", padding: "10px 14px", background: "#fff0f0", borderRadius: 8 }}>{submitError}</div>}

      <button type="submit" disabled={loading} style={{
        padding: "15px 24px", borderRadius: 12, border: "none",
        cursor: loading ? "default" : "pointer",
        background: loading ? "#ccc" : `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
        color: "#fff", fontSize: 15, fontWeight: 700,
        fontFamily: "Montserrat, sans-serif", transition: "all 0.2s",
      }}>
        {loading ? "Отправляем..." : "Обсудить внедрение для салона"}
      </button>

      <style>{`
        @media (max-width: 640px) {
          .salon-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}