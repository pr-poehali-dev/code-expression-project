CREATE TABLE t_p84565078_code_expression_proj.partners (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL DEFAULT '',
  website VARCHAR(500) NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  specializations TEXT NOT NULL DEFAULT '',
  audience_segments JSONB NOT NULL DEFAULT '[]',
  geography VARCHAR(255) NOT NULL DEFAULT '',
  work_format VARCHAR(50) NOT NULL DEFAULT '',
  phone VARCHAR(100) NOT NULL DEFAULT '',
  consent_at TIMESTAMPTZ,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  shows_until TIMESTAMPTZ,
  first_approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p84565078_code_expression_proj.partner_sessions (
  id VARCHAR(80) PRIMARY KEY,
  partner_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.partners(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days'
);
CREATE INDEX idx_partner_sessions_partner ON t_p84565078_code_expression_proj.partner_sessions(partner_id);

CREATE TABLE t_p84565078_code_expression_proj.partner_offers (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.partners(id),
  title VARCHAR(255) NOT NULL DEFAULT '',
  data JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  approved_version_id INTEGER,
  pending_version_id INTEGER,
  last_admin_comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);
CREATE INDEX idx_partner_offers_partner ON t_p84565078_code_expression_proj.partner_offers(partner_id);
CREATE INDEX idx_partner_offers_status ON t_p84565078_code_expression_proj.partner_offers(status);

CREATE TABLE t_p84565078_code_expression_proj.partner_offer_versions (
  id SERIAL PRIMARY KEY,
  offer_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.partner_offers(id),
  version_no INTEGER NOT NULL DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  admin_comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by INTEGER
);
CREATE INDEX idx_partner_versions_offer ON t_p84565078_code_expression_proj.partner_offer_versions(offer_id);
CREATE INDEX idx_partner_versions_status ON t_p84565078_code_expression_proj.partner_offer_versions(status);

CREATE TABLE t_p84565078_code_expression_proj.partner_submissions (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.partners(id),
  publication_url VARCHAR(1000) NOT NULL,
  url_key VARCHAR(1000) NOT NULL,
  platform VARCHAR(100) NOT NULL DEFAULT '',
  publication_date DATE,
  partner_comment TEXT NOT NULL DEFAULT '',
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  admin_comment TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by INTEGER
);
CREATE INDEX idx_partner_submissions_partner ON t_p84565078_code_expression_proj.partner_submissions(partner_id);
CREATE INDEX idx_partner_submissions_status ON t_p84565078_code_expression_proj.partner_submissions(status);
CREATE INDEX idx_partner_submissions_urlkey ON t_p84565078_code_expression_proj.partner_submissions(url_key);

CREATE TABLE t_p84565078_code_expression_proj.partner_moderation_history (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.partners(id),
  offer_id INTEGER,
  submission_id INTEGER,
  action VARCHAR(50) NOT NULL,
  comment TEXT,
  actor VARCHAR(20) NOT NULL DEFAULT 'admin',
  actor_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_partner_history_partner ON t_p84565078_code_expression_proj.partner_moderation_history(partner_id);

CREATE TABLE t_p84565078_code_expression_proj.partner_analytics_events (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER NOT NULL,
  offer_id INTEGER NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_partner_events_partner ON t_p84565078_code_expression_proj.partner_analytics_events(partner_id, event_type, created_at);
