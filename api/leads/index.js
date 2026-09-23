import { requireUser } from "../_lib/auth.js";
import { body,json } from "../_lib/http.js";
import { sql } from "../_lib/db.js";

const allowed=["NEW","MOCKUP READY","CONTACTED","REPLIED","INTERESTED","READY FOR TOM","MEETING","INVOICE SENT","DEPOSIT PAID","IN DEVELOPMENT","WON","LOST"];
const sellerStatuses=["NEW","MOCKUP READY","CONTACTED","REPLIED","INTERESTED","READY FOR TOM","LOST"];
const lockedForSeller=["READY FOR TOM","MEETING","INVOICE SENT","DEPOSIT PAID","IN DEVELOPMENT","WON"];
const websiteTypes=["UNKNOWN","STANDARD_WEBSITE","NO_WEBSITE","LANDING_PAGE","ECOMMERCE","BOOKING","WEB_APP","MARKETPLACE","CUSTOM"];
const standardOfferTypes=new Set(["STANDARD_WEBSITE","NO_WEBSITE"]);
const lostCooldownDays={NO_RESPONSE:45,NOT_INTERESTED:90,NO_BUDGET:60,BAD_TIMING:60,HAS_DEVELOPER:120,OTHER:90};

function normalizedWebsiteType(v){
 return websiteTypes.includes(v)?v:"UNKNOWN";
}
function offerForWebsiteType(v){
 return standardOfferTypes.has(normalizedWebsiteType(v))?"STANDARD_399":"CUSTOM_QUOTE";
}
function plusDays(days){
 const d=new Date();d.setUTCDate(d.getUTCDate()+Number(days||0));return d.toISOString().slice(0,10);
}
function lostPolicy(reason,requestedDate){
 const r=String(reason||"").trim().toUpperCase();
 if(r==="DO_NOT_CONTACT")return{reason:r,doNotContact:true,reactivateAfter:null};
 if(r==="CALL_LATER"){
  const date=String(requestedDate||"").slice(0,10);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return null;
  return{reason:r,doNotContact:false,reactivateAfter:date};
 }
 const days=lostCooldownDays[r];
 if(!days)return null;
 return{reason:r,doNotContact:false,reactivateAfter:plusDays(days)};
}
function reactivationEligible(l){
 if(l.status!=="LOST"||l.do_not_contact)return false;
 if(!l.reactivate_after)return false;
 return String(l.reactivate_after).slice(0,10)<=new Date().toISOString().slice(0,10);
}

async function canAccess(q,user,ownerId){
 if(user.role==="admin")return true;
 if(ownerId===user.id)return true;
 if(user.role==="team_lead"){
  const rows=await q`SELECT 1 FROM users WHERE id=${ownerId} AND parent_user_id=${user.id} LIMIT 1`;
  return !!rows[0];
 }
 return false;
}

async function isDirectChild(q,user,ownerId){
 if(user.role!=="team_lead")return false;
 const rows=await q`SELECT 1 FROM users WHERE id=${ownerId} AND parent_user_id=${user.id} AND role='sales' LIMIT 1`;
 return !!rows[0];
}

async function ownerInfo(q,ownerId){
 const rows=await q`SELECT id,role,parent_user_id,independent_outreach FROM users WHERE id=${ownerId} LIMIT 1`;
 return rows[0]||null;
}

function normalizeDomain(v=""){
 try{
  const u=new URL(/^https?:\/\//i.test(v)?v:"https://"+v);
  return u.hostname.replace(/^www\./,"").toLowerCase();
 }catch{
  return String(v||"").trim().toLowerCase().replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0];
 }
}

function inactiveDays(l){
 const at=new Date(l.updated_at||l.created_at||Date.now()).getTime();
 return Math.max(0,Math.floor((Date.now()-at)/86400000));
}

