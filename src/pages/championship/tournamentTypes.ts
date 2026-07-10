export interface Tournament {
  id: number; name: string; slug: string; emoji: string; description: string;
  rules: string; task_text: string; status: string; prize_energy: number;
  prize_2nd: number; prize_3rd: number; min_participants: number;
  registration_starts: string; registration_ends: string;
  task_opens_at: string; work_deadline: string;
  voting_starts: string; voting_ends: string;
  applications_count: number; works_count: number;
  postponed: boolean; postpone_reason: string;
  prizes: Prize[]; season_name: string;
  my_application_status: string | null;
}

export interface Prize { id: number; place: number; title: string; description: string; photo_url: string; value: string; partner_name: string; partner_logo: string; }

export interface Work {
  id: number; title: string; description: string; photos: { url: string; caption?: string }[];
  story: string; services_done: string; master_name: string; tools_used: string; video_url: string;
  votes_count: number; final_place: number | null; created_at: string;
  salon_name: string | null; salon_logo: string | null; salon_city: string | null; salon_url: string | null;
}

export const CT_CSS = `
  @keyframes ct-spin { to { transform: rotate(360deg); } }

  .ct-wrap { min-height: 100vh; background: #f8fafc; font-family: Inter, sans-serif; }

  /* Шапка */
  .ct-header { background: linear-gradient(135deg,#0f172a,#1e3a5f); padding: 20px 16px; }
  .ct-header-inner { max-width: 960px; margin: 0 auto; }
  .ct-back { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 13px; }
  .ct-title-row { display: flex; align-items: flex-start; gap: 14px; margin-top: 14px; flex-wrap: wrap; }
  .ct-emoji { font-size: 40px; flex-shrink: 0; }
  .ct-title-info { flex: 1; min-width: 0; }
  .ct-season { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 600; letter-spacing: 1px; margin-bottom: 4px; }
  .ct-h1 { margin: 0 0 8px; font-size: clamp(18px,4vw,30px); font-weight: 900; color: #fff; line-height: 1.2; }
  .ct-badges { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .ct-apply-btn { padding: 12px 22px; border-radius: 12px; border: none; background: #14B8A6; color: #fff; font-size: 14px; font-weight: 800; cursor: pointer; flex-shrink: 0; align-self: flex-start; }
  .ct-apply-btn:disabled { opacity: 0.7; cursor: wait; }
  .ct-applied-badge { padding: 12px 16px; border-radius: 12px; background: rgba(20,184,166,0.15); border: 1.5px solid rgba(20,184,166,0.4); color: #14B8A6; font-size: 13px; font-weight: 700; flex-shrink: 0; align-self: flex-start; }
  .ct-login-btn { padding: 12px 20px; border-radius: 12px; background: #fff; color: #0f172a; font-size: 13px; font-weight: 700; text-decoration: none; flex-shrink: 0; align-self: flex-start; }

  /* Postponed */
  .ct-postponed { background: #fffbeb; border-bottom: 1px solid #fde68a; padding: 10px 16px; text-align: center; font-size: 13px; color: #92400e; }

  /* Контент */
  .ct-content { max-width: 960px; margin: 0 auto; padding: 20px 16px 64px; }

  /* Табы */
  .ct-tabs { display: flex; gap: 4px; background: #f1f5f9; border-radius: 12px; padding: 4px; width: fit-content; max-width: 100%; overflow-x: auto; margin-bottom: 24px; }
  .ct-tab { padding: 9px 16px; border-radius: 9px; border: none; background: transparent; color: #64748b; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; }
  .ct-tab-active { background: #fff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

  /* Вкладка «О турнире» — двух-колоночная на десктопе */
  .ct-info-grid { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
  @media (max-width: 700px) { .ct-info-grid { grid-template-columns: 1fr; } }

  .ct-section { margin-bottom: 22px; }
  .ct-section-title { margin: 0 0 10px; font-size: 15px; font-weight: 700; color: #0f172a; }
  .ct-sidebar-card { background: #fff; border-radius: 14px; border: 1.5px solid #e2e8f0; padding: 18px; margin-bottom: 14px; }
  .ct-sidebar-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
  .ct-sidebar-label { color: #64748b; }
  .ct-sidebar-val { font-weight: 700; color: #0f172a; }

  /* Сетка работ */
  .ct-works-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
  @media (max-width: 560px) { .ct-works-grid { grid-template-columns: 1fr; } }

  /* Карточка работы */
  .ct-work-card { background: #fff; border-radius: 14px; border: 1.5px solid #e2e8f0; overflow: hidden; }
  .ct-work-photo { height: 180px; background: #f1f5f9; position: relative; cursor: pointer; }
  .ct-work-photo:hover .ct-photo-zoom { opacity: 1; }
  .ct-photo-zoom { position: absolute; bottom: 8px; right: 8px; width: 28px; height: 28px; border-radius: 8px; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; opacity: 0.85; transition: opacity 0.2s; }
  .ct-work-body { padding: 14px; }
  .ct-vote-btn { padding: 8px 14px; border-radius: 8px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; }
  .ct-vote-btn-active { background: #14B8A6; color: #fff; }
  .ct-vote-btn-voted { background: #f0fdf4; color: #059669; cursor: default; }

  /* Мини-фото в раскрытых деталях — кликабельные */
  .ct-thumb { width: 72px; height: 72px; object-fit: cover; border-radius: 8px; flex-shrink: 0; cursor: pointer; transition: transform 0.15s; }
  .ct-thumb:hover { transform: scale(1.05); }

  /* Лайтбокс */
  .ct-lightbox { position: fixed; inset: 0; z-index: 200; background: rgba(10,14,22,0.94); display: flex; align-items: center; justify-content: center; padding: 24px; }
  .ct-lightbox-img { max-width: 100%; max-height: 82vh; border-radius: 8px; object-fit: contain; }
  .ct-lightbox-close { position: absolute; top: 18px; right: 18px; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.12); border: none; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .ct-lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.12); border: none; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .ct-lightbox-prev { left: 12px; }
  .ct-lightbox-next { right: 12px; }
  .ct-lightbox-caption { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,0.7); font-size: 13px; text-align: center; max-width: 80%; }
  .ct-lightbox-counter { position: absolute; top: 22px; left: 24px; color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; }
  @media (max-width: 600px) { .ct-lightbox-nav { width: 38px; height: 38px; } }
`;
