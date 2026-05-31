CREATE TABLE t_p84565078_code_expression_proj.salon_staff (
  id                  SERIAL PRIMARY KEY,
  salon_id            INTEGER REFERENCES t_p84565078_code_expression_proj.salons(id),
  owner_id            INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),

  -- Основное
  name                VARCHAR(255) NOT NULL,
  role                VARCHAR(100),
  experience          NUMERIC(4,1),  -- лет

  -- Поток клиентов
  clients_count       INTEGER,
  new_clients         INTEGER,
  return_pct          NUMERIC(5,1),

  -- Финансы
  revenue             NUMERIC(12,2),
  avg_check           NUMERIC(10,2),
  has_upsell          BOOLEAN,

  -- Повторная запись
  rebooking_pct       NUMERIC(5,1),
  has_rebooking_offer BOOLEAN,

  -- Качество
  service_score       INTEGER,

  -- Продажи
  has_sales_script    BOOLEAN,

  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
