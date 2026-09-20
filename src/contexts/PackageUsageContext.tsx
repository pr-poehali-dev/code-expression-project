import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useLkAuth } from "./LkAuthContext";
import func2url from "../../backend/func2url.json";

const PACKAGES_URL = (func2url as Record<string, string>)["packages-api"] || "";
function sid() { return localStorage.getItem("lk_session") || ""; }

interface ToolUsage { tool_key: string; name: string; used: number; limit: number; }
export interface PodelamTrialStatus { trial_active: boolean; days_left: number; trial_ends_at?: string; show_warning: boolean; }

interface PackageUsageCtx {
  hasPackage: boolean;
  usageByTool: Record<string, ToolUsage>;
  podelamTrial: PodelamTrialStatus | null;
  loading: boolean;
  refresh: () => void;
}

const Ctx = createContext<PackageUsageCtx>({ hasPackage: false, usageByTool: {}, podelamTrial: null, loading: true, refresh: () => {} });

export function PackageUsageProvider({ children }: { children: ReactNode }) {
  const { user } = useLkAuth();
  const [hasPackage, setHasPackage] = useState(false);
  const [usageByTool, setUsageByTool] = useState<Record<string, ToolUsage>>({});
  const [podelamTrial, setPodelamTrial] = useState<PodelamTrialStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!user?.id || !PACKAGES_URL) { setLoading(false); return; }
    setLoading(true);
    fetch(`${PACKAGES_URL}?action=package_status`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => {
        setPodelamTrial(d.podelam_trial || null);
        if (d.has_package) {
          setHasPackage(true);
          const map: Record<string, ToolUsage> = {};
          (d.usage || []).forEach((u: ToolUsage) => { map[u.tool_key] = u; });
          setUsageByTool(map);
        } else {
          setHasPackage(false);
          setUsageByTool({});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => { refresh(); }, [refresh]);

  return <Ctx.Provider value={{ hasPackage, usageByTool, podelamTrial, loading, refresh }}>{children}</Ctx.Provider>;
}

export function usePackageUsage() { return useContext(Ctx); }