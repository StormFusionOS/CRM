-- Core schema for CRM/SaaS platform

-- Enable extensions used for UUID generation, case-insensitive text, and full-text search support.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- Enumerated types help ensure data consistency across reference tables.
DO $$
BEGIN
    CREATE TYPE user_role_enum AS ENUM ('admin', 'manager', 'agent', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END$$;

DO $$
BEGIN
    CREATE TYPE lead_status_enum AS ENUM ('new', 'contacted', 'converted', 'lost');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END$$;

DO $$
BEGIN
    CREATE TYPE interaction_type_enum AS ENUM ('call', 'sms', 'email', 'note');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END$$;

DO $$
BEGIN
    CREATE TYPE appointment_status_enum AS ENUM ('scheduled', 'completed', 'canceled');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END$$;

DO $$
BEGIN
    CREATE TYPE campaign_type_enum AS ENUM ('seo', 'adwords', 'email', 'social', 'other');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END$$;

DO $$
BEGIN
    CREATE TYPE campaign_status_enum AS ENUM ('draft', 'active', 'paused', 'completed');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END$$;

DO $$
BEGIN
    CREATE TYPE content_status_enum AS ENUM ('draft', 'in_review', 'published');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END$$;

DO $$
BEGIN
    CREATE TYPE change_log_status_enum AS ENUM ('pending', 'approved', 'rejected', 'applied');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END$$;

-- Users represent system operators who can own templates, drafts, etc.
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email CITEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'agent',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Maintain automatic updated_at timestamps.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Contacts represent customers/clients.
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email CITEXT,
    address TEXT,
    company TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Generated tsvector column used for full-text search queries.
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english',
            COALESCE(name, '') || ' ' ||
            COALESCE(email::TEXT, '') || ' ' ||
            COALESCE(phone, '') || ' ' ||
            COALESCE(company, '')
        )
    ) STORED
);

