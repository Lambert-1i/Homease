import { useMemo, useState } from "react";
import { Activity, Bell, Boxes, CheckCircle2, Clock3, CreditCard, LayoutDashboard, Menu, MoreHorizontal, Package, Search, Settings, ShieldCheck, Wallet, Wrench, X } from "lucide-react";

type Page = "Dashboard" | "Lockers" | "Orders" | "Rentals" | "Settings";
type LockerStatus = "Available" | "Rented" | "Reserved" | "Maintenance";
type Locker = { id:string; code:string; location:string; status:LockerStatus; price:number; HomeEase:boolean; door:boolean; seen:string };
type Order = { id:string; customer:string; locker:string; amount:number; payment:"Paid"|"Pending"|"Refunded"; date:string };
type Rental = { id:string; customer:string; locker:string; status:"Active"|"Waiting for return"|"Completed"; started:string; due:string };
const initialLockers:Locker[] = [
 {id:"1",code:"VAC-001",location:"Main Entrance · A01",status:"Available",price:1000,HomeEase:true,door:true,seen:"Just now"},
 {id:"2",code:"VAC-002",location:"Main Entrance · A02",status:"Rented",price:1000,HomeEase:false,door:true,seen:"1 min ago"},
 {id:"3",code:"VAC-003",location:"North Hall · B01",status:"Available",price:1200,HomeEase:true,door:true,seen:"2 min ago"},
 {id:"4",code:"VAC-004",location:"North Hall · B02",status:"Reserved",price:1000,HomeEase:true,door:true,seen:"Just now"},
 {id:"5",code:"VAC-005",location:"Parking Level · C01",status:"Maintenance",price:1000,HomeEase:false,door:false,seen:"18 min ago"},
 {id:"6",code:"VAC-006",location:"Parking Level · C02",status:"Available",price:1000,HomeEase:true,door:true,seen:"3 min ago"}
];
const orders:Order[] = [
 {id:"ORD-20261104-001",customer:"wx_user_82••",locker:"VAC-002",amount:1000,payment:"Paid",date:"2026-11-04 10:42"},
 {id:"ORD-20261104-002",customer:"wx_user_19••",locker:"VAC-004",amount:1000,payment:"Pending",date:"2026-11-04 10:35"},
 {id:"ORD-20261104-003",customer:"wx_user_43••",locker:"VAC-001",amount:1000,payment:"Paid",date:"2026-11-04 09:58"},
 {id:"ORD-20261104-004",customer:"wx_user_06••",locker:"VAC-003",amount:1200,payment:"Refunded",date:"2026-11-04 09:20"},
 {id:"ORD-20261103-018",customer:"wx_user_51••",locker:"VAC-006",amount:1000,payment:"Paid",date:"2026-11-03 21:14"}
];
const rentals:Rental[] = [
 {id:"RNT-00081",customer:"wx_user_82••",locker:"VAC-002",status:"Active",started:"2026-11-04 10:42",due:"2026-11-04 11:12"},
 {id:"RNT-00079",customer:"wx_user_66••",locker:"VAC-006",status:"Waiting for return",started:"2026-11-04 10:05",due:"2026-11-04 10:35"},
 {id:"RNT-00076",customer:"wx_user_12••",locker:"VAC-003",status:"Completed",started:"2026-11-04 08:40",due:"2026-11-04 09:10"}
];
const money=(fen:number)=>`¥${(fen/100).toFixed(2)}`;
const cls=(s:string)=>s.toLowerCase().replaceAll(" ","-");

