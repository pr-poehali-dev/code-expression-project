import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { markBlogSeen } from "@/pages/lk/blogNotice";
import func2url from "../../backend/func2url.json";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";
const PAGE_SIZE = 6;

const CONTENT_URL = (func2url as Record<string, string>)["masters-accrual"] || "";

interface Post {
  id: number;
  slug: string;
  post_date: string;
  title: string;
  excerpt: string;
  hashtags: string;
  category: string | null;
  category_label: string;
  role: string | null;
  role_label: string;
}

const CATEGORIES: { key: string; label: string }[] = [
  { key: "", label: "Все темы" },
  { key: "marketing", label: "Маркетинг" },
  { key: "upsell", label: "Допродажи" },
  { key: "clients", label: "Работа с клиентами" },
  { key: "tools", label: "Инструменты платформы" },
];

const ROLES: { key: string; label: string }[] = [
  { key: "", label: "Все роли" },
  { key: "owner", label: "Владелец салона" },
  { key: "admin", label: "Администратор" },
  { key: "master", label: "Мастер" },
  { key: "massage", label: "Массажист" },
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [category, role]);

  // Лента отдаёт посты БЕЗ полного текста (body) — карточки ведут на отдельную страницу
  // /blog/:slug, где текст подгружается только для этого одного поста. Так лента остаётся лёгкой,
  // а у каждой статьи — своя SEO-страница со своим адресом.
  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams({ action: "content_list", limit: String(PAGE_SIZE), page: String(page) });
    if (category) qs.set("category", category);
    if (role) qs.set("role", role);
    fetch(`${CONTENT_URL}?${qs.toString()}`, {
      headers: { "X-Session-Id": getSessionId() },
    })
      .then(r => r.json())
      .then(d => {
        setPosts(d.posts || []);
        const total = d.total || 0;
        setTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));
        if (user && page === 1 && !category && !role && d.posts?.[0]?.post_date) {
          markBlogSeen(d.posts[0].post_date);
        }
      })
      .finally(() => setLoading(false));
  }, [category, role, page, user]);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff", minHeight: "100vh" }}>
      <Helmet>
        <title>Полезная лента — подсказки по сегментам для салонов красоты | Промт Диалог</title>
        <meta name="description" content="Каждый день новые рекомендации по оптимизации салона: маркетинг, допродажи, работа с клиентами, управление мастерами — под вашу роль в салоне." />
        <link rel="canonical" href="https://promtdialog.ru/blog" />
        <meta property="og:title" content="Полезная лента Промт Диалог — подсказки по сегментам" />
        <meta property="og:type" content="website" />
      </Helmet>

      <BizNavbar />

      <section style={{ padding: "160px 32px 60px", background: `linear-gradient(135deg, ${DARK}, #112B3C)` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEAL, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 18 }}>
            Полезная лента
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px,5vw,52px)", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
            Подсказки по ролям
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", marginTop: 18, fontWeight: 300 }}>
            Каждый день — новые рекомендации по оптимизации салона
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
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

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <span style={{ fontSize: 13, color: GRAY, fontWeight: 400, marginRight: 2 }}>Ваша роль:</span>
            {ROLES.map(r => {
              const active = role === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => setRole(r.key)}
                  style={{
                    fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer",
                    padding: "7px 16px", borderRadius: 20, whiteSpace: "nowrap",
                    border: active ? "1px solid transparent" : "1px solid #E2E8F0",
                    background: active ? DARK : "#fff",
                    color: active ? "#fff" : GRAY,
                    transition: "all 0.2s",
                  }}
                >
                  {r.label}
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
                {posts.map(post => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    style={{
                      display: "block", border: "1px solid #E2E8F0", borderRadius: 8, padding: "28px 32px",
                      transition: "border-color 0.25s, box-shadow 0.25s", textDecoration: "none", color: "inherit",
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
                      {post.role_label && (
                        <span style={{
                          fontSize: 12, fontWeight: 600, color: "#334155", background: "#F1F5F9",
                          padding: "3px 10px", borderRadius: 20, letterSpacing: "0.2px", whiteSpace: "nowrap",
                        }}>
                          Для: {post.role_label}
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
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500,
                      color: DARK, padding: "10px 20px", borderRadius: 2,
                      background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", fontFamily: "Inter, sans-serif",
                    }}>
                      Читать полностью
                      <Icon name="ArrowRight" size={15} />
                    </span>
                  </Link>
                ))}
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
