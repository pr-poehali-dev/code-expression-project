import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { Tournament, MyTournament, ACCENT } from "./LkChampionshipShared";

export function ShareView({ tournament: t, my, onBack }:
  { tournament: Tournament; my: MyTournament; onBack: () => void }) {

  const publicUrl = `https://promtdialog.ru/championship/tournament/${t.slug}`;
  const [copied, setCopied] = useState<"url" | "text" | null>(null);
  const copyText = useRef<HTMLTextAreaElement>(null);

  const copy = (text: string, type: "url" | "text") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const shareText = `🏆 Я участвую в чемпионате красоты "${t.name}"!\n\nПроголосуйте за мою работу — мне важна ваша поддержка!\n\n👉 ${publicUrl}\n\n#чемпионатКрасоты #красота #салон`;

  const canNativeShare = typeof navigator.share === "function";

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14, marginBottom: 16, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
        <Icon name="ArrowLeft" size={14} /> Назад
      </button>

      {/* Шапка */}
      <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)", borderRadius: 16, padding: "24px", color: "#fff", marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🗳</div>
        <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>Голосование идёт!</h2>
        <p style={{ margin: "0 0 14px", fontSize: 14, opacity: 0.8, lineHeight: 1.6 }}>
          Поделитесь ссылкой — каждый голос влияет на ваше место в чемпионате
        </p>
        {my.real_votes > 0 && (
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", borderRadius: 20, padding: "8px 20px", fontSize: 18, fontWeight: 900 }}>
            ❤️ {my.real_votes} {my.real_votes === 1 ? "голос" : my.real_votes < 5 ? "голоса" : "голосов"} уже собрано!
          </div>
        )}
      </div>

      {/* Выгоды для салона */}
      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "18px", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>💼 Зачем собирать голоса?</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: "📣", title: "Напомните о себе клиентам", text: "Ссылка в мессенджере — это повод написать каждому клиенту лично. Они вспомнят о вас и запишутся." },
            { icon: "✨", title: "Покажите мастерство", text: "Работа на конкурсе — это ваше портфолио. Клиенты видят результат и хотят то же самое." },
            { icon: "📢", title: "Сарафанное радио", text: "Ваши клиенты попросят проголосовать своих друзей и знакомых — а те узнают о вашем салоне." },
            { icon: "🏆", title: "Рейтинг и признание", text: "Больше голосов — выше место. Победители получают энергию, достижения и упоминание на сайте." },
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{b.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{b.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ссылка */}
      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "16px", marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>ССЫЛКА НА СТРАНИЦУ ГОЛОСОВАНИЯ</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, fontSize: 13, color: "#0f172a", background: "#f8fafc", borderRadius: 8, padding: "10px 12px", wordBreak: "break-all" }}>
            {publicUrl}
          </div>
          <button onClick={() => copy(publicUrl, "url")} style={{
            padding: "10px 14px", borderRadius: 8, border: "none",
            background: copied === "url" ? "#f0fdf4" : ACCENT,
            color: copied === "url" ? "#059669" : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0,
          }}>
            {copied === "url" ? "✓" : <Icon name="Copy" size={16} />}
          </button>
        </div>
      </div>

      {/* Готовый текст */}
      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>ГОТОВЫЙ ТЕКСТ ДЛЯ СОЦСЕТЕЙ</div>
        <textarea
          ref={copyText}
          readOnly
          value={shareText}
          rows={6}
          style={{ width: "100%", border: "none", background: "#f8fafc", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#374151", lineHeight: 1.6, resize: "none", outline: "none", boxSizing: "border-box" }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={() => copy(shareText, "text")} style={{
            padding: "9px 16px", borderRadius: 8, border: "none",
            background: copied === "text" ? "#f0fdf4" : ACCENT,
            color: copied === "text" ? "#059669" : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>
            {copied === "text" ? "✓ Скопировано" : "Скопировать текст"}
          </button>
          {canNativeShare && (
            <button onClick={() => navigator.share({ title: `Голосование — ${t.name}`, text: shareText, url: publicUrl })} style={{
              padding: "9px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#0f172a", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>
              Поделиться
            </button>
          )}
        </div>
      </div>

      {/* Советы */}
      <div style={{ background: "#fffbeb", borderRadius: 12, padding: "16px", border: "1px solid #fde68a" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 10 }}>💡 КАК ПОЛУЧИТЬ БОЛЬШЕ ГОЛОСОВ</div>
        {[
          "Разошлите ссылку в WhatsApp и Telegram каждому клиенту",
          "Опубликуйте в ВКонтакте и сторис с призывом проголосовать",
          "Попросите коллег и команду поддержать",
          "Добавьте ссылку в bio профиля или статус",
          "Напомните клиентам лично при следующем визите",
        ].map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: "#78350f" }}>
            <span style={{ flexShrink: 0 }}>✓</span>
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