function App(){
 const [page,setPage]=useState<Page>("Dashboard");
 const [lockers,setLockers]=useState(initialLockers);
 const [query,setQuery]=useState("");
 const [mobile,setMobile]=useState(false);
 const [price,setPrice]=useState("10.00");
 const [duration,setDuration]=useState("30");
 const [toast,setToast]=useState("");
 const ping=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(""),2600)};
 const available=lockers.filter(x=>x.status==="Available").length;
 const rented=lockers.filter(x=>x.status==="Rented").length;
 const attention=lockers.filter(x=>x.status==="Maintenance"||!x.door).length;
 const paid=orders.filter(x=>x.payment==="Paid").reduce((n,x)=>n+x.amount,0);
 const nav:[Page,typeof LayoutDashboard][]=[["Dashboard",LayoutDashboard],["Lockers",Boxes],["Orders",CreditCard],["Rentals",Package],["Settings",Settings]];
 const filteredLockers=useMemo(()=>lockers.filter(x=>`${x.code} ${x.location} ${x.status}`.toLowerCase().includes(query.toLowerCase())),[lockers,query]);
 const filteredOrders=useMemo(()=>orders.filter(x=>`${x.id} ${x.customer} ${x.locker} ${x.payment}`.toLowerCase().includes(query.toLowerCase())),[query]);
 const go=(p:Page)=>{setPage(p);setQuery("");setMobile(false)};
 return <div className="shell">
  <aside className={`sidebar ${mobile?"open":""}`}>
   <div className="brand"><div className="brand-icon"><Package/></div><div><b>HomeEase<span>Hub</span></b><small>RENTAL MANAGEMENT</small></div><button className="icon close" onClick={()=>setMobile(false)}><X/></button></div>
   <div className="nav-label">WORKSPACE</div><nav>{nav.map(([name,Icon])=><button key={name} className={`nav-item ${page===name?"selected":""}`} onClick={()=>go(name)}><Icon size={18}/>{name}{name==="Lockers"&&attention>0&&<i>{attention}</i>}</button>)}</nav>
   <div className="side-bottom"><div className="help"><b>Need a hand?</b><p>Project setup guide and support.</p><button onClick={()=>ping("Setup guide will be added in a future version.")}>View guide ↗</button></div><div className="admin"><div className="avatar">AD</div><div><b>Project Admin</b><small>Administrator</small></div><MoreHorizontal/></div></div>
  </aside>
  <main><header className="topbar"><button className="icon mobile-menu" onClick={()=>setMobile(true)}><Menu/></button><div className="crumb">Workspace <span>/</span> <b>{page}</b></div><div className="top-right"><span className="demo-dot">● &nbsp;Demo environment</span><button className="icon" onClick={()=>ping("You're all caught up.")}><Bell/></button><div className="avatar dark">AD</div></div></header>
   <div className="content">
    {page==="Dashboard"&&<><Heading eyebrow="OVERVIEW" title="Good morning, Admin" subtitle="Here's what's happening with your HomeEase rental system today." action={<button className="btn secondary" onClick={()=>go("Lockers")}><Boxes size={16}/> Manage lockers</button>}/>
     <div className="banner"><Activity/><div><b>You're viewing sample data</b><p>This is a frontend prototype. No live devices or payments are connected.</p></div><strong>DEMO</strong></div>
     <div className="stats">
      <Stat label="Total lockers" value={String(lockers.length).padStart(2,"0")} detail="Across all locations" icon={<Boxes/>} tone="blue"/>
      <Stat label="Available now" value={String(available).padStart(2,"0")} detail="Ready for rental" icon={<CheckCircle2/>} tone="green"/>
      <Stat label="Currently rented" value={String(rented).padStart(2,"0")} detail="Active rentals" icon={<Package/>} tone="purple"/>
      <Stat label="Paid orders (demo)" value={money(paid)} detail="From sample order list" icon={<Wallet/>} tone="orange"/>
     </div>
     <div className="columns"><section className="panel"><PanelTitle title="Locker status" sub="Current overview across all lockers" action={<button className="link" onClick={()=>go("Lockers")}>View all →</button>}/>
      <div className="status-counts"><div>🟢 <b>{available}</b><small>Available</small></div><div>🟣 <b>{rented}</b><small>Rented</small></div><div>🟠 <b>{lockers.filter(x=>x.status==="Reserved").length}</b><small>Reserved</small></div><div>🔴 <b>{attention}</b><small>Attention</small></div></div>
      <div className="locker-grid">{lockers.map(l=><div className="locker-chip" key={l.id}><div className={`unit-icon ${cls(l.status)}`}><Package/></div><div className="unit-copy"><b>{l.code}</b><small>{l.location}</small></div><Pill value={l.status}/></div>)}</div>
     </section><section className="panel"><PanelTitle title="Rental activity" sub="Latest rental updates"/><div className="timeline">{rentals.map((r,i)=><div className="timeline-row" key={r.id}><div className="timeline-icon"><Package/></div><div><b>{r.locker} <span>· {r.status}</span></b><small>{r.customer} · {r.started.slice(11)}</small></div><small>{i===0?"Now":i===1?"35m":"2h"}</small></div>)}</div><button className="btn light full" onClick={()=>go("Rentals")}>View all rentals</button></section></div>
     <section className="panel orders-panel"><PanelTitle title="Recent orders" sub="Most recent customer transactions" action={<button className="link" onClick={()=>go("Orders")}>All orders →</button>}/><OrderTable rows={orders.slice(0,4)}/></section>
     {attention>0&&<div className="warning"><Wrench/><div><b>{attention} locker(s) need attention</b><small>Review maintenance status and door sensor readings.</small></div><button onClick={()=>go("Lockers")}>Review lockers →</button></div>}
    </>}
    {page==="Lockers"&&<><Heading eyebrow="INVENTORY" title="Lockers" subtitle="Monitor and manage your HomeEase locker units." action={<button className="btn primary" onClick={()=>ping("Adding lockers will be connected to the backend in a later milestone.")}>+ Add locker</button>}/><Toolbar query={query} setQuery={setQuery} placeholder="Search locker ID, location or status" count={`${filteredLockers.length} lockers shown`}/><section className="panel table-panel"><div className="table-scroll"><table><thead><tr><th>LOCKER</th><th>LOCATION</th><th>STATUS</th><th>HomeEase</th><th>DOOR</th><th>LAST SIGNAL</th><th>ACTION</th></tr></thead><tbody>{filteredLockers.map(l=><tr key={l.id}><td><b>{l.code}</b><small>Device ID: DEV-{l.code.slice(-3)}</small></td><td>{l.location}</td><td><Pill value={l.status}/></td><td><span className={l.HomeEase?"sensor":"sensor off"}>● {l.HomeEase?"Detected":"Not detected"}</span></td><td><span className={l.door?"sensor":"sensor warn"}>● {l.door?"Closed":"Open"}</span></td><td>{l.seen}</td><td><select value={l.status} onChange={e=>{setLockers(old=>old.map(x=>x.id===l.id?{...x,status:e.target.value as LockerStatus}:x));ping(`${l.code} demo status updated.`)}}><option>Available</option><option>Rented</option><option>Reserved</option><option>Maintenance</option></select></td></tr>)}</tbody></table>{filteredLockers.length===0&&<div className="empty">No lockers match your search.</div>}</div></section><p className="footnote"><ShieldCheck/> Demo status only. In production, live device state must come from authenticated backend events.</p></>}
    {page==="Orders"&&<><Heading eyebrow="TRANSACTIONS" title="Orders" subtitle="Review customer orders and payment records."/><Toolbar query={query} setQuery={setQuery} placeholder="Search order, customer or locker" count={`${filteredOrders.length} orders shown`}/><section className="panel table-panel"><OrderTable rows={filteredOrders}/></section><p className="footnote"><ShieldCheck/> Payment status must be verified by the backend through WeChat Pay notifications or order queries.</p></>}
    {page==="Rentals"&&<><Heading eyebrow="OPERATIONS" title="Rentals" subtitle="Track active rentals, return progress, and completed sessions."/><div className="stats three"><Stat label="Active" value="1" detail="Customer using HomeEase" icon={<Package/>} tone="purple"/><Stat label="Awaiting return" value="1" detail="Return not confirmed" icon={<Clock3/>} tone="orange"/><Stat label="Completed" value="1" detail="Sample completed rentals" icon={<CheckCircle2/>} tone="green"/></div><section className="panel table-panel"><PanelTitle title="Rental records" sub="Rental timeline and current status"/><div className="table-scroll"><table><thead><tr><th>RENTAL ID</th><th>CUSTOMER</th><th>LOCKER</th><th>STARTED</th><th>DUE TIME</th><th>STATUS</th></tr></thead><tbody>{rentals.map(r=><tr key={r.id}><td><b>{r.id}</b></td><td>{r.customer}</td><td>{r.locker}</td><td>{r.started}</td><td>{r.due}</td><td><Pill value={r.status}/></td></tr>)}</tbody></table></div></section><p className="footnote"><Clock3/> The backend should calculate due times and confirm returns from authenticated sensor events.</p></>}
    {page==="Settings"&&<><Heading eyebrow="CONFIGURATION" title="Settings" subtitle="Configure default rental pricing for the demo dashboard."/><div className="settings-grid"><section className="panel settings-panel"><PanelTitle title="Rental pricing" sub="Default price shown to customers before checkout."/><label>Rental price (CNY)</label><div className="field"><span>¥</span><input value={price} onChange={e=>setPrice(e.target.value)}/></div><label>Rental duration</label><div className="field"><input type="number" min="1" value={duration} onChange={e=>setDuration(e.target.value)}/><span>minutes</span></div><div className="preview"><span>Customer price preview</span><b>¥{Number(price||0).toFixed(2)} <small>/ {duration||"0"} min</small></b></div><button className="btn primary full" onClick={()=>ping("Demo settings saved in page state only.")}>Save changes</button><p className="muted-note">Demo only: this does not update the database or customer checkout. Production pricing must be saved and validated by the backend.</p></section><section className="panel integrations"><div className="integration-mark"><ShieldCheck/></div><h3>Security & integrations</h3><p>These connections will be configured in later development milestones.</p>{["Backend API","WeChat Pay","Locker devices (MQTT)","Admin authentication"].map(x=><div className="integration-row" key={x}>{x}<Pill value="Not connected"/></div>)}</section></div></>}
    <footer>© 2026 Homease <span>·</span> Admin dashboard starter <span className="footer-right"><ShieldCheck/> Demo data only</span></footer>
   </div>
  </main>
  {mobile&&<button className="scrim" onClick={()=>setMobile(false)} aria-label="Close menu"/>}
  {toast&&<div className="toast"><CheckCircle2/>{toast}</div>}
 </div>;
}
function Heading({eyebrow,title,subtitle,action}:{eyebrow:string;title:string;subtitle:string;action?:React.ReactNode}){return <div className="heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>}
function Stat({label,value,detail,icon,tone}:{label:string;value:string;detail:string;icon:React.ReactNode;tone:string}){return <div className="stat"><div className="stat-head">{label}<span className={`stat-icon ${tone}`}>{icon}</span></div><strong>{value}</strong><small>{detail}</small></div>}
function PanelTitle({title,sub,action}:{title:string;sub:string;action?:React.ReactNode}){return <div className="panel-title"><div><h2>{title}</h2><p>{sub}</p></div>{action}</div>}
function Pill({value}:{value:string}){return <span className={`pill ${cls(value)}`}>{value}</span>}
function Toolbar({query,setQuery,placeholder,count}:{query:string;setQuery:(v:string)=>void;placeholder:string;count:string}){return <div className="toolbar"><div className="search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={placeholder}/>{query&&<button onClick={()=>setQuery("")}><X/></button>}</div><span>{count}</span></div>}
function OrderTable({rows}:{rows:Order[]}){return <div className="table-scroll"><table><thead><tr><th>ORDER ID</th><th>CUSTOMER</th><th>LOCKER</th><th>AMOUNT</th><th>PAYMENT</th><th>CREATED</th></tr></thead><tbody>{rows.map(o=><tr key={o.id}><td><b>{o.id}</b></td><td>{o.customer}</td><td>{o.locker}</td><td><b>{money(o.amount)}</b></td><td><Pill value={o.payment}/></td><td>{o.date}</td></tr>)}</tbody></table>{rows.length===0&&<div className="empty">No orders found.</div>}</div>}
export default App;