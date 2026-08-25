CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.school_partner_leads (
    id SERIAL PRIMARY KEY,
    school_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    messenger VARCHAR(255),
    website VARCHAR(255),
    email VARCHAR(255),
    graduates_per_year VARCHAR(100),
    email_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);