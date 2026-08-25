import Icon from "@/components/ui/icon";
import { ACCENT, TONE_OPTIONS, GOAL_OPTIONS, SalonForm, Service, Section, Field, inputStyle } from "./SalonProfileTypes";

// ── Логотип ───────────────────────────────────────────────────────────────────

interface LogoSectionProps {
  logoUrl: string | null;
  uploading: boolean;
  fileRef: React.RefObject<HTMLInputElement>;
  onFileChange: (file: File) => void;
}

export function LogoSection({ logoUrl, uploading, fileRef, onFileChange }: LogoSectionProps) {
  return (
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
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const file = e.target.files?.[0]; if (file) onFileChange(file); e.target.value = ""; }} />
      </div>
    </Section>
  );
}

// ── Основное ──────────────────────────────────────────────────────────────────

interface BasicSectionProps {
  form: SalonForm;
  f: (k: keyof SalonForm, v: string) => void;
}

export function BasicSection({ form, f }: BasicSectionProps) {
  return (
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
  );
}

// ── Услуги и цены ─────────────────────────────────────────────────────────────

interface ServicesSectionProps {
  services: Service[];
  addService: () => void;
  removeService: (i: number) => void;
  updateService: (i: number, k: keyof Service, v: string) => void;
}

export function ServicesSection({ services, addService, removeService, updateService }: ServicesSectionProps) {
  return (
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
  );
}

// ── Финансы ───────────────────────────────────────────────────────────────────

interface FinanceSectionProps {
  form: SalonForm;
  f: (k: keyof SalonForm, v: string) => void;
}

export function FinanceSection({ form, f }: FinanceSectionProps) {
  return (
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
  );
}

// ── Маркетинг и позиционирование ─────────────────────────────────────────────

interface MarketingSectionProps {
  form: SalonForm;
  f: (k: keyof SalonForm, v: string) => void;
  setForm: React.Dispatch<React.SetStateAction<SalonForm>>;
  seoStatus: "idle" | "loading" | "found" | "not_found";
  seoScore: number | null;
  onGoToSeo?: () => void;
}

export function MarketingSection({ form, f, setForm, seoStatus, seoScore, onGoToSeo }: MarketingSectionProps) {
  function toggleGoal(goal: string) {
    setForm(p => ({
      ...p,
      goals: p.goals.includes(goal) ? p.goals.filter(g => g !== goal) : [...p.goals, goal],
    }));
  }

  return (
    <Section title="Маркетинг и позиционирование" icon="Megaphone">
      <Field label="Цели салона" hint="Можно выбрать несколько — ИИ «ПоДелам» будет строить план с учётом этих целей">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {GOAL_OPTIONS.map(goal => {
            const active = form.goals.includes(goal);
            return (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                style={{
                  fontSize: 12, padding: "7px 13px", borderRadius: 8,
                  border: `1.5px solid ${active ? ACCENT : "#e0e0db"}`,
                  background: active ? `hsla(185,85%,32%,0.08)` : "#fff",
                  color: active ? ACCENT : "#666",
                  fontWeight: active ? 700 : 400, cursor: "pointer", fontFamily: "Montserrat,sans-serif",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {active && <Icon name="Check" size={12} />}
                {goal}
              </button>
            );
          })}
        </div>
      </Field>
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
      <Field label="Сайт салона" hint="Ссылка используется для SEO-анализа в разделе Маркетинг">
        <div style={{ position: "relative" }}>
          <input
            style={{ ...inputStyle, paddingRight: 36 }}
            value={form.website_url}
            onChange={e => f("website_url", e.target.value)}
            placeholder="https://mysalon.ru"
          />
          {form.website_url && (
            <Icon name="Globe" size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: ACCENT, pointerEvents: "none" }} />
          )}
        </div>
      </Field>

      {/* SEO-уведомление после фонового анализа */}
      {seoStatus === "loading" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, marginBottom: 14 }}>
          <Icon name="Loader2" size={14} style={{ color: "#1e40af", animation: "spin 1s linear infinite", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#1e40af", fontWeight: 600 }}>Анализируем ваш сайт...</span>
        </div>
      )}
      {seoStatus === "found" && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, marginBottom: 14 }}>
          <Icon name="CheckCircle2" size={18} style={{ color: "#16a34a", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>Мы проанализировали ваш сайт!</div>
            <div style={{ fontSize: 12, color: "#166534", marginTop: 2 }}>
              SEO-оценка: <strong>{seoScore}/100</strong>. Есть что улучшить — воспользуйтесь инструментом SEO-оптимизатора в разделе Маркетинг.
            </div>
          </div>
          {onGoToSeo && (
            <button onClick={onGoToSeo} style={{ padding: "7px 14px", borderRadius: 9, border: "none", background: "#16a34a", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}>
              Открыть SEO
            </button>
          )}
        </div>
      )}
      {seoStatus === "not_found" && form.website_url && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#fafafa", border: "1px solid #E2E8F0", borderRadius: 10, marginBottom: 14 }}>
          <Icon name="Globe" size={14} style={{ color: "#94A3B8", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#64748B" }}>Ссылка на сайт сохранена. Запустить анализ можно в разделе <strong>Маркетинг → SEO-оптимизатор</strong>.</span>
        </div>
      )}

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
  );
}