import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { Tournament, MyTournament, ACCENT } from "./LkChampionshipShared";

export function ShareView({ tournament: t, my, onBack }:
  { tournament: Tournament; my: MyTournament; onBack: () => void }) {

  const publicUrl = `https://promtdialog.ru/championship/tournament/${t.slug}`;
  const [copied, setCopied] = useState(false);
  const copyText = useRef<HTMLTextAreaElement>(null);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareText = `🏆 Я участвую в чемпионате красоты "${t.name}"!\n\nПроголосуйте за мою работу — мне важна ваша поддержка!\n\n👉 ${publicUrl}\n\n#чемпионатКрасоты #красота #салон`;

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14, marginBottom: 16, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
        <Icon name="ArrowLeft" size={14} /> Назад
      </button>

      <div style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 16, padding: "24px", color: "#fff", marginBottom: 24, textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>❤️</div>
        <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>Соберите голоса!</h2>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
          Поделитесь ссылкой с клиентами, друзьями и в соцсетях.<br />
          Каждый голос — это ваш рейтинг в чемпионате.
        </p>
        {my.real_votes > 0 && (
          <div style={{ marginTop: 14, fontSize: 22, fontWeight: 900 }}>❤️ {my.real_votes} голосов уже собрано!</div>
        )}
      </div>

      {/* Ссылка */}
      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>ССЫЛКА НА СТРАНИЦУ ГОЛОСОВАНИЯ</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, fontSize: 13, color: "#0f172a", background: "#f8fafc", borderRadius: 8, padding: "10px 12px", wordBreak: "break-all" }}>
            {publicUrl}
          </div>
          <button onClick={() => copy(publicUrl)} style={{
            padding: "10px 14px", borderRadius: 8, border: "none",
            background: copied ? "#f0fdf4" : ACCENT,
            color: copied ? "#059669" : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0,
          }}>
            {copied ? "✓" : <Icon name="Copy" size={16} />}
          </button>
        </div>
      </div>

      {/* Готовый текст для публикации */}
      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>ГОТОВЫЙ ТЕКСТ ДЛЯ СОЦСЕТЕЙ</div>
        <textarea
          ref={copyText}
          readOnly
          value={shareText}
          rows={6}
          style={{ width: "100%", border: "none", background: "#f8fafc", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#374151", lineHeight: 1.6, resize: "none", outline: "none", boxSizing: "border-box" }}
        />
        <button onClick={() => copy(shareText)} style={{
          marginTop: 8, padding: "9px 16px", borderRadius: 8, border: "none",
          background: ACCENT, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>
          Скопировать текст
        </button>
      </div>

      {/* Советы */}
      <div style={{ background: "#fffbeb", borderRadius: 12, padding: "16px", border: "1px solid #fde68a" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 10 }}>💡 КАК ПОЛУЧИТЬ БОЛЬШЕ ГОЛОСОВ</div>
        {[
          "Разошлите ссылку в WhatsApp и Telegram клиентам",
          "Опубликуйте в своих соцсетях (ВКонтакте, Instagram*)",
          "Попросите коллег и друзей проголосовать",
          "Прикрепите ссылку в статусе или bio профиля",
          "Напомните клиентам во время следующего визита",
        ].map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: "#78350f" }}>
            <span style={{ flexShrink: 0 }}>✓</span>
            <span>{tip}</span>
          </div>
        ))}
        <div style={{ fontSize: 11, color: "#b45309", marginTop: 8 }}>* Организация признана нежелательной в РФ</div>
      </div>
    </div>
  );
}