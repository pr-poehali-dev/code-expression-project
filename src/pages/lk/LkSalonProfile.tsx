import { useState, useEffect, useRef } from "react";
import { lkApi } from "@/lib/lkApi";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";

interface Service { id?: number; name: string; price_min: string; price_max: string; duration_min: string; }

interface SalonForm {
  name: string; city: string; address: string; description: string;
  avg_check: string; monthly_revenue: string; clients_count: string; masters_count: string;
  target_audience: string; tone_of_voice: string;
  social_instagram: string; social_vk: string; social_telegram: string; main_goal: string;
}

const EMPTY_FORM: SalonForm = {
  name: "", city: "", address: "", description: "",
  avg_check: "", monthly_revenue: "", clients_count: "", masters_count: "",
  target_audience: "", tone_of_voice: "",
  social_instagram: "", social_vk: "", social_telegram: "", main_goal: "",
};

const TONE_OPTIONS = ["Тёплый и дружелюбный", "Профессиональный и экспертный", "Люксовый и статусный", "Молодёжный и энергичный"];

// ── Секция с заголовком ──────────────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f5f5f2", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `hsla(185,85%,32%,0.08)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={15} style={{ color: ACCENT }} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{title}</div>
      </div>
      <div style={{ padding: "16px 20px" }}>{children}</div>
    </div>
  );
}

// ── Поле ввода ────────────────────────────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 13px", borderRadius: 10, border: "1.5px solid #e8e8e4",
  fontSize: 13, outline: "none", fontFamily: "Montserrat, sans-serif",
  background: "#fafaf8", boxSizing: "border-box", color: "#1a1a1a",
};

