import { useState } from "react";
import Icon from "@/components/ui/icon";
import { TEAL, DARK, GRAY, SERIF, SEND_URL, inputStyle } from "./DlyaShkolShared";

export default function PartnerForm() {
  const [form, setForm] = useState({
    school_name: "", contact_name: "", position: "", phone: "",
    messenger: "", website: "", email: "", graduates_per_year: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focus, setFocus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));
  const f = (k: string) => setFocus(p => ({ ...p, [k]: true }));
  const b = (k: string) => setFocus(p => ({ ...p, [k]: false }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.school_name.trim()) e.school_name = "Укажите название школы";
    if (!form.contact_name.trim()) e.contact_name = "Укажите ваше имя";
    if (!form.phone.trim()) e.phone = "Укажите телефон";
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Некорректный email";
    if (!agreed) e.agreed = "Необходимо согласие";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true); setSubmitError("");
    try {
      const res = await fetch(SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSent(true);
      else setSubmitError("Не удалось отправить. Попробуйте еще раз.");
    } catch {
      setSubmitError("Ошибка сети. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Icon name="CheckCircle" size={26} style={{ color: TEAL }} />
        </div>
        <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: DARK, margin: "0 0 10px" }}>Заявка отправлена</h3>
        <p style={{ fontSize: 15, color: GRAY, margin: 0, lineHeight: 1.6, fontWeight: 300 }}>Мы свяжемся с вами и расскажем, как подключить школу.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="school-form-grid">
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Название школы *</label>
          <input value={form.school_name} onChange={set("school_name")} placeholder="Школа мастеров..."
            style={inputStyle(!!focus.school_name)} onFocus={() => f("school_name")} onBlur={() => b("school_name")} />
          {errors.school_name && <div style={{ fontSize: 12, color: "#e55", marginTop: 4 }}>{errors.school_name}</div>}
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Ваше имя *</label>
          <input value={form.contact_name} onChange={set("contact_name")} placeholder="Иван Иванов"
            style={inputStyle(!!focus.contact_name)} onFocus={() => f("contact_name")} onBlur={() => b("contact_name")} />
          {errors.contact_name && <div style={{ fontSize: 12, color: "#e55", marginTop: 4 }}>{errors.contact_name}</div>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="school-form-grid">
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Должность</label>
          <input value={form.position} onChange={set("position")} placeholder="Директор, методист..."
            style={inputStyle(!!focus.position)} onFocus={() => f("position")} onBlur={() => b("position")} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Телефон *</label>
          <input value={form.phone} onChange={set("phone")} placeholder="+7 (___) ___-__-__"
            style={inputStyle(!!focus.phone)} onFocus={() => f("phone")} onBlur={() => b("phone")} />
          {errors.phone && <div style={{ fontSize: 12, color: "#e55", marginTop: 4 }}>{errors.phone}</div>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="school-form-grid">
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Telegram / WhatsApp</label>
          <input value={form.messenger} onChange={set("messenger")} placeholder="@username или номер"
            style={inputStyle(!!focus.messenger)} onFocus={() => f("messenger")} onBlur={() => b("messenger")} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Сайт школы</label>
          <input value={form.website} onChange={set("website")} placeholder="school.ru"
            style={inputStyle(!!focus.website)} onFocus={() => f("website")} onBlur={() => b("website")} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="school-form-grid">
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Email</label>
          <input value={form.email} onChange={set("email")} placeholder="mail@example.com" type="email"
            style={inputStyle(!!focus.email)} onFocus={() => f("email")} onBlur={() => b("email")} />
          {errors.email && <div style={{ fontSize: 12, color: "#e55", marginTop: 4 }}>{errors.email}</div>}
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: GRAY, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.7px" }}>Выпускников в год</label>
          <input value={form.graduates_per_year} onChange={set("graduates_per_year")} placeholder="Например: 150"
            style={inputStyle(!!focus.graduates_per_year)} onFocus={() => f("graduates_per_year")} onBlur={() => b("graduates_per_year")} />
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
        <div onClick={() => setAgreed(!agreed)} style={{
          width: 18, height: 18, borderRadius: 2, flexShrink: 0, marginTop: 1,
          border: `1.5px solid ${agreed ? TEAL : "#CBD5E1"}`,
          background: agreed ? TEAL : "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s", cursor: "pointer",
        }}>
          {agreed && <Icon name="Check" size={12} style={{ color: "#fff" }} />}
        </div>
        <span style={{ fontSize: 13, color: GRAY, lineHeight: 1.6, fontWeight: 300 }}>
          Я согласен(а) на обработку персональных данных в соответствии с{" "}
          <a href="/privacy" style={{ color: TEAL, textDecoration: "none", fontWeight: 500 }}>политикой конфиденциальности</a>
        </span>
      </label>
      {errors.agreed && <div style={{ fontSize: 12, color: "#e55" }}>{errors.agreed}</div>}

      {submitError && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: 4, padding: "10px 14px", fontSize: 13, color: "#BE123C" }}>
          <Icon name="AlertCircle" size={14} />
          {submitError}
        </div>
      )}

      <button type="submit" disabled={loading} style={{
        padding: "15px", borderRadius: 4, border: "none",
        background: loading ? "#E2E8F0" : `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
        color: loading ? GRAY : DARK,
        fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "Inter, sans-serif", letterSpacing: "0.3px", transition: "all 0.2s",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        {loading
          ? <><Icon name="Loader" size={15} style={{ animation: "spin 1s linear infinite" }} /> Отправляю...</>
          : <>Стать партнером</>
        }
      </button>
      <p style={{ fontSize: 12, color: GRAY, textAlign: "center", margin: 0, fontWeight: 300 }}>
        Мы свяжемся с вами и расскажем, как подключить школу.
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
