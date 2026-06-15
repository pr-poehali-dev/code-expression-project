import Icon from "@/components/ui/icon";
import { AnalysisResult, ACCENT, cardStyle, labelStyle } from "./SeoTypes";
import { CopyBtn } from "./SeoShared";

interface Props {
  result: AnalysisResult;
  activeTab: "tech" | "code";
  buildCodeBlock: (result: AnalysisResult) => string;
}

export default function SeoTabTechCode({ result, activeTab, buildCodeBlock }: Props) {
  const { report, page_data } = result;

  if (activeTab === "tech") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Скорость */}
        {(page_data.load_time_ms != null || page_data.page_size_kb != null) && (
          <div style={{ ...cardStyle, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Производительность</span>
            </div>
            <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {page_data.http_status != null && (
                <div style={{ padding: "12px 14px", background: page_data.http_status === 200 ? "#f0fdf4" : "#fef2f2", borderRadius: 10, border: `1px solid ${page_data.http_status === 200 ? "#bbf7d0" : "#fca5a5"}` }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>HTTP статус</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: page_data.http_status === 200 ? "#16a34a" : "#dc2626" }}>{page_data.http_status}</div>
                </div>
              )}
              {page_data.load_time_ms != null && (
                <div style={{ padding: "12px 14px", background: page_data.load_time_ms < 1500 ? "#f0fdf4" : page_data.load_time_ms < 3000 ? "#fffbeb" : "#fef2f2", borderRadius: 10, border: `1px solid ${page_data.load_time_ms < 1500 ? "#bbf7d0" : page_data.load_time_ms < 3000 ? "#fde68a" : "#fca5a5"}` }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>Время загрузки</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: page_data.load_time_ms < 1500 ? "#16a34a" : page_data.load_time_ms < 3000 ? "#d97706" : "#dc2626" }}>{page_data.load_time_ms} мс</div>
                </div>
              )}
              {page_data.page_size_kb != null && (
                <div style={{ padding: "12px 14px", background: page_data.page_size_kb < 500 ? "#f0fdf4" : "#fffbeb", borderRadius: 10, border: `1px solid ${page_data.page_size_kb < 500 ? "#bbf7d0" : "#fde68a"}` }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>Размер страницы</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: page_data.page_size_kb < 500 ? "#16a34a" : "#d97706" }}>{page_data.page_size_kb} КБ</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Все метрики */}
        <div style={{ ...cardStyle, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Технические параметры</span>
          </div>
          <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Viewport (mobile)", value: page_data.has_viewport ? "Настроен" : "Отсутствует", ok: page_data.has_viewport },
              { label: "Favicon", value: page_data.has_favicon ? "Есть" : "Отсутствует", ok: page_data.has_favicon },
              { label: "robots.txt", value: page_data.robots_exists ? "Есть" : "Не найден", ok: !!page_data.robots_exists },
              { label: "Sitemap", value: page_data.sitemap_url ? "Есть" : "Не найден", ok: !!page_data.sitemap_url },
              { label: "Canonical URL", value: page_data.canonical ? "Настроен" : "Отсутствует", ok: !!page_data.canonical },
              { label: "Schema.org", value: page_data.schema_types?.length ? page_data.schema_types.join(", ") : "Нет", ok: !!(page_data.schema_types?.length) },
              { label: "OG Image", value: page_data.og_image ? "Есть" : "Отсутствует", ok: !!page_data.og_image },
              { label: "Twitter Card", value: page_data.twitter_card || "Нет", ok: !!page_data.twitter_card },
              { label: "Внутренних ссылок", value: page_data.internal_links, ok: page_data.internal_links > 2, hint: "рек. 3+" },
              { label: "Внешних ссылок", value: page_data.external_links, ok: true },
              { label: "Nofollow ссылок", value: page_data.nofollow_links ?? 0, ok: true },
              { label: "Изображений", value: page_data.images_count, ok: true },
              { label: "Без alt-тега", value: page_data.images_no_alt, ok: page_data.images_no_alt === 0, hint: "должно быть 0" },
              { label: "С lazy-load", value: page_data.images_lazy ?? 0, ok: true },
            ].map((row, i) => (
              <div key={i} style={{ padding: "12px 14px", background: row.ok ? "#F8FAFC" : "#fef2f2", borderRadius: 10, border: `1px solid ${row.ok ? "#E2E8F0" : "#fca5a5"}` }}>
                <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>{row.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: row.ok ? "#0F172A" : "#dc2626", wordBreak: "break-all" }}>{String(row.value)}</div>
                {(row as { hint?: string }).hint && <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{(row as { hint?: string }).hint}</div>}
              </div>
            ))}
          </div>
          {page_data.sitemap_url && (
            <div style={{ padding: "0 20px 16px" }}>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>URL Sitemap</div>
              <a href={page_data.sitemap_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: ACCENT, wordBreak: "break-all" }}>{page_data.sitemap_url}</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // code
  const code = buildCodeBlock(result);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ ...cardStyle, padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Готовый код для разработчика</div>
            <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>
              Все исправления собраны в один блок. Скопируйте и отправьте разработчику или в чат с ИИ для применения.
              <br />Robots.txt и карта сайта — настраиваются отдельно на сервере.
            </div>
          </div>
          <CopyBtn text={code} />
        </div>
        <div style={{ background: "#0F172A", borderRadius: 12, padding: "20px", overflow: "auto", position: "relative" }}>
          <pre style={{ margin: 0, fontSize: 12, color: "#e2e8f0", lineHeight: 1.7, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{code}</pre>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: "16px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>Что включено в блок</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { label: "Title", ok: !!report.meta?.title_suggestion },
            { label: "Meta Description", ok: !!report.meta?.description_suggestion },
            { label: "Canonical URL", ok: !!report.meta?.canonical_suggestion },
            { label: "Open Graph теги", ok: !!report.meta?.og_suggestion },
            { label: "Twitter Card теги", ok: !!report.meta?.twitter_suggestion },
            { label: "Schema.org (JSON-LD)", ok: !!report.meta?.schema_jsonld },
            { label: "H1 заголовок", ok: !!report.meta?.h1_suggestion },
            { label: "Ключевые слова", ok: !!report.keyword_suggestions },
            { label: "Robots.txt", ok: false, skip: true },
            { label: "Sitemap.xml", ok: false, skip: true },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: item.skip ? "#94A3B8" : item.ok ? "#16a34a" : "#94A3B8" }}>
              <Icon name={item.skip ? "Minus" : item.ok ? "CheckCircle2" : "Circle"} size={14} style={{ flexShrink: 0 }} />
              {item.label}
              {item.skip && <span style={{ fontSize: 11, color: "#CBD5E1" }}>— настраивается на сервере</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
