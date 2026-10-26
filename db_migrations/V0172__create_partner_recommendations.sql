CREATE TABLE t_p84565078_code_expression_proj.partner_recommendations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  source VARCHAR(20) NOT NULL,
  rec_date DATE NOT NULL,
  offer_id INTEGER,
  partner_id INTEGER,
  rec_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  shown_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  UNIQUE (user_id, source, rec_date)
);
CREATE INDEX idx_partner_rec_user_offer ON t_p84565078_code_expression_proj.partner_recommendations(user_id, offer_id, rec_date);
