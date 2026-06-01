CREATE TABLE t_p84565078_code_expression_proj.review_replies (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  review_text TEXT NOT NULL,
  reply_text  TEXT NOT NULL,
  sentiment   VARCHAR(20) NOT NULL DEFAULT 'positive',
  tone        VARCHAR(20) NOT NULL DEFAULT 'warm',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
