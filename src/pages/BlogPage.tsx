import { useEffect, useState } from "react";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const CONTENT_URL = (func2url as Record<string, string>)["masters-accrual"] || "";

interface Post {
  id: number;
  post_date: string;
  title: string;
  excerpt: string;
  hashtags: string;
  telegram_url: string | null;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${CONTENT_URL}?action=content_list&limit=30`)
      .then(r => r.json())
      .then(d => setPosts(d.posts || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff", minHeight: "100vh" }}>
      <Helmet>
        <title>Блог — полезные статьи для салонов красоты | Промт Диалог</title>
        <meta name="description" content="Экспертные статьи о росте дохода салона красоты: маркетинг, допродажи, работа с клиентами, управление мастерами." />
        <link rel="canonical" href="https://promtdialog.ru/blog" />
        <meta property="og:title" content="Блог Промт Диалог — статьи для салонов красоты" />
        <meta property="og:type" content="website" />
      </Helmet>

      <BizNavbar />

      <section style={{ padding: "160px 32px 60px", background: `linear-gradient(135deg, ${DARK}, #112B3C)` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEAL, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 18 }}>
            Блог
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px,5vw,52px)", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
            Полезные статьи для роста салона
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", marginTop: 18, fontWeight: 300 }}>
            Каждый день — новая статья о маркетинге, допродажах и управлении доходом
          </p>
        </div>
      </section>

      <section style={{ padding: "64px 32px 120px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: 140, borderRadius: 8, background: "#f1f5f9", animation: "blog-pulse 1.4s ease-in-out infinite" }} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: DARK }}>Постов пока нет</div>
              <div style={{ fontSize: 14, color: GRAY, marginTop: 6 }}>Загляните сюда чуть позже</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {posts.map(post => (
                <article key={post.id} style={{
                  border: "1px solid #E2E8F0", borderRadius: 8, padding: "28px 32px",
                  transition: "border-color 0.25s, box-shadow 0.25s",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = TEAL; el.style.boxShadow = "0 8px 24px rgba(45,212,191,0.1)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#E2E8F0"; el.style.boxShadow = "none"; }}
                >
                  <div style={{ fontSize: 13, color: GRAY, marginBottom: 10, fontWeight: 400 }}>
                    {formatDate(post.post_date)}
                  </div>
                  <h2 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: DARK, margin: "0 0 12px", lineHeight: 1.25 }}>
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.6, margin: "0 0 18px", fontWeight: 300 }}>
                      {post.excerpt}
                    </p>
                  )}
                  {post.hashtags && (
                    <div style={{ fontSize: 13, color: TEAL, marginBottom: 18, fontWeight: 400 }}>
                      {post.hashtags}
                    </div>
                  )}
                  {post.telegram_url && (
                    <a href={post.telegram_url} target="_blank" rel="noopener noreferrer" style={{
                      display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500,
                      color: DARK, textDecoration: "none", padding: "10px 20px", borderRadius: 2,
                      background: "linear-gradient(135deg,#2DD4BF,#14B8A6)",
                    }}>
                      Читать полностью в Telegram <Icon name="ArrowRight" size={15} />
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <BizFooter />

      <style>{`
        @keyframes blog-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
