import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Tournament, MyTournament, apiGet, apiPost, ACCENT, Block, F } from "./LkChampionshipShared";

export function SubmitWorkView({ tournament: t, my, onBack, onSaved }:
  { tournament: Tournament; my: MyTournament; onBack: () => void; onSaved: () => void }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [servicesDone, setServicesDone] = useState("");
  const [masterName, setMasterName] = useState("");
  const [toolsUsed, setToolsUsed] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [photos, setPhotos] = useState<{ url: string; caption: string }[]>([{ url: "", caption: "" }]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!my.work_id);
  const [err, setErr] = useState("");

  const votingStarted = t.voting_starts ? new Date(t.voting_starts) <= new Date() : t.status === "voting";
  const canEdit = !votingStarted;

  // Загружаем существующую работу
  useEffect(() => {
    if (!my.work_id) return;
    setLoading(true);
    apiGet("my_work", { tournament_id: String(t.id) }).then(d => {
      const w = d.work;
      if (!w) return;
      setTitle(w.title || "");
      setDescription(w.description || "");
      setStory(w.story || "");
      setServicesDone(w.services_done || "");
      setMasterName(w.master_name || "");
      setToolsUsed(w.tools_used || "");
      setVideoUrl(w.video_url || "");
      const p = typeof w.photos === "string" ? JSON.parse(w.photos) : (w.photos || []);
      setPhotos(p.length > 0 ? p : [{ url: "", caption: "" }]);
    }).finally(() => setLoading(false));
  }, [my.work_id, t.id]);

  const addPhoto = () => setPhotos(p => [...p, { url: "", caption: "" }]);
  const removePhoto = (i: number) => setPhotos(p => p.filter((_, j) => j !== i));
  const updatePhoto = (i: number, field: "url" | "caption", val: string) =>
    setPhotos(p => p.map((ph, j) => j === i ? { ...ph, [field]: val } : ph));

  const save = async () => {
    if (!canEdit) return;
    const validPhotos = photos.filter(p => p.url.trim());
    if (!title.trim()) { setErr("Укажите название работы"); return; }
    if (validPhotos.length === 0) { setErr("Добавьте хотя бы одну ссылку на фото"); return; }
    setSaving(true); setErr("");
    const r = await apiPost("submit_work", {
      tournament_id: t.id, title, description, story,
      services_done: servicesDone, master_name: masterName,
      tools_used: toolsUsed, video_url: videoUrl, photos: validPhotos,
    });
    setSaving(false);
    if (r.ok) onSaved();
    else setErr(r.error || "Ошибка при сохранении");
  };

  if (loading) return (
    <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8" }}>Загрузка работы…</div>
  );

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14, marginBottom: 16, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
        <Icon name="ArrowLeft" size={14} /> Назад
      </button>

      {/* Блокировка если голосование началось */}
      {!canEdit && (
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#c2410c" }}>🔒 Редактирование недоступно</div>
          <div style={{ fontSize: 12, color: "#92400e", marginTop: 4 }}>Голосование уже началось — работа зафиксирована.</div>
        </div>
      )}

      <div style={{ background: "#eef2ff", borderRadius: 12, padding: "14px 16px", marginBottom: 20, border: "1px solid #c7d2fe" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", marginBottom: 4 }}>🎯 ЗАДАНИЕ: {t.name}</div>
        <div style={{ fontSize: 13, color: "#3730a3" }}>{t.task_text}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, opacity: canEdit ? 1 : 0.6, pointerEvents: canEdit ? "auto" : "none" }}>
        <Block title="Основное">
          <F label="Название работы *" value={title} onChange={setTitle} placeholder="Летнее преображение клиентки" />
          <F label="Краткое описание (виден в галерее)" value={description} onChange={setDescription} placeholder="Что сделали, какой результат..." textarea />
        </Block>

        <Block title="Детали">
          <F label="Имя мастера" value={masterName} onChange={setMasterName} placeholder="Имя Фамилия" />
          <F label="Какие услуги выполнены" value={servicesDone} onChange={setServicesDone} placeholder="Антицеллюлитный массаж, обёртывание..." textarea />
          <F label="Инструменты и техники" value={toolsUsed} onChange={setToolsUsed} placeholder="Миофасциальный релиз, вакуумные банки..." />
          <F label="История клиента / результат (необязательно)" value={story} onChange={setStory} placeholder="Клиентка обратилась с жалобой на... За 3 сеанса удалось..." textarea />
        </Block>

        <Block title="Фотографии">
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>
            Загрузите фото на любой хостинг (Google Фото, Яндекс Диск, Dropbox) и вставьте прямую ссылку.<br />
            <b>Важно:</b> ссылка должна заканчиваться на .jpg, .png или быть прямой ссылкой на просмотр.
          </div>
          {photos.map((ph, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <F label={`Ссылка на фото ${i + 1}`} value={ph.url} onChange={v => updatePhoto(i, "url", v)} placeholder="https://..." />
                <F label="Подпись (необязательно)" value={ph.caption} onChange={v => updatePhoto(i, "caption", v)} placeholder="До процедуры / После / Процесс..." />
                {ph.url && ph.url.startsWith("http") && (
                  <img src={ph.url} alt="" onError={e => (e.currentTarget.style.display = "none")}
                    style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8, marginTop: 4 }} />
                )}
              </div>
              {photos.length > 1 && (
                <button onClick={() => removePhoto(i)} style={{ marginTop: 20, padding: "7px 10px", borderRadius: 8, border: "1.5px solid #fecaca", background: "#fff", color: "#ef4444", cursor: "pointer", fontSize: 14, flexShrink: 0 }}>
                  ✕
                </button>
              )}
            </div>
          ))}
          {photos.length < 5 && (
            <button onClick={addPhoto} style={{ padding: "8px 14px", borderRadius: 9, border: "1.5px dashed #cbd5e1", background: "#f8fafc", color: "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              + Добавить фото
            </button>
          )}
        </Block>

        <Block title="Видео (необязательно)">
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
            Ссылка на видео (ВКонтакте, RuTube, Google Drive). YouTube пока не поддерживается.
          </div>
          <F label="Ссылка на видео" value={videoUrl} onChange={setVideoUrl} placeholder="https://vk.com/video..." />
        </Block>
      </div>

      {err && <div style={{ color: "#ef4444", fontSize: 13, marginTop: 12 }}>{err}</div>}

      {canEdit && (
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button onClick={save} disabled={saving} style={{
            padding: "13px 28px", borderRadius: 10, border: "none",
            background: saving ? "#e2e8f0" : ACCENT, color: saving ? "#94a3b8" : "#fff",
            fontSize: 15, fontWeight: 700, cursor: saving ? "default" : "pointer",
          }}>
            {saving ? "Сохраняю…" : my.work_id ? "Сохранить изменения" : "Отправить работу на проверку"}
          </button>
          <button onClick={onBack} style={{ padding: "13px 20px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 14, cursor: "pointer" }}>
            Отмена
          </button>
        </div>
      )}
    </div>
  );
}