export default function LkSalonProfile({ onSaved }: { onSaved?: () => void }) {
  const { user } = useLkAuth();
  const [form, setForm] = useState<SalonForm>(EMPTY_FORM);
  const [services, setServices] = useState<Service[]>([{ name: "", price_min: "", price_max: "", duration_min: "" }]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = !user?.salon_id;

  // Загружаем профиль
  useEffect(() => {
    if (!user?.salon_id) { setLoading(false); return; }
    lkApi.salonProfileGet().then((data: { salon: Record<string, unknown> | null; services: Record<string, unknown>[] }) => {
      if (data.salon) {
        const s = data.salon;
        setForm({
          name:            String(s.name || ""),
          city:            String(s.city || ""),
          address:         String(s.address || ""),
          description:     String(s.description || ""),
          avg_check:       s.avg_check != null ? String(s.avg_check) : "",
          monthly_revenue: s.monthly_revenue != null ? String(s.monthly_revenue) : "",
          clients_count:   s.clients_count != null ? String(s.clients_count) : "",
          masters_count:   s.masters_count != null ? String(s.masters_count) : "",
          target_audience: String(s.target_audience || ""),
          tone_of_voice:   String(s.tone_of_voice || ""),
          social_instagram:String(s.social_instagram || ""),
          social_vk:       String(s.social_vk || ""),
          social_telegram: String(s.social_telegram || ""),
          main_goal:       String(s.main_goal || ""),
        });
        setLogoUrl(s.logo_url ? String(s.logo_url) : null);
      }
      if (data.services?.length) {
        setServices(data.services.map((sv: Record<string, unknown>) => ({
          id:           sv.id as number | undefined,
          name:         String(sv.name || ""),
          price_min:    sv.price_min != null ? String(sv.price_min) : "",
          price_max:    sv.price_max != null ? String(sv.price_max) : "",
          duration_min: sv.duration_min != null ? String(sv.duration_min) : "",
        })));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user?.salon_id]);

  function f(k: keyof SalonForm, v: string) { setForm(p => ({ ...p, [k]: v })); }

  // Загрузка логотипа
  async function handleLogoUpload(file: File) {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = (reader.result as string).split(",")[1];
      try {
        const res = await lkApi.salonLogoUpload(b64, file.name) as { logo_url: string };
        setLogoUrl(res.logo_url);
      } catch { setError("Не удалось загрузить логотип"); }
      finally { setUploading(false); }
    };
    reader.readAsDataURL(file);
  }

  // Сохранение
  async function handleSave() {
    if (!form.name.trim()) { setError("Укажите название салона"); return; }
    setSaving(true); setError("");
    try {
      await lkApi.salonProfileSave({
        ...form,
        avg_check:       form.avg_check ? Number(form.avg_check) : null,
        monthly_revenue: form.monthly_revenue ? Number(form.monthly_revenue) : null,
        clients_count:   form.clients_count ? Number(form.clients_count) : null,
        masters_count:   form.masters_count ? Number(form.masters_count) : null,
        services: services.filter(s => s.name.trim()).map(s => ({
          id:           s.id,
          name:         s.name.trim(),
          price_min:    s.price_min ? Number(s.price_min) : null,
          price_max:    s.price_max ? Number(s.price_max) : null,
          duration_min: s.duration_min ? Number(s.duration_min) : null,
        })),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      // Обновляем страницу чтобы user.salon обновился
      setTimeout(() => window.location.reload(), 500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally { setSaving(false); }
  }

  function addService() { setServices(p => [...p, { name: "", price_min: "", price_max: "", duration_min: "" }]); }
  function removeService(i: number) { setServices(p => p.filter((_, j) => j !== i)); }
  function updateService(i: number, k: keyof Service, v: string) {
    setServices(p => p.map((s, j) => j === i ? { ...s, [k]: v } : s));
  }

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Icon name="Loader" size={24} style={{ color: ACCENT, animation: "spin 1s linear infinite" }} /></div>;
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>
          {isNew ? "Создайте профиль салона" : "Профиль салона"}
        </h2>
        <p style={{ fontSize: 13, color: "#888", margin: 0, lineHeight: 1.6 }}>
          Эта информация используется ИИ-инструментами для создания персонализированного контента под ваш салон.
        </p>
      </div>

      {/* ── Логотип ── */}
      <Section title="Логотип" icon="Image">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{ width: 80, height: 80, borderRadius: 16, border: "2px dashed #ddd", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", background: "#fafaf8", flexShrink: 0, position: "relative" }}
          >
            {uploading
              ? <Icon name="Loader" size={22} style={{ color: "#bbb", animation: "spin 1s linear infinite" }} />
              : logoUrl
                ? <img src={logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                : <Icon name="Upload" size={22} style={{ color: "#ccc" }} />
            }
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>
              {logoUrl ? "Логотип загружен" : "Загрузить логотип"}
            </div>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>PNG или JPG, до 2 МБ. Лучше всего на белом фоне.</div>
            <button onClick={() => fileRef.current?.click()} style={{ fontSize: 12, fontWeight: 600, color: ACCENT, background: "none", border: `1px solid ${ACCENT}`, borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              {logoUrl ? "Заменить" : "Выбрать файл"}
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); e.target.value = ""; }} />
        </div>
      </Section>

      {/* ── Основное ── */}
      <Section title="Основное" icon="Building2">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div style={{ gridColumn: "1/-1" }}>
            <Field label="Название салона *">
              <input style={inputStyle} value={form.name} onChange={e => f("name", e.target.value)} placeholder="Например: Студия красоты «Аура»" />
            </Field>
          </div>
          <Field label="Город">
            <input style={inputStyle} value={form.city} onChange={e => f("city", e.target.value)} placeholder="Москва" />
          </Field>
          <Field label="Адрес">
            <input style={inputStyle} value={form.address} onChange={e => f("address", e.target.value)} placeholder="ул. Пушкина, 10" />
          </Field>
          <div style={{ gridColumn: "1/-1" }}>
            <Field label="Описание салона" hint="2-3 предложения о вашем салоне — для контекста ИИ">
              <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 72 }} value={form.description} onChange={e => f("description", e.target.value)} placeholder="Студия премиального маникюра и педикюра. Работаем с 2018 года, специализируемся на авторском дизайне..." />
            </Field>
          </div>
        </div>
      </Section>

      {/* ── Услуги ── */}
      <Section title="Услуги и цены" icon="Scissors">
        <div style={{ marginBottom: 10 }}>
          {services.map((svc, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 8, alignItems: "end", marginBottom: 8 }}>
              <div>
                {i === 0 && <div style={{ fontSize: 11, fontWeight: 600, color: "#aaa", marginBottom: 4 }}>Услуга</div>}
                <input style={inputStyle} value={svc.name} onChange={e => updateService(i, "name", e.target.value)} placeholder="Маникюр с покрытием" />
              </div>
              <div>
                {i === 0 && <div style={{ fontSize: 11, fontWeight: 600, color: "#aaa", marginBottom: 4 }}>Цена от ₽</div>}
                <input style={inputStyle} type="number" value={svc.price_min} onChange={e => updateService(i, "price_min", e.target.value)} placeholder="1500" />
              </div>
              <div>
                {i === 0 && <div style={{ fontSize: 11, fontWeight: 600, color: "#aaa", marginBottom: 4 }}>Цена до ₽</div>}
                <input style={inputStyle} type="number" value={svc.price_max} onChange={e => updateService(i, "price_max", e.target.value)} placeholder="3000" />
              </div>
              <div>
                {i === 0 && <div style={{ fontSize: 11, fontWeight: 600, color: "#aaa", marginBottom: 4 }}>Мин.</div>}
                <input style={inputStyle} type="number" value={svc.duration_min} onChange={e => updateService(i, "duration_min", e.target.value)} placeholder="60" />
              </div>
              <button onClick={() => removeService(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: "10px 4px", marginTop: i === 0 ? 20 : 0 }}>
                <Icon name="X" size={15} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addService} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: ACCENT, background: `hsla(185,85%,32%,0.07)`, border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="Plus" size={13} />
          Добавить услугу
        </button>
      </Section>

      {/* ── Финансы ── */}
      <Section title="Финансовые показатели" icon="TrendingUp">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Field label="Средний чек (₽)" hint="Средняя стоимость одного визита">
            <input style={inputStyle} type="number" value={form.avg_check} onChange={e => f("avg_check", e.target.value)} placeholder="3500" />
          </Field>
          <Field label="Выручка в месяц (₽)" hint="Приблизительно">
            <input style={inputStyle} type="number" value={form.monthly_revenue} onChange={e => f("monthly_revenue", e.target.value)} placeholder="500000" />
          </Field>
          <Field label="Клиентов в месяц">
            <input style={inputStyle} type="number" value={form.clients_count} onChange={e => f("clients_count", e.target.value)} placeholder="120" />
          </Field>
          <Field label="Количество мастеров">
            <input style={inputStyle} type="number" value={form.masters_count} onChange={e => f("masters_count", e.target.value)} placeholder="5" />
          </Field>
        </div>
      </Section>

      {/* ── Маркетинг ── */}
      <Section title="Маркетинг и позиционирование" icon="Megaphone">
        <Field label="Целевая аудитория" hint="Кто ваши клиенты? Возраст, стиль жизни, ценности">
          <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 68 }} value={form.target_audience} onChange={e => f("target_audience", e.target.value)} placeholder="Женщины 25-45 лет, средний+ и премиум сегмент, ценят качество и индивидуальный подход..." />
        </Field>
        <Field label="Тон коммуникации (Tone of Voice)">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            {TONE_OPTIONS.map(t => (
              <button key={t} onClick={() => f("tone_of_voice", t)} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${form.tone_of_voice === t ? ACCENT : "#e0e0db"}`, background: form.tone_of_voice === t ? `hsla(185,85%,32%,0.08)` : "#fff", color: form.tone_of_voice === t ? ACCENT : "#666", fontWeight: form.tone_of_voice === t ? 700 : 400, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                {t}
              </button>
            ))}
          </div>
          <input style={inputStyle} value={form.tone_of_voice} onChange={e => f("tone_of_voice", e.target.value)} placeholder="Или введите свой вариант" />
        </Field>
        <Field label="Главная задача сейчас" hint="Что сейчас важнее всего? Это будет учитываться в рекомендациях.">
          <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 64 }} value={form.main_goal} onChange={e => f("main_goal", e.target.value)} placeholder="Увеличить повторные визиты, поднять средний чек, привлечь новых клиентов из Instagram..." />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 12px" }}>
          <Field label="Instagram">
            <input style={inputStyle} value={form.social_instagram} onChange={e => f("social_instagram", e.target.value)} placeholder="@mysalon" />
          </Field>
          <Field label="ВКонтакте">
            <input style={inputStyle} value={form.social_vk} onChange={e => f("social_vk", e.target.value)} placeholder="vk.com/mysalon" />
          </Field>
          <Field label="Telegram">
            <input style={inputStyle} value={form.social_telegram} onChange={e => f("social_telegram", e.target.value)} placeholder="@mysalon" />
          </Field>
        </div>
      </Section>

      {/* Ошибка и кнопка */}
      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c33", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="AlertCircle" size={14} />
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 8, background: saving ? "#aaa" : `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", border: "none", borderRadius: 12, padding: "13px 28px", fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: saving ? "none" : "0 4px 18px hsla(185,85%,32%,0.3)" }}>
          {saving
            ? <><Icon name="Loader" size={16} style={{ animation: "spin 1s linear infinite" }} /> Сохраняю...</>
            : <><Icon name="Save" size={16} /> {isNew ? "Создать профиль" : "Сохранить изменения"}</>
          }
        </button>
        {saved && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "hsl(145,60%,40%)", fontWeight: 600 }}>
            <Icon name="CheckCircle" size={16} />
            Сохранено!
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, padding: "12px 16px", background: "hsla(185,85%,32%,0.05)", borderRadius: 10, border: "1px solid hsla(185,85%,32%,0.12)" }}>
        <div style={{ fontSize: 12, color: "#777", lineHeight: 1.7 }}>
          <Icon name="Info" size={12} style={{ color: ACCENT, display: "inline", marginRight: 5 }} />
          Данные профиля — это <strong>ваш контекст для ИИ</strong>. Чем подробнее заполнено, тем точнее будут результаты инструментов: посты, расчёты, рекомендации — всё будет про ваш конкретный салон.
        </div>
      </div>
    </div>
  );
}
