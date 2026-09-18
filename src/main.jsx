import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard, Building2, Plus, Search, ExternalLink, Mail, Phone,
  Pencil, Trash2, TrendingUp, Target, CheckCircle2, Euro, X, Download, Upload
} from "lucide-react";
import "./styles.css";

const statuses = ["NEW","CHECKED","GOOD LEAD","DEMO READY","CONTACTED","FOLLOW UP","INTERESTED","WON","LOST"];
const industries = ["Autoserviss","Būvniecība","Viesu nams","Skaistumkopšana","Zobārstniecība","Cits"];

const demo = [
  {id:"1",company:"Cēsis Auto Serviss",industry:"Autoserviss",city:"Cēsis",website:"https://example.com",email:"info@cesisauto.lv",phone:"+371 20000001",score:82,status:"DEMO READY",demo:"https://example.com",value:399,notes:"Novecojis dizains, slikts mobile UX, nav skaidras CTA.",lastContact:"2026-09-17",nextFollowUp:"2026-09-21"},
  {id:"2",company:"Vidzemes Motors",industry:"Autoserviss",city:"Valmiera",website:"",email:"serviss@vidzemesmotors.lv",phone:"+371 20000002",score:91,status:"GOOD LEAD",demo:"",value:399,notes:"Nav savas mājaslapas. Aktīvs Facebook profils.",lastContact:"",nextFollowUp:""},
  {id:"3",company:"AutoFix Riga",industry:"Autoserviss",city:"Rīga",website:"https://example.org",email:"info@autofix.lv",phone:"+371 20000003",score:64,status:"CONTACTED",demo:"https://example.org",value:499,notes:"Nosūtīts demo. Jāveic follow-up.",lastContact:"2026-09-18",nextFollowUp:"2026-09-22"}
];

const empty = {company:"",industry:"Autoserviss",city:"",website:"",email:"",phone:"",score:50,status:"NEW",demo:"",value:399,notes:"",lastContact:"",nextFollowUp:""};

