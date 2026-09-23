import { requireUser } from "./_lib/auth.js";
import { body,json } from "./_lib/http.js";
import { sql } from "./_lib/db.js";

export default async function handler(req,res){
 try{
  const user=await requireUser(req,res);if(!user)return;
  const q=sql();
  if(req.method==="GET"){
    let rows;
    if(user.role==="admin") rows=await q`SELECT * FROM messages ORDER BY created_at DESC LIMIT 500`;
    else rows=await q`SELECT * FROM messages WHERE sender_id=${user.id} OR recipient_id=${user.id} ORDER BY created_at DESC LIMIT 500`;
    return json(res,200,{messages:rows.map(m=>({id:m.id,from:m.sender_id,to:m.recipient_id,body:m.body,at:m.created_at,read:!!m.read_at}))});
  }
  if(req.method==="POST"){
    const d=await body(req);if(!d.to||!d.body?.trim())return json(res,400,{error:"Nepilnīga ziņa"});
    if(user.role!=="admin"&&d.to!==String((await q`SELECT id FROM users WHERE role='admin' LIMIT 1`)[0]?.id))return json(res,403,{error:"Darbinieks var rakstīt tikai adminam"});
    const rows=await q`INSERT INTO messages(sender_id,recipient_id,body) VALUES(${user.id},${d.to},${d.body.trim()}) RETURNING *`;
    return json(res,201,{message:{id:rows[0].id,from:rows[0].sender_id,to:rows[0].recipient_id,body:rows[0].body,at:rows[0].created_at,read:false}});
  }
  json(res,405,{error:"Method not allowed"});
 }catch(e){console.error(e);json(res,500,{error:"Message operation failed"})}
}
