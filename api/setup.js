import bcrypt from "bcryptjs";
import { sql } from "./_lib/db.js";
import { body,json } from "./_lib/http.js";
import { createSession,publicUser } from "./_lib/auth.js";

export default async function handler(req,res){
 try{
  const q=sql();
  if(req.method==="GET"){
    const rows=await q`SELECT EXISTS(SELECT 1 FROM users WHERE role='admin' AND active=true) AS has_admin`;
    return json(res,200,{needsSetup:!rows[0]?.has_admin});
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
  if(e?.code==="23505")return json(res,409,{error:"Šāds e-pasts jau eksistē"});
  return json(res,500,{error:"Admin setup failed"});
 }
}
