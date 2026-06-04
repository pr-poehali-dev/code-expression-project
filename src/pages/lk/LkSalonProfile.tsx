import { useState, useEffect, useRef } from "react";
import { lkApi } from "@/lib/lkApi";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";

interface Service { id?: number; name: string; price_min: string; price_max: string; duration_min: string; }

interface SalonForm {
  name: string; city: string; address: string; description: string;
  avg_check: string; monthly_revenue: string; clients_count: string; masters_count: string;
  target_audience: string; tone_of_voice: string;
  social_instagram: string; social_vk: string; social_telegram: string; main_goal: string;
  has_medical_license: boolean;
}

const EMPTY_FORM: SalonForm = {
  name: "", city: "", address: "", description: "",
  avg_check: "", monthly_revenue: "", clients_count: "", masters_count: "",
  target_audience: "", tone_of_voice: "",
  social_instagram: "", social_vk: "", social_telegram: "", main_goal: "",
  has_medical_license: false,
};

function draftKey(userId: number) { return `lk_salon_draft_${userId}`; }
function servicesKey(userId: number) { return `lk_salon_services_draft_${userId}`; }

function saveDraft(userId: number, form: SalonForm, services: Service[]) {
  try {
    localStorage.setItem(draftKey(userId), JSON.stringify(form));
    localStorage.setItem(servicesKey(userId), JSON.stringify(services));
  } catch (_) { /* ignore */ }
}

function loadDraft(userId: number): { form: SalonForm | null; services: Service[] | null } {
  try {
    const f = localStorage.getItem(draftKey(userId));
    const s = localStorage.getItem(servicesKey(userId));
    return { form: f ? JSON.parse(f) : null, services: s ? JSON.parse(s) : null };
  } catch (_) { return { form: null, services: null }; }
}

function clearDraft(userId: number) {
  localStorage.removeItem(draftKey(userId));
  localStorage.removeItem(servicesKey(userId));
}

const TONE_OPTIONS = ["Тёплый и дружелюбный", "Профессиональный и экспертный", "Люксовый и статусный", "Молодёжный и энергичный"];

// ── Секция с заголовком ──────────────────────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", overflow: "hidden", marginBottom: 16, boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `hsla(185,85%,32%,0.1)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={15} style={{ color: ACCENT }} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{title}</div>
      </div>
      <div style={{ padding: "16px 20px" }}>{children}</div>
    </div>
  );
}

// ── Поле ввода ────────────────────────────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 5 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 13px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  fontSize: 13, outline: "none", fontFamily: "Montserrat, sans-serif",
  background: "#fff", boxSizing: "border-box", color: "#0F172A",
};