function parseContact(a){
 let d={};try{d=JSON.parse(a.body)}catch{}
 return{id:a.id,date:d.date||String(a.created_at).slice(0,10),type:d.type||"Cits",note:d.note||a.body,actorId:a.actor_id,at:a.created_at};
}

async function activitiesFor(q,leadId){
 const rows=await q`SELECT * FROM lead_activity WHERE lead_id=${leadId} ORDER BY created_at DESC`;
 return{
  contactLog:rows.filter(a=>a.activity_type==="CONTACT").map(parseContact),
  adminComments:rows.filter(a=>a.activity_type==="COMMENT").map(a=>({id:a.id,body:a.body,actorId:a.actor_id,at:a.created_at}))
 };
}

async function out(q,l){
 const acts=await activitiesFor(q,l.id);
 return{
  id:l.id,company:l.company,industry:l.industry||"",city:l.city||"",website:l.website||"",email:l.email||"",phone:l.phone||"",
  websiteType:l.website_type||"UNKNOWN",offerCode:l.offer_code||offerForWebsiteType(l.website_type),
  score:l.score,status:l.status,value:Number(l.value_cents||0)/100,notes:l.notes||"",
  handoffSummary:l.handoff_summary||"",promises:l.promises||"",outreachText:l.outreach_text||"",
  reviewStatus:l.review_status||"DRAFT",reviewFeedback:l.review_feedback||"",reviewRequestedAt:l.review_requested_at||null,
  reviewedAt:l.reviewed_at||null,reviewedBy:l.reviewed_by||null,
  handoffRequestedAt:l.handoff_requested_at||null,invoiceSentAt:l.invoice_sent_at||null,depositPaidAt:l.deposit_paid_at||null,
  lastContact:l.last_contact||"",nextFollowUp:l.next_follow_up||"",ownerId:l.owner_id,
  lostReason:l.lost_reason||"",lostAt:l.lost_at||null,reactivateAfter:l.reactivate_after||"",doNotContact:!!l.do_not_contact,reactivationCount:Number(l.reactivation_count||0),lastReactivatedAt:l.last_reactivated_at||null,reactivationEligible:reactivationEligible(l),
  commission:l.commission_cents==null?null:Number(l.commission_cents)/100,commissionPaid:l.commission_paid,
  mockupImage:l.mockup_url||"",createdAt:l.created_at,updatedAt:l.updated_at,inactiveDays:inactiveDays(l),
  ...acts
 };
}

async function duplicateLead(q,d,excludeId=null){
 const rows=excludeId
  ? await q`SELECT id,company,website,email FROM leads WHERE id<>${excludeId}`
  : await q`SELECT id,company,website,email FROM leads`;
 const company=String(d.company||"").trim().toLowerCase();
 const email=String(d.email||"").trim().toLowerCase();
 const website=normalizeDomain(d.website||"");
 return rows.find(r=>{
  if(company&&String(r.company||"").trim().toLowerCase()===company)return true;
  if(email&&String(r.email||"").trim().toLowerCase()===email)return true;
  if(website&&normalizeDomain(r.website||"")===website)return true;
  return false;
 });
}

async function createCommissions(q,lead,userCommissionCents){
 const ownerRows=await q`SELECT id,parent_user_id,payout_cents FROM users WHERE id=${lead.owner_id} LIMIT 1`;
 const owner=ownerRows[0];
 if(!owner)return;
 const saleAmount=userCommissionCents==null?Number(owner.payout_cents||0):Number(userCommissionCents||0);
 await q`INSERT INTO commission_ledger(lead_id,user_id,type,amount_cents,status)
   VALUES(${lead.id},${owner.id},'SALE',${saleAmount},'PENDING')
   ON CONFLICT (lead_id,user_id,type) DO NOTHING`;
 if(owner.parent_user_id){
  const parentRows=await q`SELECT id,role,override_cents,active FROM users WHERE id=${owner.parent_user_id} LIMIT 1`;
  const parent=parentRows[0];
  if(parent?.role==="team_lead"&&parent.active&&Number(parent.override_cents||0)>0){
   await q`INSERT INTO commission_ledger(lead_id,user_id,type,amount_cents,status)
     VALUES(${lead.id},${parent.id},'TEAM_OVERRIDE',${Number(parent.override_cents||0)},'PENDING')
     ON CONFLICT (lead_id,user_id,type) DO NOTHING`;
  }
 }
 return saleAmount;
}

