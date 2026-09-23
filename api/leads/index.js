import { requireUser } from "../_lib/auth.js";
import { body,json } from "../_lib/http.js";
import { sql } from "../_lib/db.js";

const allowed=["NEW","MOCKUP READY","CONTACTED","REPLIED","INTERESTED","READY FOR TOM","MEETING","INVOICE SENT","DEPOSIT PAID","IN DEVELOPMENT","WON","LOST"];
const sellerStatuses=["NEW","MOCKUP READY","CONTACTED","REPLIED","INTERESTED","READY FOR TOM","LOST"];
const lockedForSeller=["READY FOR TOM","MEETING","INVOICE SENT","DEPOSIT PAID","IN DEVELOPMENT","WON"];

async function canOwn(q,user,ownerId){
 if(user.role==="admin")return true;
 if(ownerId===user.id)return true;
 if(user.role==="team_lead"){
  const rows=await q`SELECT 1 FROM users WHERE id=${ownerId} AND parent_user_id=${user.id} LIMIT 1`;
  return !!rows[0];
 }
 return false;
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

function out(l){
 return{
  id:l.id,company:l.company,industry:l.industry||"",city:l.city||"",website:l.website||"",email:l.email||"",phone:l.phone||"",
  score:l.score,status:l.status,value:Number(l.value_cents||0)/100,notes:l.notes||"",
  handoffSummary:l.handoff_summary||"",promises:l.promises||"",
  handoffRequestedAt:l.handoff_requested_at||null,invoiceSentAt:l.invoice_sent_at||null,depositPaidAt:l.deposit_paid_at||null,
  lastContact:l.last_contact||"",nextFollowUp:l.next_follow_up||"",ownerId:l.owner_id,
  commission:l.commission_cents==null?null:Number(l.commission_cents)/100,commissionPaid:l.commission_paid,
  mockupImage:l.mockup_url||"",contactLog:[],adminComments:[],inactiveDays:inactiveDays(l)
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

export default async function handler(req,res){
 try{
  const user=await requireUser(req,res);if(!user)return;
  const q=sql();

  if(req.method==="POST"){
   const d=await body(req),ownerId=user.role==="admin"?(d.ownerId||user.id):user.id;
   if(!(await canOwn(q,user,ownerId)))return json(res,403,{error:"Invalid owner"});
   if(!d.company?.trim())return json(res,400,{error:"Uzņēmuma nosaukums ir obligāts"});
   const dup=await duplicateLead(q,d);
   if(dup)return json(res,409,{error:"Šis uzņēmums jau eksistē sistēmā: "+dup.company});
   const requestedStatus=allowed.includes(d.status)?d.status:"NEW";
   if(user.role!=="admin"&&!sellerStatuses.includes(requestedStatus))return json(res,403,{error:"Šo statusu drīkst iestatīt tikai admins"});
   const rows=await q`INSERT INTO leads(owner_id,company,industry,city,website,email,phone,score,status,value_cents,notes,handoff_summary,promises,last_contact,next_follow_up)
    VALUES(${ownerId},${d.company.trim()},${d.industry||null},${d.city||null},${d.website||null},${d.email||null},${d.phone||null},${Number(d.score||50)},${requestedStatus},${Math.round(Number(d.value||399)*100)},${d.notes||null},${d.handoffSummary||null},${d.promises||null},${d.lastContact||null},${d.nextFollowUp||null}) RETURNING *`;
   await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id) VALUES(${user.id},'LEAD_CREATED','lead',${rows[0].id})`;
   return json(res,201,{lead:out(rows[0])});
  }

  if(req.method==="PUT"){
   const d=await body(req);if(!d.id)return json(res,400,{error:"Missing lead id"});
   const current=(await q`SELECT * FROM leads WHERE id=${d.id} LIMIT 1`)[0];
   if(!current)return json(res,404,{error:"Lead not found"});

   if(d.action==="CLAIM_INACTIVE"){
    if(!["admin","team_lead"].includes(user.role))return json(res,403,{error:"Forbidden"});
    if(lockedForSeller.includes(current.status)||current.status==="LOST")return json(res,400,{error:"Šo klientu vairs nevar pārņemt inactivity noteikuma ietvaros"});
    if(inactiveDays(current)<14)return json(res,400,{error:"Klients vēl nav neaktīvs 14 dienas"});
    let ownerId=user.id;
    if(user.role==="team_lead"){
     const child=(await q`SELECT 1 FROM users WHERE id=${current.owner_id} AND parent_user_id=${user.id} LIMIT 1`)[0];
     if(!child)return json(res,403,{error:"Vari pārņemt tikai sava tiešā apakšpartnera neaktīvu klientu"});
    }else if(d.ownerId){
     const target=(await q`SELECT id FROM users WHERE id=${d.ownerId} AND active=true AND role<>'admin' LIMIT 1`)[0];
     if(!target)return json(res,400,{error:"Nederīgs jaunais atbildīgais"});
     ownerId=target.id;
    }
    const rows=await q`UPDATE leads SET owner_id=${ownerId},updated_at=now() WHERE id=${d.id} RETURNING *`;
    await q`INSERT INTO audit_log(actor_id,action,entity_type,entity_id,details)
      VALUES(${user.id},'LEAD_RECLAIMED','lead',${d.id},${JSON.stringify({previousOwner:current.owner_id,newOwner:ownerId})}::jsonb)`;
    return json(res,200,{lead:out(rows[0])});
   }

   if(!(await canOwn(q,user,current.owner_id)))return json(res,403,{error:"Forbidden"});
   if(user.role!=="admin"&&lockedForSeller.includes(current.status)){
    return json(res,403,{error:"Klients jau ir nodots Tomam. No šī brīža ieraksts partnerim ir tikai apskatei."});
   }

   const requestedStatus=allowed.includes(d.status)?d.status:current.status;
   if(user.role!=="admin"&&!sellerStatuses.includes(requestedStatus)){
    return json(res,403,{error:"Šo statusu drīkst iestatīt tikai admins"});
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

   const rows=await q`UPDATE leads SET
    company=${d.company||current.company},industry=${d.industry||null},city=${d.city||null},website=${d.website||null},email=${d.email||null},phone=${d.phone||null},
    score=${Number(d.score??current.score)},status=${requestedStatus},value_cents=${Math.round(Number(d.value??current.value_cents/100)*100)},
    notes=${d.notes||null},handoff_summary=${d.handoffSummary||null},promises=${d.promises||null},
    last_contact=${d.lastContact||null},next_follow_up=${d.nextFollowUp||null},owner_id=${ownerId},
    commission_cents=${commissionCents},commission_paid=${d.commissionPaid??current.commission_paid},
    handoff_requested_at=${handoffRequestedAt},invoice_sent_at=${invoiceSentAt},deposit_paid_at=${depositPaidAt},updated_at=now()
    WHERE id=${d.id} RETURNING *`;

   if(user.role==="admin"&&requestedStatus==="DEPOSIT PAID"&&current.status!=="DEPOSIT PAID"){
    const snapshot=await createCommissions(q,rows[0],commissionCents);
    if(commissionCents==null&&snapshot!=null){
     const upd=await q`UPDATE leads SET commission_cents=${snapshot} WHERE id=${d.id} RETURNING *`;
     rows[0]=upd[0];
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
   return json(res,200,{lead:out(rows[0])});
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
