export const SEO_URL = "https://functions.poehali.dev/3603658f-6f23-4de6-b671-73bb1832b4e0";
export const ENERGY_MAIN = 50;
export const ENERGY_PAGE = 30;
export const ENERGY_REPEAT = 20;
export const ACCENT = "#0284c7";
export const ACCENT_BG = "#f0f9ff";
export const ACCENT_BORDER = "#bae6fd";

export interface SeoReport {
  score: number;
  summary: string;
  critical: { issue: string; recommendation: string; example: string }[];
  improvements: { area: string; current: string; better: string; example: string }[];
  meta: {
    title_status: "good" | "warn" | "bad"; title_issue: string; title_suggestion: string;
    description_status: "good" | "warn" | "bad"; description_issue: string; description_suggestion: string;
    h1_status: "good" | "warn" | "bad"; h1_issue: string; h1_suggestion: string;
    canonical_status?: "good" | "warn" | "bad"; canonical_issue?: string; canonical_suggestion?: string;
    og_status?: "good" | "warn" | "bad"; og_issue?: string; og_suggestion?: string;
    twitter_status?: "good" | "warn" | "bad"; twitter_issue?: string; twitter_suggestion?: string;
    schema_status?: "good" | "warn" | "bad"; schema_issue?: string; schema_jsonld?: string;
  };
  content_analysis: {
    word_count_status?: string; word_count_comment?: string;
    cta_present: boolean; cta_recommendation: string;
    services_mentioned: boolean; services_recommendation: string;
    local_seo: boolean; local_seo_recommendation: string;
  };
  keyword_suggestions?: {
    primary: string[]; secondary: string[]; long_tail: string[]; comment: string;
  };
  quick_wins: string[];
}

export interface AnalysisResult {
  analysis_id: number;
  url: string;
  page_data: {
    title: string; title_len: number;
    description: string; desc_len: number;
    keywords: string; robots_meta: string;
    og_title: string; og_description: string; og_image: string; og_type: string; og_url: string;
    twitter_card: string; twitter_title: string;
    headings: Record<string, string[]>;
    schema_types: string[]; schema_raw: string;
    canonical: string;
    internal_links: number; external_links: number; nofollow_links: number;
    images_count: number; images_no_alt: number; images_lazy: number;
    word_count: number;
    has_viewport: boolean; has_favicon: boolean;
    http_status?: number; load_time_ms?: number; page_size_kb?: number;
    robots_exists?: boolean; sitemap_url?: string;
  };
  report: SeoReport;
  score: number;
  energy_spent: number;
  energy_balance: number;
}

export interface AnalysisListItem {
  id: number;
  url: string;
  is_main_page: boolean;
  status: string;
  title: string;
  score: number;
  energy_spent: number;
  created_at: string;
}

export const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1.5px solid #E8ECF0",
  boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
};

export const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#94A3B8",
  textTransform: "uppercase",
  letterSpacing: "0.7px",
};