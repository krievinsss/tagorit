import { requireUser } from "../_lib/auth.js";
import { body,json } from "../_lib/http.js";
import { sql } from "../_lib/db.js";

const allowed=["NEW","MOCKUP READY","CONTACTED","REPLIED","INTERESTED","READY FOR TOM","MEETING","DEPOSIT PAID","IN DEVELOPMENT","WON","LOST"];

async function canOwn(q,user,ownerId){
 if(user.role==="admin")return true;
 if(ownerId===user.id)return true;
 if(user.role==="team_lead"){
  const rows=await q`SELECT 1 FROM users WHERE id=${ownerId} AND parent_user_id=${user.id} LIMIT 1`;
  return !!rows[0];
 }
 return false;
}
function out(l){return{id:l.id,company:l.company,industry:l.industry||"",city:l.city||"",website:l.website||"",email:l.email||"",phone:l.phone||"",score:l.score,status:l.status,value:Number(l.value_cents||0)/100,notes:l.notes||"",lastContact:l.last_contact||"",nextFollowUp:l.next_follow_up||"",ownerId:l.owner_id,commission:l.commission_cents==null?null:Number(l.commission_cents)/100,commissionPaid:l.commission_paid,mockupImage:l.mockup_url||"",contactLog:[],adminComments:[]}}

export default async function handler(req,res){
 try{
  const user=await requireUser(req,res);if(!user)return;
  const q=sql();
  if(req.method==="POST"){
   const d=await body(req),ownerId=user.role==="admin"?(d.ownerId||user.id):user.id;
   if(!(await canOwn(q,user,ownerId)))return json(res,403,{error:"Invalid owner"});
   if(!d.company?.trim())return json(res,400,{error:"Uzņēmuma nosaukums ir obligāts"});
   const rows=await q`INSERT INTO leads(owner_id,company,industry,city,website,email,phone,score,status,value_cents,notes,last_contact,next_follow_up)
    VALUES(${ownerId},${d.company.trim()},${d.industry||null},${d.city||null},${d.website||null},${d.email||null},${d.phone||null},${Number(d.score||50)},${allowed.includes(d.status)?d.status:"NEW"},${Math.round(Number(d.value||399)*100)},${d.notes||null},${d.lastContact||null},${d.nextFollowUp||null}) RETURNING *`;
   await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id) VALUES(${user.id},'LEAD_CREATED','lead',${rows[0].id})`;
   return json(res,201,{lead:out(rows[0])});
  }
  if(req.method==="PUT"){
   const d=await body(req);if(!d.id)return json(res,400,{error:"Missing lead id"});
   const current=(await q`SELECT * FROM leads WHERE id=${d.id} LIMIT 1`)[0];
   if(!current)return json(res,404,{error:"Lead not found"});
   if(!(await canOwn(q,user,current.owner_id)))return json(res,403,{error:"Forbidden"});
   const ownerId=user.role==="admin"?(d.ownerId||current.owner_id):current.owner_id;
   const rows=await q`UPDATE leads SET company=${d.company||current.company},industry=${d.industry||null},city=${d.city||null},website=${d.website||null},email=${d.email||null},phone=${d.phone||null},score=${Number(d.score??current.score)},status=${allowed.includes(d.status)?d.status:current.status},value_cents=${Math.round(Number(d.value??current.value_cents/100)*100)},notes=${d.notes||null},last_contact=${d.lastContact||null},next_follow_up=${d.nextFollowUp||null},owner_id=${ownerId},commission_cents=${d.commission==null?current.commission_cents:Math.round(Number(d.commission)*100)},commission_paid=${d.commissionPaid??current.commission_paid},updated_at=now() WHERE id=${d.id} RETURNING *`;
   await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id,details) VALUES(${user.id},'LEAD_UPDATED','lead',${d.id},${JSON.stringify({status:rows[0].status})}::jsonb)`;
   return json(res,200,{lead:out(rows[0])});
  }
  if(req.method==="DELETE"){
   const id=req.query?.id;if(!id)return json(res,400,{error:"Missing lead id"});
   const current=(await q`SELECT * FROM leads WHERE id=${id} LIMIT 1`)[0];
   if(!current)return json(res,404,{error:"Lead not found"});
   if(user.role!=="admin"&&current.owner_id!==user.id)return json(res,403,{error:"Forbidden"});
   await q`DELETE FROM leads WHERE id=${id}`;
   return json(res,200,{ok:true});
  }
  json(res,405,{error:"Method not allowed"});
 }catch(e){console.error(e);if(e?.code==="23505")return json(res,409,{error:"Šis uzņēmums jau eksistē sistēmā"});json(res,500,{error:"Lead operation failed"})}
}
