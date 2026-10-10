import {contactDate,dashboardGroups,type ContactDates} from './dashboard-data';
type Contact=ContactDates & {name:string;phone:string;address:string;rating:number};
export function filterContacts<T extends Contact>(records:T[], options:{query:string;filter:string;stars:string;sort:string;today:string}):T[]{
 const q=options.query.trim().toLowerCase();
 const recent=new Set(dashboardGroups(records,options.today).first);
 return records.filter(p=> (!q||[p.name,p.phone,p.address].some(v=>v.toLowerCase().includes(q)))
  && (options.stars==='all'||p.rating===Number(options.stars))
  && (options.filter==='All'||(options.filter==='Attended'&&(p.attendanceChecked||/^attended$/i.test(p.status)))||(options.filter==='New'&&recent.has(p))||(options.filter==='Needs Follow-Up'&&!!p.followUpDate&&p.followUpDate<=options.today&&!p.archived))
 ).sort((a,b)=>options.sort==='name'?a.name.localeCompare(b.name):options.sort==='rating'?b.rating-a.rating||a.name.localeCompare(b.name):options.sort==='follow'?(a.followUpDate||'9999').localeCompare(b.followUpDate||'9999'):(b.createdAt||contactDate(b)||'').localeCompare(a.createdAt||contactDate(a)||''));
}
