ALTER TABLE t_p84565078_code_expression_proj.salons
  ADD COLUMN IF NOT EXISTS website_url text NULL;

CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.seo_analyses (
  id              serial PRIMARY KEY,
  salon_id        integer NOT NULL REFERENCES t_p84565078_code_expression_proj.salons(id),
  url             text NOT NULL,
  is_main_page    boolean NOT NULL DEFAULT false,
  status          varchar(20) NOT NULL DEFAULT 'pending',
  title           text NULL,
  description     text NULL,
  h1              text NULL,
  keywords        text NULL,
  report          text NULL,
  score           integer NULL,
  energy_spent    integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);