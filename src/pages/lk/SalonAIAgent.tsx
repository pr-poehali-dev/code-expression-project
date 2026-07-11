import { useState, useRef, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";
import {
  AGENT_URL, FREE_LIMIT, ENERGY_PER_MSG,
  AgentRole, AGENTS, Message, AttachedFile,
  ChatMode, CHAT_MODES,
} from "./SalonAgentTypes";
import { FreeUsageBar, PaywallModal } from "./SalonAgentWidgets";
import SalonAgentChat from "./SalonAgentChat";

export default function SalonAIAgent({ onNavigateShop }: { onNavigateShop?: () => void }) {
  const { user } = useLkAuth();
  const sessionId = localStorage.getItem("lk_session") || "";

  const [activeAgent, setActiveAgent] = useState<AgentRole>("business");
  const [chatMode, setChatMode] = useState<ChatMode>("salon");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [freeUsed, setFreeUsed] = useState(0);
  const [energyBalance, setEnergyBalance] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const agent = AGENTS.find(a => a.id === activeAgent)!;

  async function handleFileAttach(file: File) {
    const BATCH_ROWS = 300;
    const MAX_CHARS = 80_000;
    const isExcel = /\.(xlsx|xls|ods)$/i.test(file.name) || file.type.includes("spreadsheet") || file.type.includes("excel");
    const isText = ["text/", "application/json", "application/xml", "application/csv"].some(t => file.type.startsWith(t)) || /\.(txt|csv|json|xml|md|log)$/i.test(file.name);

    let fullText = "";
    let totalRows = 0;

    if (isExcel) {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const parts: string[] = [];
      for (const sheetName of wb.SheetNames) {
        const csv = XLSX.utils.sheet_to_csv(wb.Sheets[sheetName]);
        if (csv.trim()) parts.push(`[Лист: ${sheetName}]\n${csv}`);
      }
      fullText = parts.join("\n\n");
    } else if (isText) {
      fullText = await file.text();
    } else {
      setAttachedFile({ name: file.name, text: `[Файл: ${file.name} — формат не поддерживается. Поддерживаются: xlsx, csv, txt, json]` });
      return;
    }

    const allLines = fullText.split("\n");
    totalRows = allLines.filter(l => l.trim()).length;

    if (fullText.length <= MAX_CHARS) {
      setAttachedFile({ name: file.name, text: fullText });
      return;
    }

    const header = allLines[0] || "";
    const dataLines = allLines.slice(1).filter(l => l.trim());
    const batches: string[] = [];
    for (let i = 0; i < dataLines.length; i += BATCH_ROWS) {
      const chunk = dataLines.slice(i, i + BATCH_ROWS);
      batches.push([header, ...chunk].join("\n"));
    }

    setAttachedFile({
      name: file.name,
      text: fullText.slice(0, MAX_CHARS),
      batches,
      totalRows,
      batchSize: BATCH_ROWS,
    });
  }

  const loadHistory = useCallback(async (role: AgentRole, mode: ChatMode) => {
    setHistoryLoading(true);
    setError("");
    try {
      const res = await fetch(`${AGENT_URL}?agent_role=${role}&chat_mode=${mode}`, { headers: { "X-Session-Id": sessionId } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка загрузки");
      setMessages(data.messages || []);
      setFreeUsed(data.free_used ?? 0);
      setEnergyBalance(data.energy_balance ?? 0);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить историю");
    } finally { setHistoryLoading(false); }
  }, [sessionId]);

  useEffect(() => { loadHistory(activeAgent, chatMode); }, [activeAgent, chatMode, loadHistory]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function sendOneBatch(message: string): Promise<{ reply: string; free_used?: number; energy_balance?: number; error?: string; ok: boolean }> {
    const res = await fetch(AGENT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
      body: JSON.stringify({ agent_role: activeAgent, message, chat_mode: chatMode }),
    });
    const data = await res.json();
    return { ...data, ok: res.ok };
  }

  async function send() {
    const text = input.trim();
    if ((!text && !attachedFile) || loading) return;

    const file = attachedFile;
    const userTask = text || "Выполни задачу на основе данных из файла и покажи готовый результат.";

    if (file?.batches && file.batches.length > 1) {
      const displayContent = `📎 ${file.name} (${file.totalRows} строк)\n\n${userTask}`;
      setMessages(prev => [...prev, { role: "user", content: displayContent }]);
      setInput("");
      setAttachedFile(null);
      setLoading(true);
      setError("");
      setBatchProgress({ current: 0, total: file.batches.length });

      const allResults: string[] = [];
      try {
        for (let i = 0; i < file.batches.length; i++) {
          setBatchProgress({ current: i + 1, total: file.batches.length });
          const isFirst = i === 0;
          const isLast = i === file.batches.length - 1;
          const batchMsg = `ДАННЫЕ ИЗ ФАЙЛА «${file.name}» — ПАКЕТ ${i + 1} из ${file.batches.length} (строки ${i * (file.batchSize ?? 300) + 1}–${Math.min((i + 1) * (file.batchSize ?? 300), file.totalRows ?? 0)} из ${file.totalRows}):\n\n${file.batches[i]}\n\n---\nЗАДАЧА: ${userTask}\n\n${isFirst ? "Это первый пакет данных." : ""} ${isLast ? "Это последний пакет — выдай итоговый объединённый результат по всем данным." : "Обработай этот пакет и жди следующего."}`;
          const result = await sendOneBatch(batchMsg);
          if (result.error === "no_energy") {
            setMessages(prev => prev.slice(0, -1));
            setInput(userTask);
            setFreeUsed(result.free_used ?? freeUsed);
            setEnergyBalance(result.energy_balance ?? energyBalance);
            setShowPaywall(true);
            return;
          }
          if (!result.ok) throw new Error(result.error || "Ошибка сервера");
          if (result.free_used != null) setFreeUsed(result.free_used);
          if (result.energy_balance != null) setEnergyBalance(result.energy_balance);
          allResults.push(result.reply);
          if (!isLast) {
            setMessages(prev => [...prev.filter(m => m.role !== "assistant" || !m.content.startsWith("⏳")),
              { role: "assistant", content: `⏳ Обработано пакетов: ${i + 1} из ${file.batches.length}...\n\n${result.reply}` }]);
          }
        }
        const finalReply = file.batches.length === 1
          ? allResults[0]
          : allResults[allResults.length - 1];
        setMessages(prev => [...prev.filter(m => !(m.role === "assistant" && m.content.startsWith("⏳"))),
          { role: "assistant", content: finalReply }]);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Не удалось получить ответ");
        setMessages(prev => prev.slice(0, -1));
        setInput(userTask);
      } finally {
        setLoading(false);
        setBatchProgress(null);
      }
      return;
    }

    const content = file
      ? `ДАННЫЕ ИЗ ФАЙЛА «${file.name}»:\n\n${file.text}\n\n---\nЗАДАЧА ПОЛЬЗОВАТЕЛЯ: ${userTask}\n\nВАЖНО: Выполни задачу немедленно на основе реальных данных выше. Не объясняй как это сделать — сделай сам и покажи готовый результат (таблицу, расчёт, текст, выводы). Пользователь должен получить готовый ответ, который можно скачать.`
      : text;
    const displayContent = file
      ? `📎 ${file.name}${text ? `\n\n${text}` : ""}`.trim()
      : text;
    setMessages(prev => [...prev, { role: "user", content: displayContent }]);
    setInput("");
    setAttachedFile(null);
    setLoading(true);
    setError("");
    try {
      const result = await sendOneBatch(content);
      if (result.error === "no_energy") {
        setMessages(prev => prev.slice(0, -1));
        setInput(content);
        setFreeUsed(result.free_used ?? freeUsed);
        setEnergyBalance(result.energy_balance ?? energyBalance);
        setShowPaywall(true);
        return;
      }
      if (!result.ok) throw new Error(result.error || "Ошибка сервера");
      setMessages(prev => [...prev, { role: "assistant", content: result.reply }]);
      setFreeUsed(result.free_used ?? freeUsed);
      setEnergyBalance(result.energy_balance ?? energyBalance);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Не удалось получить ответ");
      setMessages(prev => prev.slice(0, -1));
      setInput(content);
    } finally { setLoading(false); }
  }

  async function clearHistory() {
    if (!confirmClear) { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 3000); return; }
    setConfirmClear(false);
    await fetch(`${AGENT_URL}?agent_role=${activeAgent}&chat_mode=${chatMode}`, { method: "DELETE", headers: { "X-Session-Id": sessionId } });
    setMessages([]);
    setError("");
  }

  const userName = user?.full_name?.split(" ")[0] || "вас";
  const isPaid = freeUsed >= FREE_LIMIT;
  const canSend = isPaid ? energyBalance >= ENERGY_PER_MSG : true;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          energyBalance={energyBalance}
          onNavigateShop={() => { setShowPaywall(false); onNavigateShop?.(); }}
        />
      )}

      {/* Шапка */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", letterSpacing: -0.5 }}>ИИ-Агент салона</div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>Персональный ассистент для вас и команды</div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearHistory} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: confirmClear ? "1.5px solid #ef4444" : "1.5px solid #E2E8F0", background: confirmClear ? "#fef2f2" : "#fff", color: confirmClear ? "#ef4444" : "#94A3B8", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat, sans-serif", transition: "all 0.2s" }}>
            <Icon name="Trash2" size={13} />
            {confirmClear ? "Точно очистить?" : "Очистить"}
          </button>
        )}
      </div>

      {/* Счётчик бесплатных / баланс */}
      <FreeUsageBar used={freeUsed} limit={FREE_LIMIT} energyBalance={energyBalance} onPaywall={() => setShowPaywall(true)} />

      {/* Режим общения */}
      <div style={{ display: "flex", gap: 8, padding: 4, background: "#F1F5F9", borderRadius: 12, width: "fit-content" }}>
        {CHAT_MODES.map(m => {
          const isActive = m.id === chatMode;
          return (
            <button
              key={m.id}
              onClick={() => { if (m.id !== chatMode) { setChatMode(m.id); setError(""); } }}
              title={m.hint}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 9, border: "none", background: isActive ? "#fff" : "transparent", boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.08)" : "none", color: isActive ? "#0F172A" : "#94A3B8", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat, sans-serif", transition: "all 0.18s" }}
            >
              <Icon name={m.icon} size={14} style={{ color: isActive ? agent.color : "#94A3B8" }} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Выбор агента */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        {AGENTS.map(a => {
          const isActive = a.id === activeAgent;
          return (
            <button key={a.id} onClick={() => { setActiveAgent(a.id); setError(""); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 14, textAlign: "left", border: `2px solid ${isActive ? a.color : "#E8ECF0"}`, background: isActive ? a.bg : "#fff", cursor: "pointer", transition: "all 0.18s", boxShadow: isActive ? `0 4px 16px ${a.color}22` : "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: isActive ? `${a.color}18` : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={a.icon} size={18} style={{ color: isActive ? a.color : "#94A3B8" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? a.color : "#0F172A", lineHeight: 1.3 }}>{a.label}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, lineHeight: 1.4 }}>{a.hint}</div>
              </div>
              {isActive && <div style={{ marginLeft: "auto", flexShrink: 0 }}><Icon name="CheckCircle2" size={16} style={{ color: a.color }} /></div>}
            </button>
          );
        })}
      </div>

      {/* Чат */}
      <SalonAgentChat
        agent={agent}
        messages={messages}
        loading={loading}
        historyLoading={historyLoading}
        error={error}
        input={input}
        setInput={setInput}
        attachedFile={attachedFile}
        setAttachedFile={setAttachedFile}
        batchProgress={batchProgress}
        canSend={canSend}
        isPaid={isPaid}
        freeUsed={freeUsed}
        energyBalance={energyBalance}
        userName={userName}
        bottomRef={bottomRef}
        onSend={send}
        onFileAttach={handleFileAttach}
        onOpenPaywall={() => setShowPaywall(true)}
      />

      <style>{`@keyframes dot-pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }`}</style>
    </div>
  );
}