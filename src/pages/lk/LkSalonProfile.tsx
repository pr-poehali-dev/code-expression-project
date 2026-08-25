import { useState, useEffect, useRef } from "react";
import { lkApi } from "@/lib/lkApi";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, SalonForm, Service, EMPTY_FORM, loadDraft, saveDraft, clearDraft } from "./SalonProfileTypes";
import { LogoSection, BasicSection, ServicesSection, FinanceSection, MarketingSection } from "./SalonProfileSections";
import { GiftBanner, DraftRestoredBanner, DiagnosticBanner } from "./SalonProfileBanners";

const SEO_ANALYZER_URL = "https://functions.poehali.dev/3603658f-6f23-4de6-b671-73bb1832b4e0";

export default function LkSalonProfile({ onSaved, onGoToSeo, onOpenDiagnostic }: { onSaved?: () => void; onGoToSeo?: () => void; onOpenDiagnostic?: () => void }) {
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
  const hasDraft = !!(draft.form?.name);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = !user?.salon_id;
  const [seoStatus, setSeoStatus] = useState<"idle"|"loading"|"found"|"not_found">("idle");
  const [seoScore, setSeoScore] = useState<number|null>(null);

  // Загружаем профиль (сервер имеет приоритет над черновиком)
  useEffect(() => {
    if (!user?.salon_id) { setLoading(false); return; }
    lkApi.salonProfileGet().then((data: { salon: Record<string, unknown> | null; services: Record<string, unknown>[] }) => {
      if (data.salon) {
        clearDraft(uid);
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
          website_url:     String(s.website_url || ""),
          goals:           Array.isArray(s.goals) ? s.goals as string[] : [],
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

  // Фоновый SEO-анализ при добавлении сайта
  async function runBackgroundSeoAnalysis(url: string) {
    if (!url || !user?.salon_id) return;
    setSeoStatus("loading");
    const sessionId = localStorage.getItem("lk_session") || "";
    try {
      const res = await fetch(SEO_ANALYZER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({ url, is_main_page: true, is_background: true }),
      });
      const data = await res.json();
      if (res.ok && data.score != null) {
        setSeoStatus("found");
        setSeoScore(data.score);
      } else {
        setSeoStatus("not_found");
      }
    } catch {
      setSeoStatus("not_found");
    }
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
        website_url:     form.website_url || null,
        services: services.filter(s => s.name.trim()).map(s => ({
          id:           s.id,
          name:         s.name.trim(),
          price_min:    s.price_min ? Number(s.price_min) : null,
          price_max:    s.price_max ? Number(s.price_max) : null,
          duration_min: s.duration_min ? Number(s.duration_min) : null,
        })),
      });
      clearDraft(uid);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (onSaved) setTimeout(onSaved, 800);
      if (form.website_url && seoStatus === "idle") {
        runBackgroundSeoAnalysis(form.website_url);
      }
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
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8 }}>
          <Icon name="ShieldCheck" size={13} style={{ color: "#22c55e", flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#aaa" }}>Данные профиля используются только внутри вашего кабинета и не передаются третьим лицам.</span>
        </div>
      </div>

      {/* Диагностика роста салона PRO — доступна, если заполнены ключевые показатели */}
      {onOpenDiagnostic && (
        <DiagnosticBanner
          ready={!!(form.name.trim() && form.avg_check && form.monthly_revenue)}
          onOpen={onOpenDiagnostic}
        />
      )}

      {/* Баннер подарка для нового пользователя */}
      {isNew && !hasDraft && <GiftBanner />}

      {/* Баннер восстановленного черновика */}
      {hasDraft && isNew && (
        <DraftRestoredBanner
          uid={uid}
          onClear={() => { setForm(EMPTY_FORM); setServices([{ name: "", price_min: "", price_max: "", duration_min: "" }]); }}
        />
      )}

      <LogoSection
        logoUrl={logoUrl}
        uploading={uploading}
        fileRef={fileRef}
        onFileChange={handleLogoUpload}
      />

      <BasicSection form={form} f={f} />

      <ServicesSection
        services={services}
        addService={addService}
        removeService={removeService}
        updateService={updateService}
      />

      <FinanceSection form={form} f={f} />

      <MarketingSection
        form={form}
        f={f}
        setForm={setForm}
        seoStatus={seoStatus}
        seoScore={seoScore}
        onGoToSeo={onGoToSeo}
      />

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