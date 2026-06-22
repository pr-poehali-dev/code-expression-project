import { useRef } from "react";
import { ACCENT, labelStyle, inputStyle, actionBtn, iconBtn } from "./LkAdminShared";
import Icon from "@/components/ui/icon";
import { LFile, Photo } from "./LkAdminCourses.types";

interface Props {
  videoUrls: string[];
  links: string[];
  photos: Photo[];
  files: LFile[];
  uploading: boolean;
  newVideo: string;
  newLink: { label: string; url: string };
  onNewVideoChange: (v: string) => void;
  onNewLinkChange: (l: { label: string; url: string }) => void;
  onAddVideo: () => void;
  onRemoveVideo: (i: number) => void;
  onAddLink: () => void;
  onRemoveLink: (i: number) => void;
  onUploadPhoto: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeletePhoto: (id: number) => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteFile: (id: number) => void;
}

function parseLinkLabel(s: string) {
  const parts = s.split("|");
  return parts.length === 2 ? { label: parts[0], url: parts[1] } : { label: s, url: s };
}

export default function LkAdminLessonMedia({
  videoUrls, links, photos, files, uploading,
  newVideo, newLink,
  onNewVideoChange, onNewLinkChange,
  onAddVideo, onRemoveVideo,
  onAddLink, onRemoveLink,
  onUploadPhoto, onDeletePhoto,
  onUploadFile, onDeleteFile,
}: Props) {
  const photoRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* Видео */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Видео с Кинескопа</div>
        {videoUrls.map((v, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#f8f8f6", borderRadius: 8 }}>
            <Icon name="Video" size={14} style={{ color: ACCENT, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 12, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
            <button style={iconBtn} onClick={() => onRemoveVideo(i)}><Icon name="X" size={13} /></button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...inputStyle, flex: 1 }} value={newVideo} onChange={e => onNewVideoChange(e.target.value)} placeholder="https://kinescope.io/..." onKeyDown={e => e.key === "Enter" && onAddVideo()} />
          <button style={actionBtn(ACCENT)} onClick={onAddVideo} disabled={!newVideo.trim()}><Icon name="Plus" size={14} /></button>
        </div>
      </div>

      {/* Ссылки */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Ссылки (Google Диск и др.)</div>
        {links.map((l, i) => {
          const { label, url } = parseLinkLabel(l);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#f8f8f6", borderRadius: 8 }}>
              <Icon name="Link" size={14} style={{ color: ACCENT, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 12, color: "#555" }}>{label !== url ? `${label} → ${url}` : url}</span>
              <button style={iconBtn} onClick={() => onRemoveLink(i)}><Icon name="X" size={13} /></button>
            </div>
          );
        })}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input style={inputStyle} value={newLink.label} onChange={e => onNewLinkChange({ ...newLink, label: e.target.value })} placeholder="Подпись ссылки (необязательно)" />
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inputStyle, flex: 1 }} value={newLink.url} onChange={e => onNewLinkChange({ ...newLink, url: e.target.value })} placeholder="https://drive.google.com/..." onKeyDown={e => e.key === "Enter" && onAddLink()} />
            <button style={actionBtn(ACCENT)} onClick={onAddLink} disabled={!newLink.url.trim()}><Icon name="Plus" size={14} /></button>
          </div>
        </div>
      </div>

      {/* Фото */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Фото к уроку</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {photos.map(p => (
            <div key={p.id} style={{ position: "relative" }}>
              <img src={p.url} alt="" style={{ width: 100, height: 100, borderRadius: 8, objectFit: "cover" }} />
              <button onClick={() => onDeletePhoto(p.id)} style={{ ...iconBtn, position: "absolute", top: 4, right: 4, width: 22, height: 22, background: "rgba(255,255,255,0.9)", color: "hsl(0,70%,60%)" }}>
                <Icon name="X" size={11} />
              </button>
            </div>
          ))}
          <div onClick={() => photoRef.current?.click()} style={{ width: 100, height: 100, borderRadius: 8, border: "2px dashed #e0e0dc", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#aaa", flexDirection: "column", gap: 4, fontSize: 11 }}>
            {uploading ? "..." : <><Icon name="ImagePlus" size={20} /><span>Добавить</span></>}
          </div>
        </div>
        <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onUploadPhoto} />
      </div>

      {/* Файлы */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Файлы для скачивания</div>
        {files.map(f => (
          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#f8f8f6", borderRadius: 8 }}>
            <Icon name="FileDown" size={14} style={{ color: ACCENT, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, color: "#444" }}>{f.name}</span>
            <button style={{ ...iconBtn, color: "hsl(0,70%,60%)" }} onClick={() => onDeleteFile(f.id)}><Icon name="Trash2" size={13} /></button>
          </div>
        ))}
        <button style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1.5px dashed #e0e0dc", borderRadius: 8, padding: "10px 14px", cursor: "pointer", color: "#888", fontSize: 13, fontWeight: 600 }} onClick={() => fileRef.current?.click()}>
          <Icon name="Upload" size={14} /> {uploading ? "Загружается..." : "Загрузить файл"}
        </button>
        <input ref={fileRef} type="file" style={{ display: "none" }} onChange={onUploadFile} />
      </div>
    </>
  );
}
