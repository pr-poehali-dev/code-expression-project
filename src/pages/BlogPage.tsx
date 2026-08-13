import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
const PAGE_SIZE = 6;

const CONTENT_URL = (func2url as Record<string, string>)["masters-accrual"] || "";

interface Post {
  id: number;
  post_date: string;
  title: string;
  excerpt: string;
  body: string | null;
  hashtags: string;
  category: string | null;
  category_label: string;
  tool_link: ToolLink | null;
}

interface RelatedPost {
  id: number;
  post_date: string;
  title: string;
  excerpt: string;
  category_label: string;
}

const CATEGORIES: { key: string; label: string }[] = [
  { key: "", label: "Все темы" },
  { key: "marketing", label: "Маркетинг" },
  { key: "upsell", label: "Допродажи" },
  { key: "clients", label: "Работа с клиентами" },
  { key: "tools", label: "Инструменты платформы" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" });
}

function getSessionId(): string {
  return localStorage.getItem("lk_session") || "";
}

export default function BlogPage() {
  const { user } = useLkAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const sharedPostId = searchParams.get("post");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(sharedPostId ? Number(sharedPostId) : null);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [relatedByPost, setRelatedByPost] = useState<Record<number, RelatedPost[]>>({});

  const loadRelated = (post: Post) => {
    if (!post.category || relatedByPost[post.id]) return;
    const qs = new URLSearchParams({ action: "content_related", category: post.category, post_id: String(post.id), limit: "3" });
    fetch(`${CONTENT_URL}?${qs.toString()}`)
      .then(r => r.json())
      .then(d => setRelatedByPost(prev => ({ ...prev, [post.id]: d.posts || [] })))
      .catch(() => {});
  };

  const handleReadMore = (post: Post) => {
    const next = openId === post.id ? null : post.id;
    setOpenId(next);
    if (next) loadRelated(post);
  };

  const handleShare = async (post: Post) => {
    const url = `${window.location.origin}/blog?post=${post.id}`;
    const shareData = { title: post.title, text: post.excerpt || post.title, url };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // пользователь отменил шаринг — ничего не делаем
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Ссылка скопирована", description: "Можно поделиться постом в соцсетях или мессенджере" });
    } catch {
      toast({ title: "Не удалось скопировать ссылку", variant: "destructive" });
    }
  };

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    setLoading(true);
    setOpenId(sharedPostId ? Number(sharedPostId) : null);
    const qs = new URLSearchParams({ action: "content_list", limit: String(PAGE_SIZE), page: String(page) });
    if (category) qs.set("category", category);
    fetch(`${CONTENT_URL}?${qs.toString()}`, {
      headers: { "X-Session-Id": getSessionId() },
    })
      .then(r => r.json())
      .then(d => {
        setPosts(d.posts || []);
        const total = d.total || 0;
        setTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));
        if (user && page === 1 && !category && d.posts?.[0]?.post_date) {
          markBlogSeen(d.posts[0].post_date);
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, page, user]);

  // Переход по ссылке из анонса в Telegram (/blog?post=ID) — подгружаем именно этот пост
  // (может не быть на текущей странице ленты), открываем его и убираем query-параметр из URL.
  useEffect(() => {
    if (!sharedPostId) return;
    const qs = new URLSearchParams({ action: "content_list", post_id: sharedPostId });
    fetch(`${CONTENT_URL}?${qs.toString()}`, { headers: { "X-Session-Id": getSessionId() } })
      .then(r => r.json())
      .then(d => {
        const post: Post | undefined = d.posts?.[0];
        if (!post) return;
        setPosts(prev => (prev.some(p => p.id === post.id) ? prev : [post, ...prev]));
        setOpenId(post.id);
        loadRelated(post);
        requestAnimationFrame(() => {
          document.getElementById(`blog-post-${post.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      })
      .catch(() => {})
      .finally(() => {
        searchParams.delete("post");
        setSearchParams(searchParams, { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedPostId]);

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
          {!user && (
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 14, fontWeight: 300 }}>
              Комментировать статьи можно после регистрации в личном кабинете
            </p>
          )}
        </div>
      </section>

      <section style={{ padding: "64px 32px 120px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
            {CATEGORIES.map(c => {
              const active = category === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  style={{
                    fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer",
                    padding: "9px 20px", borderRadius: 20, whiteSpace: "nowrap",
                    border: active ? "1px solid transparent" : "1px solid #E2E8F0",
                    background: active ? "linear-gradient(135deg,#2DD4BF,#14B8A6)" : "#fff",
                    color: active ? DARK : GRAY,
                    transition: "all 0.2s",
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: 140, borderRadius: 8, background: "#f1f5f9", animation: "blog-pulse 1.4s ease-in-out infinite" }} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: DARK }}>По этой теме пока нет постов</div>
              <div style={{ fontSize: 14, color: GRAY, marginTop: 6 }}>Загляните сюда чуть позже</div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {posts.map(post => {
                  const isOpen = openId === post.id;
                  return (
                    <article key={post.id} id={`blog-post-${post.id}`} style={{
                      border: "1px solid #E2E8F0", borderRadius: 8, padding: "28px 32px",
                      transition: "border-color 0.25s, box-shadow 0.25s", scrollMarginTop: 100,
                    }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = TEAL; el.style.boxShadow = "0 8px 24px rgba(45,212,191,0.1)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#E2E8F0"; el.style.boxShadow = "none"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                        <span style={{ fontSize: 13, color: GRAY, fontWeight: 400, whiteSpace: "nowrap" }}>{formatDate(post.post_date)}</span>
                        {post.category_label && (
                          <span style={{
                            fontSize: 12, fontWeight: 600, color: "#0D9488", background: "#CCFBF1",
                            padding: "3px 10px", borderRadius: 20, letterSpacing: "0.2px", whiteSpace: "nowrap",
                          }}>
                            {post.category_label}
                          </span>
                        )}
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
                      {isOpen && post.body && (
                        <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.75, margin: "0 0 20px", fontWeight: 300, whiteSpace: "pre-line" }}>
                          {post.body}
                        </p>
                      )}
                      {isOpen && post.tool_link && (
                        <BlogToolLink toolLink={post.tool_link} authenticated={!!user} />
                      )}
                      {isOpen && (relatedByPost[post.id]?.length ?? 0) > 0 && (
                        <div style={{ margin: "0 0 24px", paddingTop: 20, borderTop: "1px solid #F1F5F9" }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: GRAY, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 14 }}>
                            Читайте также
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {relatedByPost[post.id].map(rp => (
                              <button
                                key={rp.id}
                                onClick={() => {
                                  setOpenId(rp.id);
                                  const target = posts.find(p => p.id === rp.id);
                                  if (target) loadRelated(target);
                                  requestAnimationFrame(() => {
                                    document.getElementById(`blog-post-${rp.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                                  });
                                }}
                                style={{
                                  display: "flex", alignItems: "center", gap: 10, textAlign: "left",
                                  padding: "10px 12px", margin: "0 -12px", borderRadius: 6, border: "none",
                                  background: "transparent", cursor: "pointer", fontFamily: "Inter, sans-serif",
                                  transition: "background 0.15s",
                                }}
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#F8FAFC"}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                              >
                                <Icon name="ArrowUpRight" size={15} style={{ color: TEAL, flexShrink: 0 }} />
                                <span style={{ fontSize: 14, fontWeight: 500, color: DARK }}>{rp.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <button
                          onClick={() => handleReadMore(post)}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500,
                            color: DARK, border: "none", cursor: "pointer", padding: "10px 20px", borderRadius: 2,
                            background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {isOpen ? "Свернуть" : "Читать полностью"}
                          <Icon name={isOpen ? "ChevronUp" : "ArrowRight"} size={15} />
                        </button>
                        <button
                          onClick={() => handleShare(post)}
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
                      {isOpen && <BlogComments postId={post.id} canComment={!!user} />}
                    </article>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 44, flexWrap: "wrap" }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      width: 38, height: 38, borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff",
                      color: page === 1 ? "#CBD5E1" : DARK, cursor: page === 1 ? "default" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Icon name="ChevronLeft" size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        minWidth: 38, height: 38, borderRadius: 8, fontSize: 14, fontWeight: 600,
                        border: p === page ? "1px solid transparent" : "1px solid #E2E8F0",
                        background: p === page ? "linear-gradient(135deg,#2DD4BF,#14B8A6)" : "#fff",
                        color: p === page ? DARK : GRAY, cursor: "pointer", fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      width: 38, height: 38, borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff",
                      color: page === totalPages ? "#CBD5E1" : DARK, cursor: page === totalPages ? "default" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Icon name="ChevronRight" size={16} />
                  </button>
                </div>
              )}
            </>
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