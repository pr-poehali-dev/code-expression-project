import Icon from "@/components/ui/icon";

export const ACCENT = "hsl(185,85%,32%)";
export const ACCENT_DARK = "hsl(185,85%,24%)";

export const TONE_OPTIONS = ["Тёплый и дружелюбный", "Профессиональный и экспертный", "Люксовый и статусный", "Молодёжный и энергичный"];

export interface Service { id?: number; name: string; price_min: string; price_max: string; duration_min: string; }

export interface SalonForm {
  name: string; city: string; address: string; description: string;
  avg_check: string; monthly_revenue: string; clients_count: string; masters_count: string;
  target_audience: string; tone_of_voice: string;
  social_instagram: string; social_vk: string; social_telegram: string; main_goal: string;
  has_medical_license: boolean;
  website_url: string;
}

export const EMPTY_FORM: SalonForm = {
  name: "", city: "", address: "", description: "",
  avg_check: "", monthly_revenue: "", clients_count: "", masters_count: "",
  target_audience: "", tone_of_voice: "",
  social_instagram: "", social_vk: "", social_telegram: "", main_goal: "",
  has_medical_license: false,
  website_url: "",
};

export function draftKey(userId: number) { return `lk_salon_draft_${userId}`; }
export function servicesKey(userId: number) { return `lk_salon_services_draft_${userId}`; }

export function saveDraft(userId: number, form: SalonForm, services: Service[]) {
  try {
    localStorage.setItem(draftKey(userId), JSON.stringify(form));
    localStorage.setItem(servicesKey(userId), JSON.stringify(services));
  } catch (_) { /* ignore */ }
}

export function loadDraft(userId: number): { form: SalonForm | null; services: Service[] | null } {
  try {
    const f = localStorage.getItem(draftKey(userId));
    const s = localStorage.getItem(servicesKey(userId));
    return { form: f ? JSON.parse(f) : null, services: s ? JSON.parse(s) : null };
  } catch (_) { return { form: null, services: null }; }
}

export function clearDraft(userId: number) {
  localStorage.removeItem(draftKey(userId));
  localStorage.removeItem(servicesKey(userId));
}

export const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 13px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  fontSize: 13, outline: "none", fontFamily: "Montserrat, sans-serif",
  background: "#fff", boxSizing: "border-box", color: "#0F172A",
};

export function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", overflow: "hidden", marginBottom: 16, boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `hsla(185,85%,32%,0.1)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={15} style={{ color: ACCENT }} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{title}</div>
      </div>
      <div style={{ padding: "16px 20px" }}>{children}</div>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 5 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}
