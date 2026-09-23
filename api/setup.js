import bcrypt from "bcryptjs";
import { sql } from "./_lib/db.js";
import { body,json } from "./_lib/http.js";
import { createSession,publicUser } from "./_lib/auth.js";

async function ensureSchema(q){
  await q`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

  await q`CREATE TABLE IF NOT EXISTS users (
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
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;

  await q`CREATE TABLE IF NOT EXISTS sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash text UNIQUE NOT NULL,
    expires_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  await q`CREATE INDEX IF NOT EXISTS sessions_token_hash_idx ON sessions(token_hash)`;
  await q`CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id)`;

  await q`CREATE TABLE IF NOT EXISTS leads (
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
    handoff_requested_at timestamptz,
    invoice_sent_at timestamptz,
    deposit_paid_at timestamptz,
    mockup_url text,
    last_contact date,
    next_follow_up date,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await q`CREATE INDEX IF NOT EXISTS leads_owner_idx ON leads(owner_id)`;
  await q`CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status)`;
  await q`CREATE UNIQUE INDEX IF NOT EXISTS leads_website_unique ON leads(lower(website)) WHERE website IS NOT NULL AND website <> ''`;
  await q`CREATE UNIQUE INDEX IF NOT EXISTS leads_email_unique ON leads(lower(email)) WHERE email IS NOT NULL AND email <> ''`;
  await q`ALTER TABLE leads ADD COLUMN IF NOT EXISTS handoff_summary text`;
  await q`ALTER TABLE leads ADD COLUMN IF NOT EXISTS promises text`;
  await q`ALTER TABLE leads ADD COLUMN IF NOT EXISTS handoff_requested_at timestamptz`;
  await q`ALTER TABLE leads ADD COLUMN IF NOT EXISTS invoice_sent_at timestamptz`;
  await q`ALTER TABLE leads ADD COLUMN IF NOT EXISTS deposit_paid_at timestamptz`;

  await q`CREATE TABLE IF NOT EXISTS lead_activity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    actor_id uuid NOT NULL REFERENCES users(id),
    activity_type text NOT NULL,
    body text NOT NULL,
    visibility text NOT NULL DEFAULT 'team' CHECK (visibility IN ('team','admin')),
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  await q`CREATE INDEX IF NOT EXISTS lead_activity_lead_idx ON lead_activity(lead_id)`;

  await q`CREATE TABLE IF NOT EXISTS messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body text NOT NULL,
    read_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  await q`CREATE INDEX IF NOT EXISTS messages_participants_idx ON messages(sender_id,recipient_id)`;

  await q`CREATE TABLE IF NOT EXISTS support_tickets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id),
    subject text NOT NULL,
    body text NOT NULL,
    status text NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN','CLOSED')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;

  await q`CREATE TABLE IF NOT EXISTS support_replies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id uuid NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id uuid NOT NULL REFERENCES users(id),
    body text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;

  await q`CREATE TABLE IF NOT EXISTS commission_ledger (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id uuid NOT NULL REFERENCES leads(id),
    user_id uuid NOT NULL REFERENCES users(id),
    type text NOT NULL CHECK(type IN ('SALE','TEAM_OVERRIDE')),
    amount_cents integer NOT NULL,
    status text NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING','PAID','VOID')),
    paid_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  await q`CREATE UNIQUE INDEX IF NOT EXISTS commission_unique_event ON commission_ledger(lead_id,user_id,type)`;

  await q`CREATE TABLE IF NOT EXISTS audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id uuid REFERENCES users(id) ON DELETE SET NULL,
    action text NOT NULL,
    entity_type text,
    entity_id uuid,
    details jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  await q`CREATE INDEX IF NOT EXISTS audit_created_idx ON audit_log(created_at DESC)`;
}

export default async function handler(req,res){
 try{
  const q=sql();
  await ensureSchema(q);

  if(req.method==="GET"){
    const rows=await q`SELECT EXISTS(SELECT 1 FROM users WHERE role='admin' AND active=true) AS has_admin`;
    return json(res,200,{needsSetup:!rows[0]?.has_admin,schemaReady:true});
  }

  if(req.method==="POST"){
    const existing=await q`SELECT EXISTS(SELECT 1 FROM users WHERE role='admin') AS has_admin`;
    if(existing[0]?.has_admin)return json(res,409,{error:"Pirmais admin jau ir izveidots"});

    const d=await body(req);
    const name=String(d.name||"").trim();
    const email=String(d.email||"").trim().toLowerCase();
    const password=String(d.password||"");

    if(name.length<2)return json(res,400,{error:"Ievadi vārdu"});
    if(!email.includes("@"))return json(res,400,{error:"Ievadi derīgu e-pastu"});
    if(password.length<10)return json(res,400,{error:"Parolei jābūt vismaz 10 simbolus garai"});

    const passwordHash=await bcrypt.hash(password,12);
    const rows=await q`INSERT INTO users(email,password_hash,name,role,parent_user_id,payout_cents,override_cents,active,paper_signed)
      SELECT ${email},${passwordHash},${name},'admin',NULL,0,0,true,true
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE role='admin')
      RETURNING id,email,name,role,parent_user_id,payout_cents,override_cents,active,agreement_version,agreement_accepted_at,paper_signed`;

    if(!rows[0])return json(res,409,{error:"Pirmais admin jau ir izveidots"});
    await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id,details)
      VALUES(${rows[0].id},'FIRST_ADMIN_CREATED','user',${rows[0].id},${JSON.stringify({email})}::jsonb)`;
    await createSession(res,rows[0].id);
    return json(res,201,{user:publicUser(rows[0])});
  }

  res.setHeader("Allow","GET, POST");
  return json(res,405,{error:"Method not allowed"});
 }catch(e){
  console.error(e);
  if(e?.message==="DATABASE_URL is not configured"){
    return json(res,503,{error:"Vercel projektā nav iestatīts DATABASE_URL.",code:"DATABASE_URL_MISSING"});
  }
  if(e?.code==="28P01"){
    return json(res,503,{error:"Neon DATABASE_URL lietotājvārds vai parole nav derīga.",code:"DATABASE_AUTH_FAILED"});
  }
  if(e?.code==="3D000"){
    return json(res,503,{error:"DATABASE_URL norādītā Neon datubāze neeksistē.",code:"DATABASE_NOT_FOUND"});
  }
  if(e?.code==="23505")return json(res,409,{error:"Šāds e-pasts jau eksistē"});
  const msg=String(e?.message||"");
  if(/fetch failed|ENOTFOUND|ECONNREFUSED|connect/i.test(msg)){
    return json(res,503,{error:"Neizdevās pieslēgties Neon datubāzei. Pārbaudi DATABASE_URL un Neon projekta statusu.",code:"DATABASE_UNREACHABLE"});
  }
  return json(res,500,{error:"Admin setup failed: "+(msg||"nezināma datubāzes kļūda"),code:"SETUP_FAILED"});
 }
}
