import { clearSession } from "../_lib/auth.js";
import { json,method } from "../_lib/http.js";
export default async function handler(req,res){
 if(!method(req,res,["POST"]))return;
 try{await clearSession(req,res);json(res,200,{ok:true})}catch(e){console.error(e);json(res,500,{error:"Logout failed"})}
}
