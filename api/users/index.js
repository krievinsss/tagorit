import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { requireUser,publicUser } from "../_lib/auth.js";
import { body,json,method } from "../_lib/http.js";
import { sql } from "../_lib/db.js";

export default async function handler(req,res){
 try{
  const admin=await requireUser(req,res,["admin"]);if(!admin)return;
  const q=sql();
  if(req.method==="GET"){
    const rows=await q`SELECT id,email,name,role,parent_user_id,payout_cents,override_cents,active,agreement_version,agreement_accepted_at,paper_signed FROM users ORDER BY created_at`;
    return json(res,200,{users:rows.map(publicUser)});
  }
  if(req.method==="POST"){
    const d=await body(req);
    if(!d.name||!d.email||!["team_lead","sales"].includes(d.role))return json(res,400,{error:"Nepilnīgi lietotāja dati"});
    const tempPassword=crypto.randomBytes(9).toString("base64url");
    const passwordHash=await bcrypt.hash(tempPassword,12);
    const parent=d.role==="team_lead"?admin.id:(d.parentId||admin.id);
    const rows=await q`INSERT INTO users(email,password_hash,name,role,parent_user_id,payout_cents,override_cents)
      VALUES(${d.email.trim().toLowerCase()},${passwordHash},${d.name.trim()},${d.role},${parent},${Math.round(Number(d.payout||50)*100)},${Math.round(Number(d.override||0)*100)})
      RETURNING id,email,name,role,parent_user_id,payout_cents,override_cents,active,agreement_version,agreement_accepted_at,paper_signed`;
    await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id,details) VALUES(${admin.id},'USER_CREATED','user',${rows[0].id},${JSON.stringify({email:d.email,role:d.role})}::jsonb)`;
    return json(res,201,{user:publicUser(rows[0]),tempPassword});
  }
  if(req.method==="PUT"){
    const d=await body(req);
    if(!d.id)return json(res,400,{error:"Missing user id"});
    const current=(await q`SELECT * FROM users WHERE id=${d.id} LIMIT 1`)[0];
    if(!current)return json(res,404,{error:"User not found"});
    if(current.role==="admin"&&current.id===admin.id && d.active===false)return json(res,400,{error:"Nevar bloķēt savu admin kontu"});
    const role=["team_lead","sales"].includes(d.role)?d.role:current.role;
    const parent=role==="team_lead"?admin.id:(d.parentId||current.parent_user_id||admin.id);
    const rows=await q`UPDATE users SET
      name=${d.name||current.name},
      email=${String(d.email||current.email).toLowerCase().trim()},
      role=${role},
      parent_user_id=${parent},
      payout_cents=${Math.round(Number(d.payout??current.payout_cents/100)*100)},
      override_cents=${Math.round(Number(d.override??current.override_cents/100)*100)},
      active=${d.active??current.active},
      agreement_version=${d.agreementVersion??current.agreement_version},
      agreement_accepted_at=${d.agreementAcceptedAt??current.agreement_accepted_at},
      paper_signed=${d.paperSigned??current.paper_signed},
      updated_at=now()
      WHERE id=${d.id}
      RETURNING id,email,name,role,parent_user_id,payout_cents,override_cents,active,agreement_version,agreement_accepted_at,paper_signed`;
    await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id) VALUES(${admin.id},'USER_UPDATED','user',${d.id})`;
    return json(res,200,{user:publicUser(rows[0])});
  }
  json(res,405,{error:"Method not allowed"});
 }catch(e){console.error(e);if(e?.code==="23505")return json(res,409,{error:"Šāds e-pasts jau eksistē"});json(res,500,{error:"User operation failed"})}
}
