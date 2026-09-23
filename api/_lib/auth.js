import crypto from "node:crypto";
import { sql } from "./db.js";
import { json } from "./http.js";

const COOKIE="tagorit_session";
const TTL_DAYS=30;

function cookies(req){
  return Object.fromEntries((req.headers.cookie||"").split(";").map(x=>x.trim()).filter(Boolean).map(x=>{
    const i=x.indexOf("=");
    return [decodeURIComponent(x.slice(0,i)),decodeURIComponent(x.slice(i+1))];
  }));
}
function hash(token){return crypto.createHash("sha256").update(token).digest("hex")}

export async function createSession(res,userId){
  const token=crypto.randomBytes(32).toString("base64url");
  const tokenHash=hash(token);
  const expires=new Date(Date.now()+TTL_DAYS*86400000);
  const q=sql();
  await q`INSERT INTO sessions (user_id,token_hash,expires_at) VALUES (${userId},${tokenHash},${expires.toISOString()})`;
  const secure=process.env.NODE_ENV==="production"?"; Secure":"";
  res.setHeader("Set-Cookie",`${COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${TTL_DAYS*86400}${secure}`);
}
export async function clearSession(req,res){
  const token=cookies(req)[COOKIE];
  if(token){
    const q=sql();
    await q`DELETE FROM sessions WHERE token_hash=${hash(token)}`;
  }
  res.setHeader("Set-Cookie",`${COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
}
export async function getUser(req){
  const token=cookies(req)[COOKIE];
  if(!token)return null;
  const q=sql();
  const rows=await q`SELECT u.id,u.email,u.name,u.role,u.parent_user_id,u.payout_cents,u.override_cents,u.active,u.agreement_version,u.agreement_accepted_at,u.paper_signed
    FROM sessions s JOIN users u ON u.id=s.user_id
    WHERE s.token_hash=${hash(token)} AND s.expires_at>now() AND u.active=true LIMIT 1`;
  return rows[0]||null;
}
export async function requireUser(req,res,roles){
  const user=await getUser(req);
  if(!user){json(res,401,{error:"Unauthorized"});return null}
  if(roles && !roles.includes(user.role)){json(res,403,{error:"Forbidden"});return null}
  return user;
}
export function publicUser(u){
 return {id:u.id,email:u.email,name:u.name,role:u.role,parentId:u.parent_user_id,payout:Number(u.payout_cents||0)/100,override:Number(u.override_cents||0)/100,active:u.active,agreementVersion:u.agreement_version,agreementAcceptedAt:u.agreement_accepted_at,paperSigned:u.paper_signed};
}
