import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { Work } from "./tournamentTypes";

interface TournamentWorksTabProps {
  works: Work[];
  isVoting: boolean;
  isFinished: boolean;
  votedIds: number[];
  voteLoading: number | null;
  tournamentSlug: string;
  tournamentName: string;
  onVote: (workId: number) => void;
}

export default function TournamentWorksTab({ works, isVoting, isFinished, votedIds, voteLoading, tournamentSlug, tournamentName, onVote }: TournamentWorksTabProps) {
  return (
    <div>
      {!isFinished && isVoting && (
        <ShareBanner url={`https://promtdialog.ru/championship/tournament/${tournamentSlug}`} tournamentName={tournamentName} />
      )}
      {works.length === 0 ? (
        <div style={{ textAlign: "center", padding: "56px 0" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🖼</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Работы пока не загружены</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Появятся после модерации</div>
        </div>
      ) : (
        <div className="ct-works-grid">
          {works.map((w, i) => (
            <WorkCard key={w.id} work={w} isVoting={isVoting} isFinished={isFinished}
              voted={votedIds.includes(w.id)} loading={voteLoading === w.id}
              onVote={() => onVote(w.id)} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function ShareBanner({ url, tournamentName }: { url: string; tournamentName: string }) {
  const [copied, setCopied] = useState(false);

  const shareText = `🏆 Голосование за лучшую работу — «${tournamentName}»!\n\nПоддержите своих мастеров красоты — один голос решает многое!\n\n👉 ${url}`;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const canNativeShare = typeof navigator.share === "function";

  const nativeShare = () => {
    navigator.share({ title: `Голосование — ${tournamentName}`, text: shareText, url });
  };

  return (
    <div style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius: 14, padding: "18px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 3 }}>🗳 Помогите выбрать победителя!</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
          Поделитесь страницей — друзья и клиенты тоже могут проголосовать
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        {canNativeShare && (
          <button onClick={nativeShare} style={{ padding: "9px 16px", borderRadius: 9, border: "none", background: "#14B8A6", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Поделиться
          </button>
        )}
        <button onClick={() => copy(shareText)} style={{ padding: "9px 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)", background: copied ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.1)", color: copied ? "#86efac" : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {copied ? "✓ Скопировано" : "Скопировать ссылку"}
        </button>
      </div>
    </div>
  );
}

function WorkCard({ work: w, isVoting, isFinished, voted, loading, onVote, index }:
  { work: Work; isVoting: boolean; isFinished: boolean; voted: boolean; loading: boolean; onVote: () => void; index: number }) {
  const [open, setOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const photos = w.photos || [];
  const photo = photos[0]?.url;
  // Во время голосования скрываем название и данные салона — показываем только номер
  const displayTitle = isVoting ? `Работа #${index + 1}` : w.title;
  const hasText = !!(w.description || w.story || w.services_done || w.master_name || w.tools_used || w.video_url);
  const hasDetails = hasText || photos.length > 0;

  return (
    <div className="ct-work-card">
      <div className="ct-work-photo" style={{ background: photo ? `url(${photo}) center/cover` : "#f1f5f9" }}
        onClick={() => photo && setLightboxIndex(0)}>
        {!photo && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🖼</div>
        )}
        {photo && (
          <div className="ct-photo-zoom"><Icon name="ZoomIn" size={15} style={{ color: "#fff" }} /></div>
        )}
        {w.final_place && w.final_place <= 3 && (
          <div style={{ position: "absolute", top: 10, left: 10, background: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
            {["🥇","🥈","🥉"][w.final_place - 1]} {w.final_place} место
          </div>
        )}
        {photos.length > 1 && (
          <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.55)", borderRadius: 20, padding: "3px 9px", fontSize: 11, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="Images" size={12} /> {photos.length}
          </div>
        )}
      </div>
      <div className="ct-work-body">
        {displayTitle && <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 5 }}>{displayTitle}</div>}
        {w.description && (
          <p style={{ margin: "0 0 8px", fontSize: 12, color: "#64748b", lineHeight: 1.6, display: open ? "block" : "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: open ? "visible" : "hidden" }}>
            {w.description}
          </p>
        )}

        {hasDetails && (
          <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", padding: 0, marginBottom: 8, color: "#14B8A6", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            {open ? "Свернуть" : "Подробнее о работе"} <Icon name={open ? "ChevronUp" : "ChevronDown"} size={13} />
          </button>
        )}

        {open && (
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", marginBottom: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            {photos.length > 1 && (
              <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
                {photos.map((p, i) => (
                  <img key={i} src={p.url} alt={p.caption || ""} title={p.caption || ""}
                    className="ct-thumb" onClick={() => setLightboxIndex(i)} />
                ))}
              </div>
            )}
            {!hasText && photos.length <= 1 && (
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Мастер не добавил описание к этой работе</div>
            )}
            {w.master_name && (
              <div style={{ fontSize: 12, color: "#374151" }}><b style={{ color: "#0f172a" }}>Мастер:</b> {w.master_name}</div>
            )}
            {w.services_done && (
              <div style={{ fontSize: 12, color: "#374151" }}><b style={{ color: "#0f172a" }}>Услуги:</b> {w.services_done}</div>
            )}
            {w.tools_used && (
              <div style={{ fontSize: 12, color: "#374151" }}><b style={{ color: "#0f172a" }}>Инструменты и техники:</b> {w.tools_used}</div>
            )}
            {w.story && (
              <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}><b style={{ color: "#0f172a" }}>История клиента:</b><br />{w.story}</div>
            )}
            {w.video_url && (
              <a href={w.video_url} target="_blank" rel="nofollow noopener noreferrer" style={{ fontSize: 12, color: "#14B8A6", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="Play" size={13} /> Смотреть видео
              </a>
            )}
          </div>
        )}

        {isFinished && w.salon_name && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
            {w.salon_logo && <img src={w.salon_logo} alt="" style={{ width: 26, height: 26, borderRadius: 6, objectFit: "cover" }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{w.salon_name}</div>
              {w.salon_city && <div style={{ fontSize: 11, color: "#94a3b8" }}>{w.salon_city}</div>}
            </div>
            {w.salon_url && (
              <a href={w.salon_url} target="_blank" rel="nofollow noopener noreferrer"
                style={{ fontSize: 11, color: "#14B8A6", fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>сайт →</a>
            )}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            ❤️ <b style={{ color: "#0f172a" }}>{w.votes_count.toLocaleString("ru")}</b>
          </div>
          {isVoting && (
            <button onClick={onVote} disabled={voted || loading}
              className={`ct-vote-btn ${voted ? "ct-vote-btn-voted" : "ct-vote-btn-active"}`}
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "…" : voted ? "✓ Голос отдан" : "Голосовать"}
            </button>
          )}
        </div>
      </div>

      {lightboxIndex !== null && photos.length > 0 && (
        <PhotoLightbox photos={photos} index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(i => i === null ? 0 : (i - 1 + photos.length) % photos.length)}
          onNext={() => setLightboxIndex(i => i === null ? 0 : (i + 1) % photos.length)} />
      )}
    </div>
  );
}

function PhotoLightbox({ photos, index, onClose, onPrev, onNext }:
  { photos: { url: string; caption?: string }[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  const p = photos[index];

  return (
    <div className="ct-lightbox" onClick={onClose}>
      <div className="ct-lightbox-counter">{index + 1} / {photos.length}</div>
      <button className="ct-lightbox-close" onClick={onClose}><Icon name="X" size={20} /></button>
      {photos.length > 1 && (
        <button className="ct-lightbox-nav ct-lightbox-prev" onClick={e => { e.stopPropagation(); onPrev(); }}>
          <Icon name="ChevronLeft" size={22} />
        </button>
      )}
      <img src={p.url} alt={p.caption || ""} className="ct-lightbox-img" onClick={e => e.stopPropagation()} />
      {photos.length > 1 && (
        <button className="ct-lightbox-nav ct-lightbox-next" onClick={e => { e.stopPropagation(); onNext(); }}>
          <Icon name="ChevronRight" size={22} />
        </button>
      )}
      {p.caption && <div className="ct-lightbox-caption">{p.caption}</div>}
    </div>
  );
}
