import { useState } from "react";
import { AnalysisResult } from "./SeoTypes";
import SeoReportHeader, { Tab } from "./SeoReportHeader";
import SeoTabOverview from "./SeoTabOverview";
import SeoTabMeta from "./SeoTabMeta";
import SeoTabTechCode from "./SeoTabTechCode";

function buildCodeBlock(result: AnalysisResult): string {
  const { report, url } = result;
  const m = report.meta;
  const lines: string[] = [];

  lines.push(`<!-- SEO-исправления для страницы: ${url} -->`);
  lines.push(`<!-- Оценка: ${report.score}/100 -->`);
  lines.push(``);
  lines.push(`<!-- ═══════════ МЕТА-ТЕГИ (вставить в <head>) ═══════════ -->`);
  lines.push(``);

  if (m?.title_suggestion) { lines.push(`<!-- Title -->`); lines.push(m.title_suggestion); lines.push(``); }
  if (m?.description_suggestion) { lines.push(`<!-- Meta Description -->`); lines.push(m.description_suggestion); lines.push(``); }
  if (m?.canonical_suggestion) { lines.push(`<!-- Canonical -->`); lines.push(m.canonical_suggestion); lines.push(``); }
  if (m?.og_suggestion) { lines.push(`<!-- Open Graph -->`); lines.push(m.og_suggestion); lines.push(``); }
  if (m?.twitter_suggestion) { lines.push(`<!-- Twitter Card -->`); lines.push(m.twitter_suggestion); lines.push(``); }
  if (m?.schema_jsonld) { lines.push(`<!-- Schema.org (JSON-LD) -->`); lines.push(m.schema_jsonld); lines.push(``); }
  if (m?.h1_suggestion) { lines.push(`<!-- ═══════════ H1 ЗАГОЛОВОК (вставить в тело страницы) ═══════════ -->`); lines.push(m.h1_suggestion); lines.push(``); }

  const criticalExamples = (report.critical || []).filter(c => c.example && !c.example.includes("robots") && !c.example.includes("sitemap"));
  if (criticalExamples.length) {
    lines.push(`<!-- ═══════════ КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ ═══════════ -->`);
    criticalExamples.forEach(c => { lines.push(`<!-- ${c.issue} -->`); lines.push(c.example); lines.push(``); });
  }

  const improvExamples = (report.improvements || []).filter(imp => imp.example && !imp.example.toLowerCase().includes("robots") && !imp.example.toLowerCase().includes("sitemap") && imp.example.trim().startsWith("<"));
  if (improvExamples.length) {
    lines.push(`<!-- ═══════════ ДОПОЛНИТЕЛЬНЫЕ УЛУЧШЕНИЯ ═══════════ -->`);
    improvExamples.forEach(imp => { lines.push(`<!-- ${imp.area} -->`); lines.push(imp.example); lines.push(``); });
  }

  if (report.keyword_suggestions) {
    const ks = report.keyword_suggestions;
    lines.push(`<!-- ═══════════ КЛЮЧЕВЫЕ СЛОВА ═══════════ -->`);
    lines.push(`<!-- Основные: ${ks.primary.join(", ")} -->`);
    lines.push(`<!-- LSI: ${ks.secondary.join(", ")} -->`);
    lines.push(`<!-- Длинный хвост: ${ks.long_tail.join(", ")} -->`);
    if (ks.comment) lines.push(`<!-- Совет: ${ks.comment} -->`);
    lines.push(``);
  }

  const ca = report.content_analysis;
  const contentRecs: string[] = [];
  if (ca?.word_count_comment) contentRecs.push(`Объём текста: ${ca.word_count_comment}`);
  if (ca?.cta_recommendation) contentRecs.push(`CTA (призыв к действию): ${ca.cta_recommendation}`);
  if (ca?.services_recommendation) contentRecs.push(`Услуги: ${ca.services_recommendation}`);
  if (ca?.local_seo_recommendation) contentRecs.push(`Локальное SEO: ${ca.local_seo_recommendation}`);
  if ((ca as { readability?: string })?.readability) contentRecs.push(`Читаемость: ${(ca as { readability?: string }).readability}`);
  if ((ca as { uniqueness_risk?: string })?.uniqueness_risk) contentRecs.push(`Уникальность: ${(ca as { uniqueness_risk?: string }).uniqueness_risk}`);
  if (contentRecs.length) {
    lines.push(`<!-- ═══════════ РЕКОМЕНДАЦИИ ПО КОНТЕНТУ СТРАНИЦЫ ═══════════ -->`);
    contentRecs.forEach(r => lines.push(`<!-- ${r} -->`));
    lines.push(``);
  }

  const improvText = (report.improvements || []).filter(imp => imp.better && !imp.example?.toLowerCase().includes("robots") && !imp.better.toLowerCase().includes("sitemap"));
  if (improvText.length) {
    lines.push(`<!-- ═══════════ ЧТО ПЕРЕПИСАТЬ/ДОБАВИТЬ НА СТРАНИЦЕ ═══════════ -->`);
    improvText.forEach(imp => { lines.push(`<!-- [${imp.area}] -->`); if (imp.current) lines.push(`<!-- Сейчас: ${imp.current} -->`); lines.push(`<!-- Как лучше: ${imp.better} -->`); lines.push(``); });
  }

  if (report.quick_wins?.length) {
    lines.push(`<!-- ═══════════ БЫСТРЫЕ УЛУЧШЕНИЯ БЕЗ РАЗРАБОТЧИКА ═══════════ -->`);
    report.quick_wins.forEach((w, i) => lines.push(`<!-- ${i + 1}. ${w} -->`));
    lines.push(``);
  }

  const gr = (report as { growth_opportunities?: string[] }).growth_opportunities;
  if (gr?.length) {
    lines.push(`<!-- ═══════════ ТОЧКИ РОСТА ═══════════ -->`);
    gr.forEach((g, i) => lines.push(`<!-- ${i + 1}. ${g} -->`));
    lines.push(``);
  }

  lines.push(`<!-- ═══════════ ИТОГ ═══════════ -->`);
  lines.push(`<!-- ${report.summary} -->`);

  return lines.join("\n");
}