function App(){
  const [leads,setLeads]=useState(()=>{
    try{return JSON.parse(localStorage.getItem("tagorit_leads"))||demo}catch{return demo}
  });
  const [view,setView]=useState("dashboard");
  const [query,setQuery]=useState("");
  const [status,setStatus]=useState("ALL");
  const [modal,setModal]=useState(null);

  useEffect(()=>localStorage.setItem("tagorit_leads",JSON.stringify(leads)),[leads]);

  const filtered=useMemo(()=>leads.filter(l=>{
    const hay=(l.company+" "+l.city+" "+l.email+" "+l.industry).toLowerCase();
    return hay.includes(query.toLowerCase())&&(status==="ALL"||l.status===status);
  }),[leads,query,status]);

  const stats=useMemo(()=>({
    total:leads.length,
    hot:leads.filter(l=>l.score>=70&&!["WON","LOST"].includes(l.status)).length,
    contacted:leads.filter(l=>["CONTACTED","FOLLOW UP","INTERESTED","WON"].includes(l.status)).length,
    won:leads.filter(l=>l.status==="WON").length,
    revenue:leads.filter(l=>l.status==="WON").reduce((a,b)=>a+Number(b.value||0),0),
    pipeline:leads.filter(l=>!["WON","LOST"].includes(l.status)).reduce((a,b)=>a+Number(b.value||0),0)
  }),[leads]);

  function save(e){
    e.preventDefault();
    if(!modal.company.trim()) return;
    if(modal.id) setLeads(x=>x.map(l=>l.id===modal.id?modal:l));
    else setLeads(x=>[{...modal,id:crypto.randomUUID()},...x]);
    setModal(null);
  }

  function remove(id){
    if(confirm("Dzēst šo uzņēmumu?")) setLeads(x=>x.filter(l=>l.id!==id));
  }

  function exportData(){
    const blob=new Blob([JSON.stringify(leads,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download="tagorit-backup.json";a.click();URL.revokeObjectURL(url);
  }

  function importData(e){
    const file=e.target.files?.[0]; if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const data=JSON.parse(reader.result);
        if(!Array.isArray(data))throw new Error();
        setLeads(data);
      }catch{alert("Nederīgs backup fails.")}
    };
    reader.readAsText(file);
  }

  return <div className="shell">
    <aside>
      <div className="brand"><div className="mark">T</div><div><b>Tagorit</b><small>Lead CRM</small></div></div>
      <nav>
        <button className={view==="dashboard"?"active":""} onClick={()=>setView("dashboard")}><LayoutDashboard size={18}/>Dashboard</button>
        <button className={view==="leads"?"active":""} onClick={()=>setView("leads")}><Building2 size={18}/>Uzņēmumi <span>{leads.length}</span></button>
      </nav>
      <div className="goal"><Target size={18}/><div><b>Dienas mērķis</b><small>15 jauni kontakti</small></div></div>
    </aside>

    <main>
      <header>
        <div><h1>{view==="dashboard"?"Pārdošanas pārskats":"Uzņēmumi"}</h1><p>{view==="dashboard"?"Lead pipeline un rezultāti vienuviet.":"Pārvaldi visus potenciālos klientus."}</p></div>
        <div className="actions">
          <button className="square" onClick={exportData}><Download size={17}/></button>
          <label className="square"><Upload size={17}/><input hidden type="file" accept="application/json" onChange={importData}/></label>
          <button className="primary" onClick={()=>setModal({...empty})}><Plus size={17}/>Pievienot uzņēmumu</button>
        </div>
      </header>

      {view==="dashboard"?
        <Dashboard stats={stats} leads={leads} go={()=>setView("leads")} edit={setModal}/>:
        <Leads leads={filtered} query={query} setQuery={setQuery} status={status} setStatus={setStatus} edit={setModal} remove={remove} updateStatus={(id,s)=>setLeads(x=>x.map(l=>l.id===id?{...l,status:s}:l))}/>}
    </main>

    {modal&&<Modal lead={modal} setLead={setModal} close={()=>setModal(null)} save={save}/>}
  </div>
}

function Dashboard({stats,leads,go,edit}){
  const recent=leads.slice(0,5);
  return <div className="content">
    <div className="cards">
      <Card icon={Building2} label="Visi uzņēmumi" value={stats.total} note="Kopējais lead skaits"/>
      <Card icon={TrendingUp} label="Karstie leadi" value={stats.hot} note="Score 70+"/>
      <Card icon={Mail} label="Kontaktēti" value={stats.contacted} note="Aktīvā komunikācijā"/>
      <Card icon={CheckCircle2} label="Uzvarēti" value={stats.won} note={`€${stats.revenue} ieņēmumi`}/>
    </div>
    <div className="grid">
      <section className="panel">
        <div className="panelHead"><div><h2>Pipeline</h2><p>Potenciālā vērtība</p></div><strong>€{stats.pipeline}</strong></div>
        <div className="pipeline">
          {statuses.filter(s=>!["LOST"].includes(s)).map(s=>{
            const count=leads.filter(l=>l.status===s).length;
            const pct=leads.length?Math.round(count/leads.length*100):0;
            return <div className="bar" key={s}><span>{s}</span><div><i style={{width:`${pct}%`}}/></div><b>{count}</b></div>
          })}
        </div>
      </section>
      <section className="panel">
        <div className="panelHead"><div><h2>Jaunākie leadi</h2><p>Pēdējie pievienotie</p></div><button className="link" onClick={go}>Skatīt visus</button></div>
        {recent.map(l=><button className="recent" key={l.id} onClick={()=>edit({...l})}><span>{l.company.slice(0,2).toUpperCase()}</span><div><b>{l.company}</b><small>{l.city||"—"} · Score {l.score}</small></div></button>)}
      </section>
    </div>
  </div>
}

function Card({icon:Icon,label,value,note}){
  return <div className="card"><div className="cardIcon"><Icon size={19}/></div><div><small>{label}</small><b>{value}</b><span>{note}</span></div></div>
}

function Leads({leads,query,setQuery,status,setStatus,edit,remove,updateStatus}){
  return <div className="content">
    <div className="filters">
      <div className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Meklēt uzņēmumu, pilsētu, e-pastu..."/></div>
      <select value={status} onChange={e=>setStatus(e.target.value)}><option value="ALL">Visi statusi</option>{statuses.map(s=><option key={s}>{s}</option>)}</select>
      <span>{leads.length} rezultāti</span>
    </div>
    <div className="panel tableWrap">
      <table>
        <thead><tr><th>Uzņēmums</th><th>Score</th><th>Statuss</th><th>Kontakti</th><th>Demo</th><th>Vērtība</th><th></th></tr></thead>
        <tbody>{leads.map(l=><tr key={l.id}>
          <td><button className="company" onClick={()=>edit({...l})}><i>{l.company.slice(0,2).toUpperCase()}</i><div><b>{l.company}</b><small>{l.industry} · {l.city||"—"}</small></div></button></td>
          <td><div className={"score "+(l.score>=70?"hot":l.score>=40?"warm":"cold")}><b>{l.score}</b><span><i style={{width:`${l.score}%`}}/></span></div></td>
          <td><select className="status" value={l.status} onChange={e=>updateStatus(l.id,e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></td>
          <td><div className="contact">{l.email&&<a href={`mailto:${l.email}`}><Mail size={14}/></a>}{l.phone&&<a href={`tel:${l.phone}`}><Phone size={14}/></a>}{l.website&&<a href={l.website} target="_blank"><ExternalLink size={14}/></a>}</div></td>
          <td>{l.demo?<a className="demo" target="_blank" href={l.demo}>Atvērt <ExternalLink size={12}/></a>:<span className="muted">—</span>}</td>
          <td><b>€{l.value||0}</b></td>
          <td><div className="rowActions"><button onClick={()=>edit({...l})}><Pencil size={14}/></button><button className="danger" onClick={()=>remove(l.id)}><Trash2 size={14}/></button></div></td>
        </tr>)}</tbody>
      </table>
      {!leads.length&&<div className="empty">Nav atrasts neviens uzņēmums.</div>}
    </div>
  </div>
}

function Modal({lead,setLead,close,save}){
  const set=(k,v)=>setLead({...lead,[k]:v});
  return <div className="overlay">
    <form className="modal" onSubmit={save}>
      <div className="modalHead"><div><h2>{lead.id?"Rediģēt uzņēmumu":"Jauns uzņēmums"}</h2><p>Saglabā visu informāciju par potenciālo klientu.</p></div><button type="button" onClick={close}><X/></button></div>
      <div className="form">
        <Field label="Uzņēmuma nosaukums"><input required value={lead.company} onChange={e=>set("company",e.target.value)}/></Field>
        <Field label="Nozare"><select value={lead.industry} onChange={e=>set("industry",e.target.value)}>{industries.map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="Pilsēta"><input value={lead.city} onChange={e=>set("city",e.target.value)}/></Field>
        <Field label="Lead score"><input min="0" max="100" type="number" value={lead.score} onChange={e=>set("score",Number(e.target.value))}/></Field>
        <Field label="E-pasts"><input type="email" value={lead.email} onChange={e=>set("email",e.target.value)}/></Field>
        <Field label="Telefons"><input value={lead.phone} onChange={e=>set("phone",e.target.value)}/></Field>
        <Field label="Mājaslapa"><input placeholder="https://" value={lead.website} onChange={e=>set("website",e.target.value)}/></Field>
        <Field label="Demo saite"><input placeholder="https://" value={lead.demo} onChange={e=>set("demo",e.target.value)}/></Field>
        <Field label="Statuss"><select value={lead.status} onChange={e=>set("status",e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></Field>
        <Field label="Darījuma vērtība (€)"><input type="number" value={lead.value} onChange={e=>set("value",Number(e.target.value))}/></Field>
        <Field label="Pēdējais kontakts"><input type="date" value={lead.lastContact||""} onChange={e=>set("lastContact",e.target.value)}/></Field>
        <Field label="Nākamais follow-up"><input type="date" value={lead.nextFollowUp||""} onChange={e=>set("nextFollowUp",e.target.value)}/></Field>
        <div className="wide"><Field label="Piezīmes"><textarea rows="5" value={lead.notes} onChange={e=>set("notes",e.target.value)} placeholder="Kas lapā nav kārtībā? Ko klients atbildēja?"/></Field></div>
      </div>
      <div className="modalFoot"><button type="button" className="secondary" onClick={close}>Atcelt</button><button className="primary">Saglabāt</button></div>
    </form>
  </div>
}

function Field({label,children}){return <label className="field"><span>{label}</span>{children}</label>}

createRoot(document.getElementById("root")).render(<App/>);