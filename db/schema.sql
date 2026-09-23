CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin','team_lead','sales')),
  parent_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  payout_cents integer NOT NULL DEFAULT 5000,
  override_cents integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  agreement_version text,
  agreement_accepted_at timestamptz,
  paper_signed boolean NOT NULL DEFAULT false,
  independent_outreach boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS independent_outreach boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_token_hash_idx ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id),
  company text NOT NULL,
  industry text,
  city text,
  website text,
  email text,
  phone text,
  score integer NOT NULL DEFAULT 50 CHECK(score BETWEEN 0 AND 100),
  status text NOT NULL DEFAULT 'NEW',
  value_cents integer NOT NULL DEFAULT 39900,
  commission_cents integer,
  commission_paid boolean NOT NULL DEFAULT false,
  notes text,
  handoff_summary text,
  promises text,
  outreach_text text,
  review_status text NOT NULL DEFAULT 'DRAFT' CHECK (review_status IN ('DRAFT','PENDING','APPROVED','CHANGES_REQUESTED')),
  review_feedback text,
  review_requested_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  handoff_requested_at timestamptz,
  invoice_sent_at timestamptz,
  deposit_paid_at timestamptz,
  mockup_url text,
  last_contact date,
  next_follow_up date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_owner_idx ON leads(owner_id);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE UNIQUE INDEX IF NOT EXISTS leads_website_unique ON leads(lower(website)) WHERE website IS NOT NULL AND website <> '';
CREATE UNIQUE INDEX IF NOT EXISTS leads_email_unique ON leads(lower(email)) WHERE email IS NOT NULL AND email <> '';

ALTER TABLE leads ADD COLUMN IF NOT EXISTS handoff_summary text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS promises text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS handoff_requested_at timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS invoice_sent_at timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS deposit_paid_at timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS outreach_text text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'DRAFT';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS review_feedback text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS review_requested_at timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS lead_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL REFERENCES users(id),
  activity_type text NOT NULL,
  body text NOT NULL,
  visibility text NOT NULL DEFAULT 'team' CHECK (visibility IN ('team','admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lead_activity_lead_idx ON lead_activity(lead_id);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS messages_participants_idx ON messages(sender_id,recipient_id);

CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN','CLOSED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS support_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id),
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS commission_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id),
  user_id uuid NOT NULL REFERENCES users(id),
  type text NOT NULL CHECK(type IN ('SALE','TEAM_OVERRIDE')),
  amount_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING','PAID','VOID')),
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS commission_unique_event ON commission_ledger(lead_id,user_id,type);

CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_created_idx ON audit_log(created_at DESC);
