CREATE TABLE t_p84565078_code_expression_proj.rep_mail_log (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  to_email TEXT NOT NULL,
  to_name TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL,
  template_label TEXT NOT NULL DEFAULT '',
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);