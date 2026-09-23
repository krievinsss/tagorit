import { requireUser,publicUser } from "./_lib/auth.js";
import { body,json,method } from "./_lib/http.js";
import { sql } from "./_lib/db.js";

export default async function handler(req,res){
 if(!method(req,res,["POST"]))return;
 try{
  const user=await requireUser(req,res);if(!user)return;
  const {version}=await body(req);
  if(!version)return json(res,400,{error:"Missing agreement version"});
  const q=sql();
  const rows=await q`UPDATE users SET agreement_version=${version},agreement_accepted_at=now(),updated_at=now()
    WHERE id=${user.id}
    RETURNING id,email,name,role,parent_user_id,payout_cents,override_cents,active,agreement_version,agreement_accepted_at,paper_signed`;
  await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id,details)
    VALUES(${user.id},'AGREEMENT_ACCEPTED','user',${user.id},${JSON.stringify({version})}::jsonb)`;
  json(res,200,{user:publicUser(rows[0])});
 }catch(e){console.error(e);json(res,500,{error:"Agreement update failed"})}
}
