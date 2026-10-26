import { useEffect, useState } from "react";
import { partnerRequest } from "./api";
import { SEGMENTS, FORMATS, GRAY } from "./data";
import { Btn, Notice, Field, card, inputCss } from "./ui";

interface Props { me: { partner: Record<string, any> }; reload: () => void }

const H = (label: string, hint: string, example?: string, required = false) => ({ label, hint, example, required, limit: 0 });

export default function PartnerProfile({ me, reload }: Props) {
  const p = me.partner;
  const [f, setF] = useState({
    business_name: p.business_name || "", contact_name: p.contact_name || "", website: p.website || "", description: p.description || "",
    specializations: p.specializations || "", geography: p.geography || "", work_format: p.work_format || "", phone: p.phone || "",
    audience_segments: (p.audience_segments || []) as string[],
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => { setMsg(null); }, [f]);
  const set = (k: string, v: any) => setF(x => ({ ...x, [k]: v }));
  const toggle = (k: string) => set("audience_segments", f.audience_segments.includes(k) ? f.audience_segments.filter(x => x !== k) : [...f.audience_segments, k]);

  const save = async () => {
    setBusy(true);
    try { await partnerRequest("profile_save", { body: f }); setMsg({ ok: true, text: "Профиль сохранён" }); reload(); }
    catch (e) { setMsg({ ok: false, text: (e as Error).message }); }
    finally { setBusy(false); }
  };

  return (
    <div style={{ ...card, maxWidth: 720 }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, margin: "0 0 4px" }}>Профиль партнёра</h2>
      <p style={{ fontSize: 13.5, color: GRAY, margin: "0 0 20px" }}>Эти сведения видит модератор. Не указывайте лишних персональных данных.</p>
      <Field hint={H("Название организации или имя", "Так вас будут знать пользователи, когда ИИ порекомендует вашу услугу.", "Студия маркетинга «Лайм»", true)}>
        <input style={inputCss} value={f.business_name} maxLength={255} onChange={e => set("business_name", e.target.value)} />
      </Field>
      <Field hint={H("Контактное лицо", "Человек, с которым связывается модератор.", undefined, true)}>
        <input style={inputCss} value={f.contact_name} maxLength={255} onChange={e => set("contact_name", e.target.value)} />
      </Field>
      <Field hint={H("Сайт", "Адрес сайта или страницы специалиста. Необязательно.", "https://example.ru")}>
        <input style={inputCss} value={f.website} maxLength={500} onChange={e => set("website", e.target.value)} />
      </Field>
      <Field hint={H("Чем вы занимаетесь", "Пара предложений о вашей деятельности. Без рекламных обещаний.")}>
        <textarea style={{ ...inputCss, minHeight: 90, resize: "vertical" }} value={f.description} maxLength={1500} onChange={e => set("description", e.target.value)} />
      </Field>
      <Field hint={H("Специализация", "Например: маркетинг для салонов, позиционирование частной практики.")}>
        <input style={inputCss} value={f.specializations} maxLength={500} onChange={e => set("specializations", e.target.value)} />
      </Field>
      <Field hint={H("С кем вы работаете", "Отметьте группы клиентов, с которыми вы действительно работаете.")}>
        <div style={{ display: "grid", gap: 8 }}>
          {Object.entries(SEGMENTS).map(([k, v]) => (
            <label key={k} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={f.audience_segments.includes(k)} onChange={() => toggle(k)} style={{ accentColor: "#14B8A6" }} />{v}
            </label>
          ))}
        </div>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
        <Field hint={H("География работы", "Регион или «вся Россия, онлайн».")}>
          <input style={inputCss} value={f.geography} maxLength={255} onChange={e => set("geography", e.target.value)} />
        </Field>
        <Field hint={H("Формат работы", "Онлайн, офлайн или оба варианта.")}>
          <select style={inputCss} value={f.work_format} onChange={e => set("work_format", e.target.value)}>
            <option value="">Не выбрано</option>
            {Object.entries(FORMATS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
      </div>
      <Field hint={H("Телефон", "Необязательно. Нужен только для связи с модератором, пользователям не показывается.")}>
        <input style={inputCss} value={f.phone} maxLength={100} onChange={e => set("phone", e.target.value)} />
      </Field>
      {msg && <div style={{ marginBottom: 12 }}><Notice kind={msg.ok ? "success" : "error"}>{msg.text}</Notice></div>}
      <Btn onClick={save} disabled={busy}>{busy ? "Сохраняем…" : "Сохранить профиль"}</Btn>
    </div>
  );
}
