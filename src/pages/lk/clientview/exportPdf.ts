import { ViewTest, Interest, subjectTitle, goalTitle } from "./types";

const INTEREST: Record<Interest, { label: string; color: string; bg: string }> = {
  interest: { label: "Потенциальный интерес", color: "#047857", bg: "#D1FAE5" },
  lack_info: { label: "Недостаточно информации", color: "#B45309", bg: "#FEF3C7" },
  risk: { label: "Высокий риск отказа", color: "#B91C1C", bg: "#FEE2E2" },
};

const SHIFT = {
  better: "Стало понятнее",
  same: "Без существенных изменений",
  worse: "Стало хуже",
} as const;

function esc(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/\n/g, "<br>");
}

function list(title: string, items: string[], color: string) {
  if (!items.length) return "";
  return `<div class="lbl" style="color:${color}">${title}</div><ul>${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>`;
}

export function buildReportHtml(test: ViewTest): string {
  const r = test.result;
  const date = new Date(test.created_at || Date.now()).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  const comparison = r.comparison ? `
    <section class="box accent">
      <h2>Что изменилось по сравнению с прошлой версией</h2>
      <p>${esc(r.comparison.summary)}</p>
      ${r.comparison.per_client.map(p => `<p><b>${esc(p.title)}</b> — ${SHIFT[p.shift]}. ${esc(p.text)}</p>`).join("")}
    </section>` : "";

  const clients = r.clients.map((c, i) => {
    const tag = INTEREST[c.interest];
    const dialog = (test.chat || []).filter(m => m.client_index === i);
    return `
    <section class="card">
      <h3>${esc(c.title)}</h3>
      <div class="muted">${esc(c.tagline)}</div>
      <span class="tag" style="background:${tag.bg};color:${tag.color}">${tag.label}</span>
      <div class="lbl">Что может подумать</div>
      <blockquote>${esc(c.thought)}</blockquote>
      ${list("Что привлекает", c.attracts, "#047857")}
      ${list("Что вызывает сомнение", c.doubts, "#B45309")}
      <div class="lbl" style="color:#0E7C86">Что стоит проверить</div>
      <p>${esc(c.check)}</p>
      ${dialog.length ? `<div class="lbl">Вопросы клиенту</div>${dialog.map(m => `<div class="qa"><p class="q">Вопрос: ${esc(m.question)}</p><p class="a">${esc(m.answer)}</p></div>`).join("")}` : ""}
    </section>`;
  }).join("");

  const barriers = r.barriers.map((b, i) =>
    `<div class="row"><div class="num">${i + 1}</div><div><b>${esc(b.title)}</b><br><span class="muted">${esc(b.text)}</span></div></div>`).join("");

  const variants = r.variants.map(v =>
    `<div class="var"><div class="lbl" style="color:#0E7C86">Вариант ${esc(v.label)}</div><b>${esc(v.title)}</b><p class="muted">${esc(v.text)}</p></div>`).join("");

  return `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<title>Разбор «Глазами клиента» — ${date}</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #0F172A; font-size: 12.5px; line-height: 1.55; margin: 0; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  h2 { font-size: 16px; margin: 22px 0 10px; break-after: avoid; page-break-after: avoid; }
  h2 + p.muted { break-after: avoid; page-break-after: avoid; }
  h3 { font-size: 14.5px; margin: 0 0 2px; break-after: avoid; page-break-after: avoid; }
  p { margin: 4px 0 8px; }
  ul { margin: 2px 0 8px; padding-left: 18px; }
  .muted { color: #64748B; }
  .meta { color: #64748B; margin-bottom: 12px; }
  .note { background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 8px 12px; font-size: 11.5px; margin: 10px 0 16px; }
  .material { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 12px; }
  .box, .var, .row, blockquote, li, .a, .qa, .note { break-inside: avoid; page-break-inside: avoid; }
  .lbl, .tag, .muted + .tag { break-after: avoid; page-break-after: avoid; }
  .card h3, .card .muted, .card .tag { break-after: avoid; page-break-after: avoid; }
  p { orphans: 3; widows: 3; }
  .card { border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px; margin-bottom: 12px; }
  .box { border: 1px solid #E2E8F0; border-radius: 10px; padding: 4px 14px 8px; margin-bottom: 12px; }
  .accent { background: #ECFEFF; border-color: #0E7C86; }
  .tag { display: inline-block; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px; margin: 8px 0 4px; }
  .lbl { font-size: 10.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; margin-top: 10px; color: #64748B; }
  blockquote { margin: 4px 0 6px; padding-left: 10px; border-left: 3px solid #2DD4BF; font-style: italic; }
  .q { color: #64748B; margin-bottom: 2px; break-after: avoid; page-break-after: avoid; }
  .a { background: #F8FAFC; border-radius: 8px; padding: 6px 10px; }
  .row { display: flex; gap: 12px; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; }
  .num { width: 24px; height: 24px; border-radius: 999px; background: #2DD4BF; font-weight: 800; text-align: center; line-height: 24px; flex-shrink: 0; }
  .vars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .var { border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 12px; }
  .foot { margin-top: 22px; font-size: 11px; color: #64748B; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style></head><body>
  <h1>Разбор «Покажи глазами клиента»</h1>
  <div class="meta">${esc(subjectTitle(test.subject))} · ${esc(goalTitle(test.goal))} · ${date}</div>
  <div class="note">Это условные профили, а не реальные опрошенные люди. Реакции — гипотезы для проверки, а не измеренные вероятности покупки.</div>
  <h2>Проверяемый материал</h2>
  <div class="material">${esc(test.material)}</div>
  ${comparison}
  <h2>Три взгляда клиентов</h2>
  ${clients}
  <h2>Что клиентская группа обнаружила в предложении</h2>
  ${barriers}
  <h2>Что попробовать изменить в первую очередь</h2>
  <p class="muted">Это варианты для проверки, а не доказанные решения.</p>
  <div class="vars">${variants}</div>
  <h2>Проверка реальностью</h2>
  <p>${esc(r.reality_check)}</p>
  ${test.reality_note ? `<div class="lbl">Заметка по ответам настоящих клиентов</div><p>${esc(test.reality_note)}</p>` : ""}
  <div class="foot">Сформировано в сервисе «Промт Диалог»</div>
</body></html>`;
}

export function downloadReportPdf(test: ViewTest): boolean {
  const html = buildReportHtml(test);
  const w = window.open("", "_blank");
  if (!w) return false;
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
  return true;
}
