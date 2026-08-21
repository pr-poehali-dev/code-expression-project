import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { markBlogSeen } from "@/pages/lk/blogNotice";
import { toast } from "@/hooks/use-toast";
import BlogComments from "./BlogComments";
import BlogToolLink, { ToolLink } from "./BlogToolLink";
import func2url from "../../backend/func2url.json";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const CONTENT_URL = (func2url as Record<string, string>)["blog-public"] || "";

interface Post {
  id: number;
  slug: string;
  post_date: string;
  title: string;
  excerpt: string;
  body: string;
  hashtags: string;
  category: string | null;
  category_label: string;
  role: string | null;
  role_label: string;
  tool_link: ToolLink | null;
}

interface RelatedPost {
  id: number;
  slug: string;
  post_date: string;
  title: string;
  excerpt: string;
  category_label: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" });
}

function getSessionId(): string {
  return localStorage.getItem("lk_session") || "";
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useLkAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<RelatedPost[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    setPost(null);
    const qs = new URLSearchParams({ action: "content_list", slug });
    fetch(`${CONTENT_URL}?${qs.toString()}`, { headers: { "X-Session-Id": getSessionId() } })
      .then(r => r.json())
      .then(d => {
        const found: Post | undefined = d.posts?.[0];
        if (!found) { setNotFound(true); return; }
        setPost(found);
        if (user && found.post_date) markBlogSeen(found.post_date);
        if (found.category) {
          const rqs = new URLSearchParams({ action: "content_related", category: found.category, post_id: String(found.id), limit: "3" });
          fetch(`${CONTENT_URL}?${rqs.toString()}`)
            .then(r => r.json())
            .then(rd => setRelated(rd.posts || []))
            .catch(() => {});
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    window.scrollTo({ top: 0, behavior: "instant" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleShare = async () => {
    if (!post) return;
    const url = `${window.location.origin}/blog/${post.slug}`;
    const shareData = { title: post.title, text: post.excerpt || post.title, url };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* отменено пользователем */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Ссылка скопирована", description: "Можно поделиться постом в соцсетях или мессенджере" });
    } catch {
      toast({ title: "Не удалось скопировать ссылку", variant: "destructive" });
    }
  };

  if (notFound) {
    return (
      <div style={{ fontFamily: "Inter, sans-serif", background: "#fff", minHeight: "100vh" }}>
        <Helmet>
          <title>Статья не найдена | Промт Диалог</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <BizNavbar />
        <div style={{ padding: "180px 32px 120px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: DARK, marginBottom: 10 }}>Статья не найдена</div>
          <button
            onClick={() => navigate("/blog")}
            style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, color: DARK, border: "none", cursor: "pointer", padding: "10px 20px", borderRadius: 2, background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", fontFamily: "Inter, sans-serif" }}
          >
            К полезной ленте
          </button>
        </div>
        <BizFooter />
      </div>
    );
  }

  const url = post ? `https://promtdialog.ru/blog/${post.slug}` : "";

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff", minHeight: "100vh" }}>
      {post && (
        <Helmet>
          <title>{post.title} | Промт Диалог</title>
          <meta name="description" content={post.excerpt || post.title} />
          <link rel="canonical" href={url} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.excerpt || post.title} />
          <meta property="og:url" content={url} />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.excerpt || post.title,
            "datePublished": post.post_date,
            "url": url,
            "author": { "@type": "Organization", "name": "Промт Диалог" },
            "publisher": { "@type": "Organization", "name": "Промт Диалог", "url": "https://promtdialog.ru" },
          })}</script>
        </Helmet>
      )}

      <BizNavbar />

      <section style={{ padding: "150px 32px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link
            to="/blog"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: GRAY, textDecoration: "none", marginBottom: 24, fontWeight: 500 }}
          >
            <Icon name="ArrowLeft" size={14} />
            Вся полезная лента
          </Link>

          {loading || !post ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ height: 28, width: "60%", borderRadius: 8, background: "#f1f5f9", animation: "blog-pulse 1.4s ease-in-out infinite" }} />
              <div style={{ height: 140, borderRadius: 8, background: "#f1f5f9", animation: "blog-pulse 1.4s ease-in-out infinite" }} />
            </div>
          ) : (
            <article>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 13, color: GRAY, fontWeight: 400, whiteSpace: "nowrap" }}>{formatDate(post.post_date)}</span>
                {post.category_label && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#0D9488", background: "#CCFBF1", padding: "3px 10px", borderRadius: 20, letterSpacing: "0.2px", whiteSpace: "nowrap" }}>
                    {post.category_label}
                  </span>
                )}
                {post.role_label && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#334155", background: "#F1F5F9", padding: "3px 10px", borderRadius: 20, letterSpacing: "0.2px", whiteSpace: "nowrap" }}>
                    Для: {post.role_label}
                  </span>
                )}
              </div>

              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4vw,40px)", fontWeight: 600, color: DARK, margin: "0 0 18px", lineHeight: 1.2 }}>
                {post.title}
              </h1>

              {post.excerpt && (
                <p style={{ fontSize: 17, color: "#334155", lineHeight: 1.6, margin: "0 0 24px", fontWeight: 300 }}>
                  {post.excerpt}
                </p>
              )}

              <p style={{ fontSize: 16, color: "#334155", lineHeight: 1.8, margin: "0 0 24px", fontWeight: 300, whiteSpace: "pre-line" }}>
                {post.body}
              </p>

              {post.hashtags && (
                <div style={{ fontSize: 13, color: TEAL, marginBottom: 24, fontWeight: 400 }}>
                  {post.hashtags}
                </div>
              )}

              {post.tool_link && <BlogToolLink toolLink={post.tool_link} authenticated={!!user} />}

              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                <button
                  onClick={handleShare}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 500,
                    color: GRAY, border: "1px solid #E2E8F0", cursor: "pointer", padding: "10px 18px", borderRadius: 2,
                    background: "#fff", fontFamily: "Inter, sans-serif", transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = TEAL; el.style.color = DARK; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "#E2E8F0"; el.style.color = GRAY; }}
                >
                  <Icon name="Share2" size={15} />
                  Поделиться
                </button>
              </div>

              {related.length > 0 && (
                <div style={{ margin: "32px 0", paddingTop: 24, borderTop: "1px solid #F1F5F9" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: GRAY, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14 }}>
                    Читайте также
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {related.map(rp => (
                      <Link
                        key={rp.id}
                        to={`/blog/${rp.slug}`}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, textAlign: "left", textDecoration: "none",
                          padding: "10px 12px", margin: "0 -12px", borderRadius: 6,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#F8FAFC"}
                        onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "transparent"}
                      >
                        <Icon name="ArrowUpRight" size={15} style={{ color: TEAL, flexShrink: 0 }} />
                        <span style={{ fontSize: 14, fontWeight: 500, color: DARK }}>{rp.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <BlogComments postId={post.id} canComment={!!user} />
            </article>
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