function exportText(result: AnalysisResult): string {
  const { report, page_data, url } = result;
  const lines = [`SEO-АУДИТ: ${url}`, `Оценка: ${report.score}/100`, ``, `РЕЗЮМЕ`, report.summary, ``];
  if (report.critical?.length) {
    lines.push("КРИТИЧЕСКИЕ ПРОБЛЕМЫ");
    report.critical.forEach((c, i) => { lines.push(`${i + 1}. ${c.issue}`); lines.push(`   ${c.recommendation}`); if (c.example) lines.push(`   Код: ${c.example}`); });
    lines.push("");
  }
  if (report.improvements?.length) {
    lines.push("ЧТО УЛУЧШИТЬ");
    report.improvements.forEach((imp, i) => { lines.push(`${i + 1}. ${imp.area}: ${imp.better}`); if (imp.example) lines.push(`   ${imp.example}`); });
    lines.push("");
  }
  const m = report.meta;
  if (m) {
    lines.push("МЕТА-ДАННЫЕ");
    lines.push(`Title (${page_data.title_len} с): ${page_data.title || "нет"}`);
    if (m.title_suggestion) lines.push(`  → ${m.title_suggestion}`);
    lines.push(`Description (${page_data.desc_len} с): ${page_data.description || "нет"}`);
    if (m.description_suggestion) lines.push(`  → ${m.description_suggestion}`);
    lines.push(`H1: ${(page_data.headings?.h1 || [])[0] || "нет"}`);
    if (m.h1_suggestion) lines.push(`  → ${m.h1_suggestion}`);
    if (m.schema_jsonld) { lines.push("Schema.org:"); lines.push(m.schema_jsonld); }
    lines.push("");
  }
  if (report.keyword_suggestions) {
    const ks = report.keyword_suggestions;
    lines.push("КЛЮЧЕВЫЕ СЛОВА");
    lines.push(`Основные: ${ks.primary.join(", ")}`);
    lines.push(`LSI: ${ks.secondary.join(", ")}`);
    lines.push(`Длинный хвост: ${ks.long_tail.join(", ")}`);
    if (ks.comment) lines.push(`Совет: ${ks.comment}`);
    lines.push("");
  }
  if (report.quick_wins?.length) {
    lines.push("БЫСТРЫЕ УЛУЧШЕНИЯ");
    report.quick_wins.forEach((w, i) => lines.push(`${i + 1}. ${w}`));
  }
  return lines.join("\n");
}

export default function SeoReportView({ result, onBack }: { result: AnalysisResult; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SeoReportHeader
        result={result}
        tab={tab}
        setTab={setTab}
        onBack={onBack}
        exportText={exportText(result)}
      />

      {tab === "overview"  && <SeoTabOverview result={result} />}
      {tab === "meta"      && <SeoTabMeta result={result} activeTab="meta" />}
      {tab === "content"   && <SeoTabMeta result={result} activeTab="content" />}
      {tab === "keywords"  && <SeoTabMeta result={result} activeTab="keywords" />}
      {tab === "tech"      && <SeoTabTechCode result={result} activeTab="tech" buildCodeBlock={buildCodeBlock} />}
      {tab === "code"      && <SeoTabTechCode result={result} activeTab="code" buildCodeBlock={buildCodeBlock} />}
    </div>
  );
}
