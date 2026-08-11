import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";

const CONTENT_URL = (func2url as Record<string, string>)["masters-accrual"] || "";
const POLL_INTERVAL_MS = 15_000;

interface Comment {
  id: number;
  post_id: number;
  parent_id: number | null;
  author_name: string;
  is_admin_reply: boolean;
  body: string;
  created_at: string;
  likes_count: number;
  liked_by_me: boolean;
}

function getSessionId(): string {
  return localStorage.getItem("lk_session") || "";
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru", { day: "numeric", month: "short" }) + ", " +
    d.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
}

function initials(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || "?";
}

export default function BlogComments({ postId, canComment }: { postId: number; canComment: boolean }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  // parent-комментарии, под которыми ждём ответ Светланы (индикатор "печатает…")
  const [pendingParents, setPendingParents] = useState<Set<number>>(new Set());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = (silent = false) => {
    if (!silent) setLoading(true);
    return fetch(`${CONTENT_URL}?action=comments_list&post_id=${postId}`, {
      headers: { "X-Session-Id": getSessionId() },
    })
      .then(r => r.json())
      .then(d => {
        const list: Comment[] = d.comments || [];
        setComments(list);
        // Если ответ на ожидаемый parent_id уже появился — снимаем индикатор "печатает…"
        setPendingParents(prev => {
          if (prev.size === 0) return prev;
          const next = new Set(prev);
          for (const c of list) {
            if (c.is_admin_reply && c.parent_id && next.has(c.parent_id)) next.delete(c.parent_id);
          }
          return next;
        });
      })
      .catch(() => {})
      .finally(() => { if (!silent) setLoading(false); });
  };

  useEffect(() => {
    load();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // Пока есть комментарии, ожидающие ответа Светланы, — тихо опрашиваем сервер каждые 15с
  useEffect(() => {
    if (pendingParents.size === 0) {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      return;
    }
    if (pollRef.current) return;
    pollRef.current = setInterval(() => load(true), POLL_INTERVAL_MS);
    return () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingParents.size]);

  const submit = async (body: string, parentId: number | null, onDone: () => void) => {
    const trimmed = body.trim();
    if (!trimmed) return;
    try {
      const res = await fetch(`${CONTENT_URL}?action=comment_add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": getSessionId() },
        body: JSON.stringify({ post_id: postId, text: trimmed, parent_id: parentId }),
      });
      const data = await res.json();
      if (!res.ok) return;
      setComments(prev => [...prev, { ...data.comment, likes_count: 0, liked_by_me: false }]);
      if (data.admin_reply_pending) {
        // Ответ Светланы уже готов на сервере, но появится в ленте только через 1-2.5 минуты —
        // показываем индикатор "печатает…" под тем комментарием, на который она отвечает.
        setPendingParents(prev => new Set(prev).add(data.comment.id));
      }
      onDone();
    } catch {
      // молча — комментарий можно попробовать отправить ещё раз
    }
  };

  const toggleLike = async (commentId: number) => {
    if (!canComment) return;
    // Оптимистично обновляем UI, чтобы лайк срабатывал мгновенно
    setComments(prev => prev.map(c => c.id === commentId
      ? { ...c, liked_by_me: !c.liked_by_me, likes_count: c.likes_count + (c.liked_by_me ? -1 : 1) }
      : c));
    try {
      const res = await fetch(`${CONTENT_URL}?action=comment_like`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": getSessionId() },
        body: JSON.stringify({ comment_id: commentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setComments(prev => prev.map(c => c.id === commentId
        ? { ...c, liked_by_me: data.liked_by_me, likes_count: data.likes_count }
        : c));
    } catch {
      // откатываем оптимистичное изменение при ошибке
      setComments(prev => prev.map(c => c.id === commentId
        ? { ...c, liked_by_me: !c.liked_by_me, likes_count: c.likes_count + (c.liked_by_me ? -1 : 1) }
        : c));
    }
  };

  const topLevel = comments.filter(c => !c.parent_id);
  const repliesOf = (id: number) => comments.filter(c => c.parent_id === id);

  return (
    <div style={{ marginTop: 8, paddingTop: 24, borderTop: "1px solid #F1F5F9" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: GRAY, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 18 }}>
        Комментарии {comments.length > 0 && `(${comments.length})`}
      </div>

      {loading ? (
        <div style={{ fontSize: 13, color: GRAY }}>Загружаем…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
          {topLevel.map(c => (
            <div key={c.id}>
              <CommentRow c={c} canLike={canComment} onToggleLike={() => toggleLike(c.id)} />
              {canComment && (
                <button
                  onClick={() => { setReplyTo(replyTo === c.id ? null : c.id); setReplyText(""); }}
                  style={{ marginLeft: 44, marginTop: 4, background: "none", border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: TEAL, padding: 0, fontFamily: "Inter, sans-serif" }}
                >
                  Ответить
                </button>
              )}
              {repliesOf(c.id).map(r => (
                <div key={r.id} style={{ marginLeft: 44, marginTop: 12 }}>
                  <CommentRow c={r} canLike={canComment} onToggleLike={() => toggleLike(r.id)} />
                </div>
              ))}
              {pendingParents.has(c.id) && (
                <div style={{ marginLeft: 44, marginTop: 12 }}>
                  <TypingIndicator />
                </div>
              )}
              {replyTo === c.id && (
                <div style={{ marginLeft: 44, marginTop: 10, display: "flex", gap: 8 }}>
                  <input
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Ваш ответ…"
                    style={{ flex: 1, padding: "9px 12px", borderRadius: 6, border: "1px solid #E2E8F0", fontSize: 13.5, fontFamily: "Inter, sans-serif", outline: "none" }}
                    onKeyDown={e => { if (e.key === "Enter" && !sendingReply) { setSendingReply(true); submit(replyText, c.id, () => { setReplyText(""); setReplyTo(null); }).finally(() => setSendingReply(false)); } }}
                  />
                  <button
                    disabled={sendingReply || !replyText.trim()}
                    onClick={() => { setSendingReply(true); submit(replyText, c.id, () => { setReplyText(""); setReplyTo(null); }).finally(() => setSendingReply(false)); }}
                    style={{ padding: "9px 16px", borderRadius: 6, border: "none", background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: DARK, fontSize: 13, fontWeight: 600, cursor: sendingReply ? "default" : "pointer", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}
                  >
                    Отправить
                  </button>
                </div>
              )}
            </div>
          ))}
          {topLevel.length === 0 && (
            <div style={{ fontSize: 13.5, color: GRAY }}>Комментариев пока нет — станьте первым</div>
          )}
        </div>
      )}

      {canComment ? (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Написать комментарий…"
            style={{ flex: 1, padding: "11px 14px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, fontFamily: "Inter, sans-serif", outline: "none" }}
            onKeyDown={e => { if (e.key === "Enter" && !sending) { setSending(true); submit(text, null, () => setText("")).finally(() => setSending(false)); } }}
          />
          <button
            disabled={sending || !text.trim()}
            onClick={() => { setSending(true); submit(text, null, () => setText("")).finally(() => setSending(false)); }}
            style={{ padding: "11px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: DARK, fontSize: 14, fontWeight: 600, cursor: sending ? "default" : "pointer", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}
          >
            {sending ? "…" : "Отправить"}
          </button>
        </div>
      ) : (
        <div style={{ fontSize: 13.5, color: GRAY, fontStyle: "italic" }}>Войдите в личный кабинет, чтобы оставить комментарий</div>
      )}
    </div>
  );
}

function CommentRow({ c, canLike, onToggleLike }: { c: Comment; canLike: boolean; onToggleLike: () => void }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "Inter, sans-serif",
        background: c.is_admin_reply ? "linear-gradient(135deg,#2DD4BF,#14B8A6)" : "linear-gradient(135deg,#94A3B8,#64748B)",
      }}>
        {initials(c.author_name)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: DARK }}>{c.author_name}</span>
          {c.is_admin_reply && (
            <span style={{ fontSize: 10, fontWeight: 700, color: "#0D9488", background: "#CCFBF1", padding: "2px 7px", borderRadius: 10, letterSpacing: "0.3px" }}>
              АДМИН
            </span>
          )}
          <span style={{ fontSize: 11.5, color: "#94A3B8" }}>{formatDateTime(c.created_at)}</span>
        </div>
        <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.55, whiteSpace: "pre-line", marginBottom: 6 }}>{c.body}</div>
        <button
          onClick={onToggleLike}
          disabled={!canLike}
          title={canLike ? undefined : "Войдите, чтобы оценить комментарий"}
          style={{
            display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: 0,
            cursor: canLike ? "pointer" : "default", fontFamily: "Inter, sans-serif",
            fontSize: 12.5, fontWeight: 600, color: c.liked_by_me ? "#0D9488" : "#94A3B8",
          }}
        >
          <Icon name="Heart" size={14} style={c.liked_by_me ? { fill: "#0D9488", color: "#0D9488" } : undefined} />
          {c.likes_count > 0 ? c.likes_count : ""}
        </button>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "Inter, sans-serif",
        background: "linear-gradient(135deg,#2DD4BF,#14B8A6)",
      }}>
        С
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94A3B8", fontStyle: "italic" }}>
        Светлана печатает
        <span style={{ display: "inline-flex", gap: 2 }}>
          <span className="blog-typing-dot" style={{ animationDelay: "0s" }} />
          <span className="blog-typing-dot" style={{ animationDelay: "0.2s" }} />
          <span className="blog-typing-dot" style={{ animationDelay: "0.4s" }} />
        </span>
        <style>{`
          .blog-typing-dot {
            width: 4px; height: 4px; border-radius: 50%; background: #94A3B8;
            display: inline-block; animation: blog-typing-blink 1.2s infinite ease-in-out;
          }
          @keyframes blog-typing-blink {
            0%, 80%, 100% { opacity: 0.25; }
            40% { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}