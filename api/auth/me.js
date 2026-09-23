import { requireUser,publicUser } from "../_lib/auth.js";
import { json,method } from "../_lib/http.js";
export default async function handler(req,res){
 if(!method(req,res,["GET"]))return;
 try{const user=await requireUser(req,res);if(!user)return;json(res,200,{user:publicUser(user)})}catch(e){console.error(e);json(res,500,{error:"Session check failed"})}
}
