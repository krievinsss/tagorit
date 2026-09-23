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
    users=await q`SELECT id,email,name,role,parent_user_id,payout_cents,override_cents,active,agreement_version,agreement_accepted_at,paper_signed,independent_outreach FROM users ORDER BY created_at`;
  }else if(user.role==="team_lead"){
    users=await q`SELECT id,email,name,role,parent_user_id,payout_cents,override_cents,active,agreement_version,agreement_accepted_at,paper_signed,independent_outreach FROM users WHERE id=${user.id} OR parent_user_id=${user.id} OR role='admin' ORDER BY created_at`;
  }else{
    users=await q`SELECT id,email,name,role,parent_user_id,payout_cents,override_cents,active,agreement_version,agreement_accepted_at,paper_signed,independent_outreach FROM users WHERE id=${user.id} OR role='admin' ORDER BY created_at`;
  }
  let leads;
  if(user.role==="admin") leads=await q`SELECT * FROM leads ORDER BY created_at DESC`;
  else if(user.role==="team_lead") leads=await q`SELECT l.* FROM leads l LEFT JOIN users o ON o.id=l.owner_id WHERE l.owner_id=${user.id} OR o.parent_user_id=${user.id} ORDER BY l.created_at DESC`;
  else leads=await q`SELECT * FROM leads WHERE owner_id=${user.id} ORDER BY created_at DESC`;
  let activities=[];
  if(user.role==="admin"){
    activities=await q`SELECT a.* FROM lead_activity a JOIN leads l ON l.id=a.lead_id ORDER BY a.created_at DESC`;
  }else if(user.role==="team_lead"){
    activities=await q`SELECT a.* FROM lead_activity a JOIN leads l ON l.id=a.lead_id LEFT JOIN users o ON o.id=l.owner_id WHERE l.owner_id=${user.id} OR o.parent_user_id=${user.id} ORDER BY a.created_at DESC`;
  }else{
    activities=await q`SELECT a.* FROM lead_activity a JOIN leads l ON l.id=a.lead_id WHERE l.owner_id=${user.id} ORDER BY a.created_at DESC`;
  }
  const byLead=new Map();
  for(const a of activities){if(!byLead.has(a.lead_id))byLead.set(a.lead_id,[]);byLead.get(a.lead_id).push(a)}
  const normalized=leads.map(l=>{
    const acts=byLead.get(l.id)||[];
    const contactLog=acts.filter(a=>a.activity_type==="CONTACT").map(a=>{let d={};try{d=JSON.parse(a.body)}catch{}return{id:a.id,date:d.date||String(a.created_at).slice(0,10),type:d.type||"Cits",note:d.note||a.body,actorId:a.actor_id,at:a.created_at}});
    const adminComments=acts.filter(a=>a.activity_type==="COMMENT").map(a=>({id:a.id,body:a.body,actorId:a.actor_id,at:a.created_at}));
    return{id:l.id,company:l.company,industry:l.industry||"",city:l.city||"",website:l.website||"",email:l.email||"",phone:l.phone||"",websiteType:l.website_type||"UNKNOWN",offerCode:l.offer_code||"CUSTOM_QUOTE",score:l.score,status:l.status,value:Number(l.value_cents||0)/100,notes:l.notes||"",handoffSummary:l.handoff_summary||"",promises:l.promises||"",outreachText:l.outreach_text||"",reviewStatus:l.review_status||"DRAFT",reviewFeedback:l.review_feedback||"",reviewRequestedAt:l.review_requested_at||null,reviewedAt:l.reviewed_at||null,reviewedBy:l.reviewed_by||null,handoffRequestedAt:l.handoff_requested_at||null,invoiceSentAt:l.invoice_sent_at||null,depositPaidAt:l.deposit_paid_at||null,lastContact:l.last_contact||"",nextFollowUp:l.next_follow_up||"",ownerId:l.owner_id,lostReason:l.lost_reason||"",lostAt:l.lost_at||null,reactivateAfter:l.reactivate_after||"",doNotContact:!!l.do_not_contact,reactivationCount:Number(l.reactivation_count||0),lastReactivatedAt:l.last_reactivated_at||null,reactivationEligible:l.status==="LOST"&&!l.do_not_contact&&!!l.reactivate_after&&String(l.reactivate_after).slice(0,10)<=new Date().toISOString().slice(0,10),commission:l.commission_cents==null?null:Number(l.commission_cents)/100,commissionPaid:l.commission_paid,mockupImage:l.mockup_url||"",createdAt:l.created_at,updatedAt:l.updated_at,inactiveDays:Math.max(0,Math.floor((Date.now()-new Date(l.updated_at||l.created_at||Date.now()).getTime())/86400000)),contactLog,adminComments};
  });
  json(res,200,{user:publicUser(user),users:users.map(publicUser),leads:normalized});
 }catch(e){console.error(e);json(res,500,{error:"Bootstrap failed"})}
}
