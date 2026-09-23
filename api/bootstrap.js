import { requireUser,publicUser } from "./_lib/auth.js";
import { json,method } from "./_lib/http.js";
import { sql } from "./_lib/db.js";

export default async function handler(req,res){
 if(!method(req,res,["GET"]))return;
 try{
  const user=await requireUser(req,res);if(!user)return;
  const q=sql();
  let users=[];
  if(user.role==="admin"){
    users=await q`SELECT id,email,name,role,parent_user_id,payout_cents,override_cents,active,agreement_version,agreement_accepted_at,paper_signed FROM users ORDER BY created_at`;
  }else if(user.role==="team_lead"){
    users=await q`SELECT id,email,name,role,parent_user_id,payout_cents,override_cents,active,agreement_version,agreement_accepted_at,paper_signed FROM users WHERE id=${user.id} OR parent_user_id=${user.id} OR role='admin' ORDER BY created_at`;
  }else{
    users=await q`SELECT id,email,name,role,parent_user_id,payout_cents,override_cents,active,agreement_version,agreement_accepted_at,paper_signed FROM users WHERE id=${user.id} OR role='admin' ORDER BY created_at`;
  }
  let leads;
  if(user.role==="admin") leads=await q`SELECT * FROM leads ORDER BY created_at DESC`;
  else if(user.role==="team_lead") leads=await q`SELECT l.* FROM leads l LEFT JOIN users o ON o.id=l.owner_id WHERE l.owner_id=${user.id} OR o.parent_user_id=${user.id} ORDER BY l.created_at DESC`;
  else leads=await q`SELECT * FROM leads WHERE owner_id=${user.id} ORDER BY created_at DESC`;
  const normalized=leads.map(l=>({id:l.id,company:l.company,industry:l.industry||"",city:l.city||"",website:l.website||"",email:l.email||"",phone:l.phone||"",score:l.score,status:l.status,value:Number(l.value_cents||0)/100,notes:l.notes||"",handoffSummary:l.handoff_summary||"",promises:l.promises||"",handoffRequestedAt:l.handoff_requested_at||null,invoiceSentAt:l.invoice_sent_at||null,depositPaidAt:l.deposit_paid_at||null,lastContact:l.last_contact||"",nextFollowUp:l.next_follow_up||"",ownerId:l.owner_id,commission:l.commission_cents==null?null:Number(l.commission_cents)/100,commissionPaid:l.commission_paid,mockupImage:l.mockup_url||"",inactiveDays:Math.max(0,Math.floor((Date.now()-new Date(l.updated_at||l.created_at||Date.now()).getTime())/86400000)),contactLog:[],adminComments:[]}));
  json(res,200,{user:publicUser(user),users:users.map(publicUser),leads:normalized});
 }catch(e){console.error(e);json(res,500,{error:"Bootstrap failed"})}
}
