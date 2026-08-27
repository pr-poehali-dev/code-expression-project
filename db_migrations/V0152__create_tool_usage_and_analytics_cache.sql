CREATE TABLE t_p84565078_code_expression_proj.tool_usage_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  tool_key VARCHAR(100) NOT NULL,
  used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tool_usage_log_user_tool_time ON t_p84565078_code_expression_proj.tool_usage_log(user_id, tool_key, used_at);

CREATE TABLE t_p84565078_code_expression_proj.podelam_analytics_cache (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  pulse_score INTEGER,
  analysis JSONB,
  period_stats JSONB,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);