import bcrypt from "bcryptjs";
import { sql } from "../_lib/db.js";
import { body,json,method } from "../_lib/http.js";
import { createSession,publicUser } from "../_lib/auth.js";

export default async function handler(req,res){
 if(!method(req,res,["POST"]))return;
 try{
  const {email,password}=await body(req);
  if(!email||!password)return json(res,400,{error:"E-pasts un parole ir obligāti"});
  const q=sql();
  const rows=await q`SELECT * FROM users WHERE lower(email)=lower(${String(email).trim()}) LIMIT 1`;
  const user=rows[0];
  if(!user||!user.active||!(await bcrypt.compare(String(password),user.password_hash))) return json(res,401,{error:"Nepareizs e-pasts vai parole"});
  await createSession(res,user.id);
  await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id) VALUES(${user.id},'LOGIN','user',${user.id})`;
  json(res,200,{user:publicUser(user)});
 }catch(e){console.error(e);json(res,500,{error:"Login failed"})}
}