DROP TRIGGER IF EXISTS contacts_set_updated_at ON contacts;
CREATE TRIGGER contacts_set_updated_at
BEFORE UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Ensure contact emails and phone numbers are unique when present.
CREATE UNIQUE INDEX IF NOT EXISTS contacts_unique_email_idx ON contacts (email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS contacts_unique_phone_idx ON contacts (phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS contacts_search_vector_idx ON contacts USING GIN (search_vector);

-- Campaigns drive marketing activities.
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type campaign_type_enum NOT NULL DEFAULT 'other',
    start_date DATE,
    end_date DATE,
    status campaign_status_enum NOT NULL DEFAULT 'draft',
    budget NUMERIC(14,2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT campaigns_date_check CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS campaigns_status_idx ON campaigns (status);
CREATE INDEX IF NOT EXISTS campaigns_date_range_idx ON campaigns (start_date, end_date);

-- Leads tie contacts to specific sales opportunities.
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    source TEXT NOT NULL,
    status lead_status_enum NOT NULL DEFAULT 'new',
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS leads_set_updated_at ON leads;
CREATE TRIGGER leads_set_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS leads_contact_id_idx ON leads (contact_id);
CREATE INDEX IF NOT EXISTS leads_campaign_id_idx ON leads (campaign_id);
CREATE INDEX IF NOT EXISTS leads_status_created_at_idx ON leads (status, created_at DESC);

-- Junction table linking leads to campaigns (multi-touch attribution support).
CREATE TABLE IF NOT EXISTS lead_campaigns (
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    engagement_status TEXT,
    engaged_at TIMESTAMPTZ,
    PRIMARY KEY (lead_id, campaign_id)
);

CREATE INDEX IF NOT EXISTS lead_campaigns_campaign_idx ON lead_campaigns (campaign_id, lead_id);

-- Track all communications and notes around a contact.
CREATE TABLE IF NOT EXISTS interactions (
    id BIGSERIAL PRIMARY KEY,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    type interaction_type_enum NOT NULL,
    channel TEXT,
    content TEXT,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    associated_lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS interactions_contact_occurred_idx ON interactions (contact_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS interactions_lead_idx ON interactions (associated_lead_id);
-- Partial index to quickly locate unread interactions/messages.
CREATE INDEX IF NOT EXISTS interactions_unread_idx ON interactions (contact_id, occurred_at DESC) WHERE NOT is_read;

-- Appointment scheduling with contacts.
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ,
    location TEXT,
    status appointment_status_enum NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT appointments_time_check CHECK (end_datetime IS NULL OR end_datetime >= start_datetime)
);

CREATE INDEX IF NOT EXISTS appointments_contact_idx ON appointments (contact_id, start_datetime DESC);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments (status);

-- Email templates owned by users for outbound communications.
CREATE TABLE IF NOT EXISTS email_templates (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS email_templates_created_by_idx ON email_templates (created_by);

-- Webhook logs retain incoming payloads for troubleshooting.
CREATE TABLE IF NOT EXISTS webhook_logs (
    id BIGSERIAL PRIMARY KEY,
    source TEXT NOT NULL,
    payload JSONB NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    status_code INT,
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS webhook_logs_received_idx ON webhook_logs (received_at DESC);
CREATE INDEX IF NOT EXISTS webhook_logs_processed_idx ON webhook_logs (processed) WHERE processed = FALSE;

-- High-volume task logs partitioned by start date for efficient retention management.
CREATE TABLE IF NOT EXISTS task_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    task_name TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    finished_at TIMESTAMPTZ,
    status TEXT NOT NULL,
    detail TEXT,
    PRIMARY KEY (id, started_at)
) PARTITION BY RANGE (started_at);

-- Partition for January 2025 workloads.
CREATE TABLE IF NOT EXISTS task_logs_y2025m01
    PARTITION OF task_logs FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Default partition captures all other months (including future SERP/SEO ingestion tasks).
CREATE TABLE IF NOT EXISTS task_logs_default
    PARTITION OF task_logs DEFAULT;

CREATE INDEX IF NOT EXISTS task_logs_status_idx ON task_logs USING btree (status);
CREATE INDEX IF NOT EXISTS task_logs_started_idx ON task_logs USING btree (started_at DESC);

-- Page audits capture SEO diagnostics; unique constraint avoids duplicate daily scans per URL.
CREATE TABLE IF NOT EXISTS page_audits (
    id BIGSERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    audit_date TIMESTAMPTZ NOT NULL,
    summary TEXT,
    score INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (url, audit_date)
);

CREATE INDEX IF NOT EXISTS page_audits_url_idx ON page_audits (url);

-- Issues discovered during page audits.
CREATE TABLE IF NOT EXISTS audit_issues (
    id BIGSERIAL PRIMARY KEY,
    audit_id BIGINT NOT NULL REFERENCES page_audits(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    severity TEXT NOT NULL,
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_issues_audit_idx ON audit_issues (audit_id);
CREATE INDEX IF NOT EXISTS audit_issues_severity_idx ON audit_issues (severity, resolved);

-- Change log tracks AI-suggested updates pending approval.
CREATE TABLE IF NOT EXISTS change_log (
    id BIGSERIAL PRIMARY KEY,
    module TEXT NOT NULL,
    change_type TEXT NOT NULL,
    details TEXT,
    status change_log_status_enum NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS change_log_status_idx ON change_log (status);
CREATE INDEX IF NOT EXISTS change_log_module_idx ON change_log (module, status);

-- Content drafts authored by humans or AI.
CREATE TABLE IF NOT EXISTS content_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    source TEXT NOT NULL,
    status content_status_enum NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS content_drafts_set_updated_at ON content_drafts;
CREATE TRIGGER content_drafts_set_updated_at
BEFORE UPDATE ON content_drafts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS content_drafts_author_idx ON content_drafts (author_id);
CREATE INDEX IF NOT EXISTS content_drafts_status_idx ON content_drafts (status, created_at DESC);

-- Content versions store the revision history per draft.
CREATE TABLE IF NOT EXISTS content_versions (
    id BIGSERIAL PRIMARY KEY,
    draft_id UUID NOT NULL REFERENCES content_drafts(id) ON DELETE CASCADE,
    version_num INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT content_versions_unique_version UNIQUE (draft_id, version_num)
);

CREATE INDEX IF NOT EXISTS content_versions_draft_idx ON content_versions (draft_id, version_num DESC);

-- Additional indexes to optimize cross-entity reporting.
CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS interactions_type_idx ON interactions (type);
CREATE INDEX IF NOT EXISTS appointments_created_at_idx ON appointments (created_at DESC);

-- Future high-volume SERP or analytics tables should follow the same partitioning strategy as task_logs for manageability.
