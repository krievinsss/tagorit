import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

const email=process.env.ADMIN_EMAIL;
const password=process.env.ADMIN_PASSWORD;
const name=process.env.ADMIN_NAME||"Toms";
if(!process.env.DATABASE_URL||!email||!password){
  console.error("Missing DATABASE_URL, ADMIN_EMAIL or ADMIN_PASSWORD");
  process.exit(1);
}
if(password.length<10){
  console.error("ADMIN_PASSWORD must be at least 10 characters");
  process.exit(1);
}
const sql=neon(process.env.DATABASE_URL);
const hash=await bcrypt.hash(password,12);
const rows=await sql`INSERT INTO users(email,password_hash,name,role,parent_user_id,payout_cents,override_cents,active,paper_signed)
VALUES(${email.toLowerCase().trim()},${hash},${name},'admin',NULL,0,0,true,true)
ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash,name=EXCLUDED.name,role='admin',active=true
RETURNING id,email,name,role`;
console.log("Admin ready:",rows[0]);
