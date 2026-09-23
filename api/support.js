import { requireUser } from "./_lib/auth.js";
import { body,json } from "./_lib/http.js";
import { sql } from "./_lib/db.js";

async function load(q,user){
 let tickets;
 if(user.role==="admin")tickets=await q`SELECT * FROM support_tickets ORDER BY updated_at DESC`;
 else tickets=await q`SELECT * FROM support_tickets WHERE user_id=${user.id} ORDER BY updated_at DESC`;
 const ids=tickets.map(t=>t.id);
 let replies=[];
 if(ids.length)replies=await q`SELECT * FROM support_replies WHERE ticket_id=ANY(${ids}::uuid[]) ORDER BY created_at`;
 return tickets.map(t=>({id:t.id,userId:t.user_id,subject:t.subject,body:t.body,status:t.status,createdAt:t.created_at,replies:replies.filter(r=>r.ticket_id===t.id).map(r=>({id:r.id,from:r.sender_id,body:r.body,at:r.created_at}))}));
}

export default async function handler(req,res){
 try{
  const user=await requireUser(req,res);if(!user)return;
  const q=sql();
  if(req.method==="GET")return json(res,200,{tickets:await load(q,user)});
  const d=await body(req);
  if(req.method==="POST"){
    if(d.action==="reply"){
      const ticket=(await q`SELECT * FROM support_tickets WHERE id=${d.id} LIMIT 1`)[0];
      if(!ticket)return json(res,404,{error:"Ticket not found"});
      if(user.role!=="admin"&&ticket.user_id!==user.id)return json(res,403,{error:"Forbidden"});
      await q`INSERT INTO support_replies(ticket_id,sender_id,body) VALUES(${d.id},${user.id},${d.body.trim()})`;
      await q`UPDATE support_tickets SET updated_at=now() WHERE id=${d.id}`;
    }else if(d.action==="toggle"){
      if(user.role!=="admin")return json(res,403,{error:"Forbidden"});
      await q`UPDATE support_tickets SET status=CASE WHEN status='OPEN' THEN 'CLOSED' ELSE 'OPEN' END,updated_at=now() WHERE id=${d.id}`;
    }else{
      if(user.role==="admin")return json(res,400,{error:"Adminam nav jāveido support ticket"});
      if(!d.subject?.trim()||!d.body?.trim())return json(res,400,{error:"Nepilnīgs support pieprasījums"});
      await q`INSERT INTO support_tickets(user_id,subject,body) VALUES(${user.id},${d.subject.trim()},${d.body.trim()})`;
    }
    return json(res,200,{tickets:await load(q,user)});
  }
  json(res,405,{error:"Method not allowed"});
 }catch(e){console.error(e);json(res,500,{error:"Support operation failed"})}
}
