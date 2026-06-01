import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, VideoSection } from "./ReviewsShared";
import { PlayIcon, DotsNav, SectionHeader } from "./ReviewsComponents";

function VideoBlock({ section }: { section: VideoSection }) {
  const [active, setActive] = useState(0);
  const current = section.videos[active];

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20, overflow: "hidden",
      boxShadow: "0 4px 40px rgba(0,0,0,0.4)", display: "flex", minHeight: 420,
    }} className="rev-video-wrap">
      {/* Список */}
      <div style={{
        width: 240, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: "18px 12px", display: "flex", flexDirection: "column", gap: 4,
        overflowY: "auto", background: "rgba(255,255,255,0.02)",
      }} className="rev-video-sidebar">
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: 0.8, padding: "4px 12px 8px", fontFamily: "Montserrat, sans-serif" }}>Видеоотзывы</div>
        {section.videos.map((v, i) => (
          <button key={v.id} onClick={() => setActive(i)} style={{
            all: "unset", cursor: "pointer",
            background: active === i ? "rgba(45,212,191,0.12)" : "transparent",
            border: active === i ? `1.5px solid rgba(45,212,191,0.35)` : "1.5px solid transparent",
            borderRadius: 12, padding: "9px 12px", display: "flex", alignItems: "center", gap: 10,
            transition: "all 0.2s",
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8, flexShrink: 0,
              background: active === i ? "rgba(45,212,191,0.15)" : "rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <PlayIcon color={active === i ? ACCENT : "rgba(255,255,255,0.3)"} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: active === i ? "#fff" : "rgba(255,255,255,0.7)", marginBottom: 1, fontFamily: "Montserrat, sans-serif" }}>{v.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{v.city}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 3, background: active === i ? "rgba(45,212,191,0.12)" : "rgba(255,255,255,0.05)", borderRadius: 5, padding: "1px 6px", marginTop: 3 }}>
                <Icon name="TrendingUp" size={10} style={{ color: active === i ? ACCENT : "rgba(255,255,255,0.3)" }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: active === i ? ACCENT : "rgba(255,255,255,0.3)" }}>{v.result}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      {/* Плеер */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, position: "relative", background: "#000", minHeight: 260 }}>
          <iframe key={current.id} src={`https://kinescope.io/embed/${current.id}`} allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write;" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
        </div>
        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: "#fff", fontFamily: "Montserrat, sans-serif" }}>{current.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{current.city} · {current.experience}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(45,212,191,0.1)", borderRadius: 8, padding: "6px 12px", border: "1px solid rgba(45,212,191,0.2)" }}>
            <Icon name="TrendingUp" size={12} style={{ color: ACCENT }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: ACCENT }}>{current.result}</span>
          </div>
        </div>
        <div style={{ padding: "0 20px 14px" }}>
          <DotsNav active={active} total={section.videos.length} onChange={setActive} />
        </div>
      </div>
    </div>
  );
}

function VideoBlockMobile({ section }: { section: VideoSection }) {
  const [active, setActive] = useState(0);
  const current = section.videos[active];
  return (
    <div>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", marginBottom: 14 }}>
        <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
          <iframe key={current.id} src={`https://kinescope.io/embed/${current.id}`} allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write;" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
        </div>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", fontFamily: "Montserrat, sans-serif" }}>{current.name}</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{current.city} · {current.experience}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(45,212,191,0.1)", borderRadius: 7, padding: "4px 10px" }}>
            <Icon name="TrendingUp" size={11} style={{ color: ACCENT }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: ACCENT }}>{current.result}</span>
          </div>
        </div>
        <div style={{ padding: "0 16px 12px" }}>
          <DotsNav active={active} total={section.videos.length} onChange={setActive} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {section.videos.map((v, i) => (
          <button key={v.id} onClick={() => setActive(i)} style={{
            all: "unset", cursor: "pointer",
            background: active === i ? "rgba(45,212,191,0.1)" : "rgba(255,255,255,0.03)",
            border: active === i ? `1.5px solid rgba(45,212,191,0.3)` : "1.5px solid rgba(255,255,255,0.07)",
            borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 7, flexShrink: 0, background: active === i ? "rgba(45,212,191,0.15)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PlayIcon color={active === i ? ACCENT : "rgba(255,255,255,0.3)"} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: active === i ? "#fff" : "rgba(255,255,255,0.7)", fontFamily: "Montserrat, sans-serif" }}>{v.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{v.city} · {v.experience}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 3, background: active === i ? "rgba(45,212,191,0.12)" : "rgba(255,255,255,0.05)", borderRadius: 5, padding: "2px 7px", flexShrink: 0 }}>
              <Icon name="TrendingUp" size={10} style={{ color: active === i ? ACCENT : "rgba(255,255,255,0.3)" }} />
              <span style={{ fontSize: 10.5, fontWeight: 600, color: active === i ? ACCENT : "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>{v.result}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReviewsVideoSection({ sections }: { sections: VideoSection[] }) {
  return (
    <section style={{ padding: "64px 0 0" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 44 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Play" size={14} style={{ color: ACCENT }} />
          </div>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: "#fff" }}>Видеоотзывы</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
          {sections.map((section) => (
            <div key={section.title}>
              <SectionHeader title={section.title} subtitle={section.subtitle} href={section.href} badge="ОНЛАЙН" linkText={section.linkText} />
              <div className="rev-video-desktop">
                <VideoBlock section={section} />
              </div>
              <div className="rev-video-mob">
                <VideoBlockMobile section={section} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
