async function request(path,options={}){
 const res=await fetch(path,{credentials:"include",headers:{"Content-Type":"application/json",...(options.headers||{})},...options});
 const data=await res.json().catch(()=>({}));
 if(!res.ok)throw new Error(data.error||"Request failed");
 return data;
}
export const api={
 setupStatus:()=>request("/api/setup"),
 createFirstAdmin:data=>request("/api/setup",{method:"POST",body:JSON.stringify(data)}),
 me:()=>request("/api/auth/me"),
 login:(email,password)=>request("/api/auth/login",{method:"POST",body:JSON.stringify({email,password})}),
 logout:()=>request("/api/auth/logout",{method:"POST"}),
 bootstrap:()=>request("/api/bootstrap"),
 users:()=>request("/api/users"),
 createUser:data=>request("/api/users",{method:"POST",body:JSON.stringify(data)}),
 updateUser:data=>request("/api/users",{method:"PUT",body:JSON.stringify(data)}),
 acceptAgreement:version=>request("/api/agreement",{method:"POST",body:JSON.stringify({version})}),
 messages:()=>request("/api/messages"),
 sendMessage:data=>request("/api/messages",{method:"POST",body:JSON.stringify(data)}),
 support:()=>request("/api/support"),
 supportAction:data=>request("/api/support",{method:"POST",body:JSON.stringify(data)}),
 lookupLeads:query=>request("/api/leads?lookup="+encodeURIComponent(query)),
 createLead:data=>request("/api/leads",{method:"POST",body:JSON.stringify(data)}),
 updateLead:data=>request("/api/leads",{method:"PUT",body:JSON.stringify(data)}),
 deleteLead:id=>request("/api/leads?id="+encodeURIComponent(id),{method:"DELETE"})
};