async function canReview(q,user,current){
 if(user.role==="admin")return true;
 return isDirectChild(q,user,current.owner_id);
}

export default async function handler(req,res){
 try{
  const user=await requireUser(req,res);if(!user)return;
  const q=sql();

  if(req.method==="GET"){
   const lookup=String(req.query?.lookup||"").trim().toLowerCase();
   if(lookup.length<2)return json(res,200,{matches:[]});
   const pattern="%"+lookup+"%";
   const rows=await q`SELECT l.*,u.name AS owner_name
     FROM leads l LEFT JOIN users u ON u.id=l.owner_id
     WHERE lower(l.company) LIKE ${pattern}
        OR lower(COALESCE(l.website,'')) LIKE ${pattern}
        OR lower(COALESCE(l.email,'')) LIKE ${pattern}
     ORDER BY CASE WHEN lower(l.company)=${lookup} THEN 0 ELSE 1 END,l.updated_at DESC
     LIMIT 8`;
   return json(res,200,{matches:rows.map(l=>({
    id:l.id,company:l.company,status:l.status,ownerName:l.owner_name||"",lastContact:l.last_contact||"",
    website:l.website||"",websiteType:l.website_type||"UNKNOWN",offerCode:l.offer_code||offerForWebsiteType(l.website_type),
    lostReason:l.lost_reason||"",lostAt:l.lost_at||null,reactivateAfter:l.reactivate_after||"",
    doNotContact:!!l.do_not_contact,reactivationEligible:reactivationEligible(l)
   }))});
  }

  if(req.method==="POST"){
   const d=await body(req),ownerId=user.role==="admin"?(d.ownerId||user.id):user.id;
   if(!(await canAccess(q,user,ownerId)))return json(res,403,{error:"Invalid owner"});
   if(!d.company?.trim())return json(res,400,{error:"Uzņēmuma nosaukums ir obligāts"});
   const dup=await duplicateLead(q,d);
   if(dup)return json(res,409,{error:"Šis uzņēmums jau eksistē sistēmā: "+dup.company});
   const requestedStatus=allowed.includes(d.status)?d.status:"NEW";
   if(user.role!=="admin"&&!sellerStatuses.includes(requestedStatus))return json(res,403,{error:"Šo statusu drīkst iestatīt tikai admins"});
   const websiteType=normalizedWebsiteType(d.websiteType);
   const offerCode=offerForWebsiteType(websiteType);
   if(requestedStatus==="CONTACTED"&&websiteType==="UNKNOWN")return json(res,400,{error:"Pirms outreach norādi mājaslapas tipu"});
   if(requestedStatus==="CONTACTED"&&offerCode!=="STANDARD_399"&&/\b399\b/.test(String(d.outreachText||"")))
    return json(res,400,{error:"399 € piedāvājums nav paredzēts šim mājaslapas tipam. Izmanto custom quote / nodod Tomam."});
   const startValue=offerCode==="STANDARD_399"?399:Number(d.value||0);
   const rows=await q`INSERT INTO leads(owner_id,company,industry,city,website,email,phone,website_type,offer_code,score,status,value_cents,notes,handoff_summary,promises,outreach_text,mockup_url,last_contact,next_follow_up)
    VALUES(${ownerId},${d.company.trim()},${d.industry||null},${d.city||null},${d.website||null},${d.email||null},${d.phone||null},${websiteType},${offerCode},${Number(d.score||50)},${requestedStatus},${Math.round(startValue*100)},${d.notes||null},${d.handoffSummary||null},${d.promises||null},${d.outreachText||null},${d.mockupImage||null},${d.lastContact||null},${d.nextFollowUp||null}) RETURNING *`;
   await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id) VALUES(${user.id},'LEAD_CREATED','lead',${rows[0].id})`;
   return json(res,201,{lead:await out(q,rows[0])});
  }

  if(req.method==="PUT"){
   const d=await body(req);if(!d.id)return json(res,400,{error:"Missing lead id"});
   const current=(await q`SELECT * FROM leads WHERE id=${d.id} LIMIT 1`)[0];
   if(!current)return json(res,404,{error:"Lead not found"});

   if(d.action==="REACTIVATE"){
    if(current.status!=="LOST")return json(res,400,{error:"Atkārtoti aktivizēt var tikai LOST uzņēmumu"});
    if(current.do_not_contact)return json(res,400,{error:"Šim uzņēmumam ir Do not contact statuss"});
    if(!reactivationEligible(current))return json(res,400,{error:"Atkārtota uzruna vēl nav atļauta. Datums: "+(current.reactivate_after||"nav noteikts")});
    let newOwner=current.owner_id;
    if(user.role==="admin"&&d.ownerId){
     const target=(await q`SELECT id FROM users WHERE id=${d.ownerId} AND active=true AND role<>'admin' LIMIT 1`)[0];
     if(!target)return json(res,400,{error:"Nederīgs jaunais atbildīgais"});
     newOwner=target.id;
    }else if(user.role!=="admin"){
     newOwner=user.id;
    }
    await q`INSERT INTO lead_activity(lead_id,actor_id,activity_type,body,visibility)
      VALUES(${d.id},${user.id},'REACTIVATION',${JSON.stringify({previousOwner:current.owner_id,lostReason:current.lost_reason,lostAt:current.lost_at,reactivateAfter:current.reactivate_after})},'team')`;
    const rows=await q`UPDATE leads SET owner_id=${newOwner},status='NEW',lost_reason=NULL,lost_at=NULL,reactivate_after=NULL,do_not_contact=false,
      reactivation_count=COALESCE(reactivation_count,0)+1,last_reactivated_at=now(),next_follow_up=NULL,
      review_status='DRAFT',review_feedback=NULL,review_requested_at=NULL,reviewed_at=NULL,reviewed_by=NULL,updated_at=now()
      WHERE id=${d.id} RETURNING *`;
    await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id,details)
      VALUES(${user.id},'LEAD_REACTIVATED','lead',${d.id},${JSON.stringify({previousOwner:current.owner_id,newOwner})}::jsonb)`;
    return json(res,200,{lead:await out(q,rows[0])});
   }

   if(!(await canAccess(q,user,current.owner_id)))return json(res,403,{error:"Forbidden"});

   if(d.action==="CLAIM_INACTIVE"){
    if(!["admin","team_lead"].includes(user.role))return json(res,403,{error:"Forbidden"});
    if(lockedForSeller.includes(current.status)||current.status==="LOST")return json(res,400,{error:"Šo klientu vairs nevar pārņemt inactivity noteikuma ietvaros"});
    if(inactiveDays(current)<14)return json(res,400,{error:"Klients vēl nav neaktīvs 14 dienas"});
    let ownerId=user.id;
    if(user.role==="team_lead"){
     if(!(await isDirectChild(q,user,current.owner_id)))return json(res,403,{error:"Vari pārņemt tikai sava tiešā apakšpartnera neaktīvu klientu"});
    }else if(d.ownerId){
     const target=(await q`SELECT id FROM users WHERE id=${d.ownerId} AND active=true AND role<>'admin' LIMIT 1`)[0];
     if(!target)return json(res,400,{error:"Nederīgs jaunais atbildīgais"});
     ownerId=target.id;
    }
    const rows=await q`UPDATE leads SET owner_id=${ownerId},updated_at=now() WHERE id=${d.id} RETURNING *`;
    await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id,details)
      VALUES(${user.id},'LEAD_RECLAIMED','lead',${d.id},${JSON.stringify({previousOwner:current.owner_id,newOwner:ownerId})}::jsonb)`;
    return json(res,200,{lead:await out(q,rows[0])});
   }

   if(d.action==="ADD_CONTACT"){
    if(user.role==="team_lead"&&current.owner_id!==user.id)return json(res,403,{error:"Team Lead nevar rakstīt saziņu cita partnera vietā"});
    if(user.role!=="admin"&&lockedForSeller.includes(current.status))return json(res,403,{error:"Klients jau ir nodots Tomam"});
    const type=String(d.type||"Cits").slice(0,40),note=String(d.note||"").trim();
    if(!note)return json(res,400,{error:"Ieraksti saziņas piezīmi"});
    const date=String(d.date||new Date().toISOString().slice(0,10));
    await q`INSERT INTO lead_activity(lead_id,actor_id,activity_type,body,visibility)
      VALUES(${d.id},${user.id},'CONTACT',${JSON.stringify({date,type,note})},'team')`;
    const rows=await q`UPDATE leads SET last_contact=${date},updated_at=now() WHERE id=${d.id} RETURNING *`;
    return json(res,200,{lead:await out(q,rows[0])});
   }

   if(d.action==="ADD_COMMENT"){
    if(!(await canReview(q,user,current)))return json(res,403,{error:"Komentārus var pievienot admins vai konkrētā partnera Team Lead"});
    const note=String(d.note||"").trim();
    if(!note)return json(res,400,{error:"Komentārs ir tukšs"});
    await q`INSERT INTO lead_activity(lead_id,actor_id,activity_type,body,visibility)
      VALUES(${d.id},${user.id},'COMMENT',${note},'team')`;
    const rows=await q`UPDATE leads SET updated_at=now() WHERE id=${d.id} RETURNING *`;
    return json(res,200,{lead:await out(q,rows[0])});
   }

   if(d.action==="SUBMIT_REVIEW"){
    if(current.owner_id!==user.id)return json(res,403,{error:"Pārbaudei lead var iesniegt tikai tā īpašnieks"});
    const owner=await ownerInfo(q,current.owner_id);
    if(!owner||owner.role!=="sales")return json(res,400,{error:"Šim lietotājam Team Lead pārbaude nav nepieciešama"});
    if(owner.independent_outreach)return json(res,400,{error:"Tev ir ieslēgts patstāvīgs outreach režīms"});
    const mockup=String(d.mockupImage??current.mockup_url??"");
    const outreach=String(d.outreachText??current.outreach_text??"").trim();
    if(!mockup)return json(res,400,{error:"Pirms pārbaudes pievieno mockup"});
    if(outreach.length<20)return json(res,400,{error:"Pirms pārbaudes pievieno klientam paredzēto e-pasta tekstu"});
    if((current.website_type||"UNKNOWN")==="UNKNOWN")return json(res,400,{error:"Pirms QA norādi mājaslapas tipu"});
    if(offerForWebsiteType(current.website_type)!=="STANDARD_399"&&/\b399\b/.test(outreach))
      return json(res,400,{error:"399 € piedāvājumu nedrīkst sūtīt e-commerce, booking vai citam custom projektam"});
    const rows=await q`UPDATE leads SET mockup_url=${mockup},outreach_text=${outreach},review_status='PENDING',review_feedback=NULL,review_requested_at=now(),reviewed_at=NULL,reviewed_by=NULL,updated_at=now() WHERE id=${d.id} RETURNING *`;
    await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id) VALUES(${user.id},'LEAD_REVIEW_SUBMITTED','lead',${d.id})`;
    return json(res,200,{lead:await out(q,rows[0])});
   }

   if(d.action==="REVIEW_APPROVE"){
    if(!(await canReview(q,user,current)))return json(res,403,{error:"Šo mockup var apstiprināt tikai Team Lead vai admins"});
    if(current.review_status!=="PENDING")return json(res,400,{error:"Šis lead šobrīd negaida pārbaudi"});
    const rows=await q`UPDATE leads SET review_status='APPROVED',review_feedback=NULL,reviewed_at=now(),reviewed_by=${user.id},updated_at=now() WHERE id=${d.id} RETURNING *`;
    await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id) VALUES(${user.id},'LEAD_REVIEW_APPROVED','lead',${d.id})`;
    return json(res,200,{lead:await out(q,rows[0])});
   }

   if(d.action==="REVIEW_CHANGES"){
    if(!(await canReview(q,user,current)))return json(res,403,{error:"Šo mockup var pārskatīt tikai Team Lead vai admins"});
    const feedback=String(d.feedback||"").trim();
    if(feedback.length<3)return json(res,400,{error:"Uzraksti, kas jāizlabo"});
    const rows=await q`UPDATE leads SET review_status='CHANGES_REQUESTED',review_feedback=${feedback},reviewed_at=now(),reviewed_by=${user.id},updated_at=now() WHERE id=${d.id} RETURNING *`;
    await q`INSERT INTO lead_activity(lead_id,actor_id,activity_type,body,visibility) VALUES(${d.id},${user.id},'COMMENT',${"QA: "+feedback},'team')`;
    await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id) VALUES(${user.id},'LEAD_REVIEW_CHANGES','lead',${d.id})`;
    return json(res,200,{lead:await out(q,rows[0])});
   }

   if(user.role==="team_lead"&&current.owner_id!==user.id){
    return json(res,403,{error:"Apakšpartnera lead vari pārskatīt un komentēt, bet ne rediģēt viņa vietā"});
   }
   if(user.role!=="admin"&&lockedForSeller.includes(current.status)){
    return json(res,403,{error:"Klients jau ir nodots Tomam. No šī brīža ieraksts partnerim ir tikai apskatei."});
   }

   const requestedStatus=allowed.includes(d.status)?d.status:current.status;
   if(current.status==="LOST"&&requestedStatus!=="LOST")return json(res,400,{error:"LOST uzņēmumu atver ar pogu Restart sales process"});
   const websiteType=normalizedWebsiteType(d.websiteType??current.website_type);
   const offerCode=offerForWebsiteType(websiteType);
   const proposedOutreach=String(d.outreachText??current.outreach_text??"");
   if(requestedStatus==="CONTACTED"&&websiteType==="UNKNOWN")return json(res,400,{error:"Pirms pirmā kontakta norādi mājaslapas tipu"});
   if(requestedStatus==="CONTACTED"&&offerCode!=="STANDARD_399"&&/\b399\b/.test(proposedOutreach))
    return json(res,400,{error:"Šim projektam 399 € standarta piedāvājums nav piemērojams. Izmanto custom quote / nodod Tomam."});
   if(user.role!=="admin"&&!sellerStatuses.includes(requestedStatus)){
    return json(res,403,{error:"Šo statusu drīkst iestatīt tikai admins"});
   }

   const owner=await ownerInfo(q,current.owner_id);
   if(user.role!=="admin"&&requestedStatus==="CONTACTED"&&current.status!=="CONTACTED"&&owner?.role==="sales"&&!owner.independent_outreach&&current.review_status!=="APPROVED"){
    return json(res,400,{error:"Pirms pirmā e-pasta nosūtīšanas Team Lead jāapstiprina mockup un e-pasta teksts"});
   }

   if(requestedStatus==="READY FOR TOM"&&current.status!=="READY FOR TOM"){
    if(!(String(d.email||current.email||"").trim()||String(d.phone||current.phone||"").trim()))
      return json(res,400,{error:"Pirms nodošanas Tomam pievieno klienta e-pastu vai telefonu"});
    if(String(d.handoffSummary||current.handoff_summary||"").trim().length<10)
      return json(res,400,{error:"Pirms nodošanas Tomam aizpildi īsu prasību/sarunas kopsavilkumu"});
    if(String(d.promises||current.promises||"").trim().length<3)
      return json(res,400,{error:"Norādi, ko klientam esi apsolījis. Ja neko papildus — ieraksti 'Nekas papildus nav solīts'."});
   }

   if(user.role==="admin"){
    if(requestedStatus==="MEETING"&&!["READY FOR TOM","MEETING"].includes(current.status))
      return json(res,400,{error:"Google Meet var sākt no statusa Gatavs pārņemšanai"});
    if(requestedStatus==="INVOICE SENT"&&!["READY FOR TOM","MEETING","INVOICE SENT"].includes(current.status))
      return json(res,400,{error:"Rēķinu sūta pēc klienta nodošanas Tomam"});
    if(requestedStatus==="DEPOSIT PAID"&&!["INVOICE SENT","DEPOSIT PAID"].includes(current.status))
      return json(res,400,{error:"Priekšapmaksu var apstiprināt tikai pēc statusa Rēķins nosūtīts"});
    if(requestedStatus==="IN DEVELOPMENT"&&!["DEPOSIT PAID","IN DEVELOPMENT"].includes(current.status))
      return json(res,400,{error:"Izstrādi sāk pēc apstiprinātas priekšapmaksas"});
    if(requestedStatus==="WON"&&!["DEPOSIT PAID","IN DEVELOPMENT","WON"].includes(current.status))
      return json(res,400,{error:"Projektu var pabeigt tikai pēc priekšapmaksas"});
   }

   const dup=await duplicateLead(q,{...current,...d},d.id);
   if(dup)return json(res,409,{error:"Šis uzņēmums jau eksistē sistēmā: "+dup.company});

   const ownerId=user.role==="admin"?(d.ownerId||current.owner_id):current.owner_id;
   let commissionCents=d.commission==null?current.commission_cents:Math.round(Number(d.commission)*100);
   const nowIso=new Date().toISOString();
   let handoffRequestedAt=current.handoff_requested_at;
   let invoiceSentAt=current.invoice_sent_at;
   let depositPaidAt=current.deposit_paid_at;
   if(requestedStatus==="READY FOR TOM"&&!handoffRequestedAt)handoffRequestedAt=nowIso;
   if(requestedStatus==="INVOICE SENT"&&!invoiceSentAt)invoiceSentAt=nowIso;
   if(requestedStatus==="DEPOSIT PAID"&&!depositPaidAt)depositPaidAt=nowIso;

   let lostReason=current.lost_reason;
   let lostAt=current.lost_at;
   let reactivateAfter=current.reactivate_after;
   let doNotContact=current.do_not_contact;
   if(requestedStatus==="LOST"&&current.status!=="LOST"){
    const policy=lostPolicy(d.lostReason,d.reactivateAfter);
    if(!policy)return json(res,400,{error:"Izvēlies LOST iemeslu. Call later gadījumā norādi atkārtota kontakta datumu."});
    lostReason=policy.reason;lostAt=nowIso;reactivateAfter=policy.reactivateAfter;doNotContact=policy.doNotContact;
   }

   let reviewStatus=current.review_status||"DRAFT";
   const mockupImage=d.mockupImage??current.mockup_url;
   const outreachText=d.outreachText??current.outreach_text;
   const changedReviewedMaterial=(d.mockupImage!==undefined&&d.mockupImage!==current.mockup_url)||(d.outreachText!==undefined&&d.outreachText!==current.outreach_text);
   if(user.id===current.owner_id&&owner?.role==="sales"&&!owner.independent_outreach&&reviewStatus==="APPROVED"&&changedReviewedMaterial)reviewStatus="DRAFT";

   let rows=await q`UPDATE leads SET
    company=${d.company||current.company},industry=${d.industry||null},city=${d.city||null},website=${d.website||null},email=${d.email||null},phone=${d.phone||null},
    website_type=${websiteType},offer_code=${offerCode},
    score=${Number(d.score??current.score)},status=${requestedStatus},value_cents=${Math.round(Number(d.value??(offerCode==="STANDARD_399"?399:current.value_cents/100))*100)},
    notes=${d.notes||null},handoff_summary=${d.handoffSummary||null},promises=${d.promises||null},outreach_text=${outreachText||null},mockup_url=${mockupImage||null},
    review_status=${reviewStatus},
    last_contact=${d.lastContact||current.last_contact||null},next_follow_up=${d.nextFollowUp||null},owner_id=${ownerId},
    lost_reason=${lostReason||null},lost_at=${lostAt||null},reactivate_after=${reactivateAfter||null},do_not_contact=${!!doNotContact},
    commission_cents=${commissionCents},commission_paid=${d.commissionPaid??current.commission_paid},
    handoff_requested_at=${handoffRequestedAt},invoice_sent_at=${invoiceSentAt},deposit_paid_at=${depositPaidAt},updated_at=now()
    WHERE id=${d.id} RETURNING *`;

   if(user.role==="admin"&&requestedStatus==="DEPOSIT PAID"&&current.status!=="DEPOSIT PAID"){
    const snapshot=await createCommissions(q,rows[0],commissionCents);
    if(commissionCents==null&&snapshot!=null){
     const upd=await q`UPDATE leads SET commission_cents=${snapshot} WHERE id=${d.id} RETURNING *`;
     rows=upd;
    }
    await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id,details)
      VALUES(${user.id},'DEPOSIT_CONFIRMED','lead',${d.id},${JSON.stringify({invoiceRequired:true})}::jsonb)`;
   }

   if(user.role==="admin"&&requestedStatus==="LOST"&&["DEPOSIT PAID","IN DEVELOPMENT","WON"].includes(current.status)){
    await q`UPDATE commission_ledger SET status='VOID' WHERE lead_id=${d.id} AND status='PENDING'`;
    const paid=(await q`SELECT COUNT(*)::int AS n FROM commission_ledger WHERE lead_id=${d.id} AND status='PAID'`)[0]?.n||0;
    if(paid>0){
     await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id,details)
       VALUES(${user.id},'REFUND_PAYOUT_ADJUSTMENT_REQUIRED','lead',${d.id},${JSON.stringify({paidCommissionEntries:paid})}::jsonb)`;
    }
   }

   await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id,details)
    VALUES(${user.id},'LEAD_UPDATED','lead',${d.id},${JSON.stringify({from:current.status,to:rows[0].status})}::jsonb)`;
   return json(res,200,{lead:await out(q,rows[0])});
  }

  if(req.method==="DELETE"){
   const id=req.query?.id;if(!id)return json(res,400,{error:"Missing lead id"});
   const current=(await q`SELECT * FROM leads WHERE id=${id} LIMIT 1`)[0];
   if(!current)return json(res,404,{error:"Lead not found"});
   if(user.role!=="admin"&&current.owner_id!==user.id)return json(res,403,{error:"Forbidden"});
   if(user.role!=="admin"&&lockedForSeller.includes(current.status))return json(res,403,{error:"Nodotu/apmaksātu klientu drīkst dzēst tikai admins"});
   await q`DELETE FROM leads WHERE id=${id}`;
   return json(res,200,{ok:true});
  }

  json(res,405,{error:"Method not allowed"});
 }catch(e){
  console.error(e);
  if(e?.code==="23505")return json(res,409,{error:"Šis uzņēmums jau eksistē sistēmā"});
  json(res,500,{error:"Lead operation failed"})
 }
}
