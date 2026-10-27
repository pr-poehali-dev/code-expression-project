CREATE TABLE t_p84565078_code_expression_proj.partner_ref_visits (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.partners(id),
  visitor_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_partner_ref_visits_partner ON t_p84565078_code_expression_proj.partner_ref_visits(partner_id, created_at);