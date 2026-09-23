export function json(res,status,data){
  res.statusCode=status;
  res.setHeader("Content-Type","application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}
export async function body(req){
  if(req.body && typeof req.body==="object") return req.body;
  let raw="";
  for await (const chunk of req) raw+=chunk;
  if(!raw) return {};
  try{return JSON.parse(raw)}catch{return {}}
}
export function method(req,res,allowed){
  if(!allowed.includes(req.method)){
    res.setHeader("Allow",allowed.join(", "));
    json(res,405,{error:"Method not allowed"});
    return false;
  }
  return true;
}
