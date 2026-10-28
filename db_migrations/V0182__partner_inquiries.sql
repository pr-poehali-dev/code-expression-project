CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.partner_inquiries (
  id serial PRIMARY KEY,
  name varchar(150) NOT NULL,
  site_url varchar(300) NOT NULL,
  email varchar(255) NOT NULL,
  phone varchar(40) NOT NULL,
  message varchar(200) NULL,
  consent_privacy_at timestamptz NOT NULL DEFAULT now(),
  ip varchar(64) NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);