export default function LkSalonProfile({ onSaved }: { onSaved?: () => void }) {
  const { user } = useLkAuth();
  const uid = user?.id ?? 0;
  const draft = loadDraft(uid);
  const [form, setForm] = useState<SalonForm>(draft.form || EMPTY_FORM);
  const [services, setServices] = useState<Service[]>(draft.services || [{ name: "", price_min: "", price_max: "", duration_min: "" }]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [welcomeBonus, setWelcomeBonus] = useState(false);
  const hasDraft = !!(draft.form?.name);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = !user?.salon_id;

  // Загружаем профиль (сервер имеет приоритет над черновиком)
  useEffect(() => {
    if (!user?.salon_id) { setLoading(false); return; }
    lkApi.salonProfileGet().then((data: { salon: Record<string, unknown> | null; services: Record<string, unknown>[] }) => {
      if (data.salon) {
        clearDraft(uid); // Есть сохранённый профиль — черновик не нужен
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
          has_medical_license: Boolean(s.has_medical_license),
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

  // Автосохранение в localStorage при каждом изменении
  useEffect(() => {
    if (!loading && uid) saveDraft(uid, form, services);
  }, [form, services, loading, uid]);

  function f(k: keyof SalonForm, v: string) { setForm(p => ({ ...p, [k]: v })); }

  // Загрузка логотипа — со сжатием до 512px и качества 0.85
  async function handleLogoUpload(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setError("Файл слишком большой. Максимум 5 МБ.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const b64 = await resizeImage(file, 512, 0.85);
      const ext = file.name.split(".").pop() || "png";
      const res = await lkApi.salonLogoUpload(b64, `logo.${ext}`) as { logo_url: string };
      setLogoUrl(res.logo_url);
    } catch { setError("Не удалось загрузить логотип. Попробуйте файл меньшего размера."); }
    finally { setUploading(false); }
  }

  function resizeImage(file: File, maxSize: number, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize; }
        } else {
          if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("canvas error")); return; }
        ctx.drawImage(img, 0, 0, width, height);
        const isPng = file.type === "image/png";
        const dataUrl = canvas.toDataURL(isPng ? "image/png" : "image/jpeg", isPng ? undefined : quality);
        resolve(dataUrl.split(",")[1]);
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  // Сохранение
  async function handleSave() {
    if (!form.name.trim()) { setError("Укажите название салона"); return; }
    setSaving(true); setError("");
    try {
      const result = await lkApi.salonProfileSave({
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
      }) as { welcome_bonus?: boolean };
      clearDraft(uid);
      setSaved(true);
      if (result?.welcome_bonus) setWelcomeBonus(true);
      setTimeout(() => setSaved(false), 3000);
      if (onSaved) setTimeout(onSaved, 800);
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
      <div style={{ marginBottom: hasDraft && isNew ? 12 : 24 }}>
        <h2 style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>
          {isNew ? "Создайте профиль салона" : "Профиль салона"}
        </h2>
        <p style={{ fontSize: 13, color: "#888", margin: 0, lineHeight: 1.6 }}>
          Эта информация используется ИИ-инструментами для создания персонализированного контента под ваш салон.{" "}
          <span style={{ color: "#0F172A", fontWeight: 600 }}>Чем подробнее заполнен профиль — услуги, специалисты, цены, целевая аудитория — тем точнее анализ и бизнес-решения.</span>
        </p>
      </div>

      {/* Баннер подарка для нового пользователя */}
      {isNew && !hasDraft && (
        <div style={{ background: "linear-gradient(135deg, #0F172A, #112B3C)", borderRadius: 16, padding: "24px 28px", marginBottom: 28, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="Gift" size={24} style={{ color: "#2DD4BF" }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
              Заполните профиль и получите 100 энергий в подарок
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
              Укажите название, услуги и описание салона — и мы зачислим бонус сразу после сохранения.
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 10, padding: "10px 18px", flexShrink: 0 }}>
            <Icon name="Zap" size={18} style={{ color: "#2DD4BF" }} />
            <span style={{ fontSize: 22, fontWeight: 800, color: "#2DD4BF" }}>100</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>энергий</span>
          </div>
        </div>
      )}

      {/* Баннер восстановленного черновика */}
      {hasDraft && isNew && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "hsl(40,90%,96%)", border: "1px solid hsl(40,90%,82%)", borderRadius: 12, padding: "11px 16px", marginBottom: 20 }}>
          <Icon name="RotateCcw" size={15} style={{ color: "hsl(40,90%,40%)", flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: "hsl(40,90%,35%)", fontWeight: 600 }}>
            Данные восстановлены — продолжайте заполнять с того места, где остановились.
          </div>
          <button onClick={() => { clearDraft(uid); setForm(EMPTY_FORM); setServices([{ name: "", price_min: "", price_max: "", duration_min: "" }]); }}
            style={{ marginLeft: "auto", fontSize: 11, color: "hsl(40,90%,50%)", background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}>
            Очистить
          </button>
        </div>
      )}

      {/* ── Логотип ── */}
      <Section title="Логотип" icon="Image">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{ width: 80, height: 80, borderRadius: 16, border: "2px dashed #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", background: "#fff", flexShrink: 0, position: "relative" }}
          >
            {uploading
              ? <Icon name="Loader" size={22} style={{ color: "#bbb", animation: "spin 1s linear infinite" }} />
              : logoUrl
                ? <img src={logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                : <Icon name="Upload" size={22} style={{ color: "#ccc" }} />
            }
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>
              {logoUrl ? "Логотип загружен" : "Загрузить логотип"}
            </div>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>PNG или JPG, до 5 МБ. Квадратный формат, белый или прозрачный фон.</div>
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
        <Field label="Медицинская лицензия" hint="Актуально для массажа, остеопатии и других медицинских услуг. Влияет на доступные каналы рекламы.">
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
            <input
              type="checkbox"
              checked={form.has_medical_license}
              onChange={e => setForm(p => ({ ...p, has_medical_license: e.target.checked }))}
              style={{ width: 18, height: 18, accentColor: ACCENT, cursor: "pointer" }}
            />
            <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.4 }}>
              Есть медицинская лицензия
              <span style={{ display: "block", fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                Открывает дополнительные каналы рекламы: медагрегаторы, Яндекс по медзапросам
              </span>
            </span>
          </label>
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

      {/* Баннер приветственного бонуса */}
      {welcomeBonus && (
        <div style={{ marginTop: 20, borderRadius: 20, overflow: "hidden", animation: "fadeIn 0.5s ease", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}} @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
          <div style={{ background: "linear-gradient(135deg, hsl(280,70%,55%), hsl(220,80%,55%), hsl(185,85%,42%))", padding: "28px 28px 24px", color: "#fff", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 12, animation: "float 2s ease infinite" }}>🎁</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>
              Добро пожаловать!
            </div>
            <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.6, marginBottom: 20 }}>
              Мы зачислили на баланс вашего салона
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.2)", borderRadius: 16, padding: "14px 28px", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}>
              <span style={{ fontSize: 36 }}>⚡</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>100</div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>энергий в подарок</div>
              </div>
            </div>
            <div style={{ marginTop: 20, fontSize: 13, opacity: 0.8, lineHeight: 1.6 }}>
              Используйте ИИ-инструменты прямо сейчас —<br />генерируйте посты, анализируйте команду и многое другое.
            </div>
            <button
              onClick={() => setWelcomeBonus(false)}
              style={{ marginTop: 20, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 24px", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              Начать работу →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}