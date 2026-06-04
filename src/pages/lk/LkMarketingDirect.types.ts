export const ACCENT = "hsl(185,85%,32%)";
export const DIRECT_COLOR = "hsl(25,90%,50%)";
export const API_URL = "https://functions.poehali.dev/f6671108-c48e-4e2b-a3d4-ab0c53503f83";
export const IMAGE_API_URL = "https://functions.poehali.dev/4b0ee2e5-a98e-40b8-bb9a-8a11d39d6e5a";
export const PREPARE_API_URL = "https://functions.poehali.dev/7ada2f96-7236-4d93-8146-fdc7b9ed7dca";
export const CACHE_VERSION = "v2";

export interface Ad {
  title1: string;
  title1_len: number;
  title2: string;
  title2_len: number;
  text: string;
  text_len: number;
  url_path: string;
}

export interface AdGroup {
  group: string;
  service_tag: string;
  ads: Ad[];
  keywords?: string[];
  minus_words?: string[];
}

export interface KeywordGroup {
  group: string;
  service_tag: string;
  keywords: { query: string; frequency: string; frequency_label: string; intent: string }[];
}

export function copyToClipboard(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).catch(() => {});
    const el = document.createElement("textarea");
    el.value = text; el.style.position = "fixed"; el.style.left = "-9999px";
    document.body.appendChild(el); el.focus(); el.select();
    document.execCommand("copy"); document.body.removeChild(el);
  } catch { /* ignore */ }
}
