export type ContactDates = {date:string;createdAt?:string;metDate?:string;followUpDate?:string;promiseDate?:string;attendanceChecked?:boolean;archived?:boolean;status:string};
export function localDate(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
export function dateValue(value: string | undefined): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.getTime()) || localDate(parsed)!==value ? null : value;
}
export function contactDate(p: ContactDates): string | null {
  return dateValue(p.metDate) || dateValue(p.date) || dateValue(p.createdAt?.slice(0,10));
}
export function dashboardGroups<T extends ContactDates>(records:T[], today=localDate()) {
  const active=records.filter(p=>!p.archived && !/^(archived|inactive|do not contact)$/i.test(p.status));
  const cutoff=new Date(`${today}T12:00:00`);cutoff.setDate(cutoff.getDate()-6);
  const first=active.filter(p=>{const date=contactDate(p);return !!date && date>=localDate(cutoff) && date<=today;});
  const promised=active.filter(p=>!!dateValue(p.promiseDate) && !p.attendanceChecked);
  const overdue=active.filter(p=>{const date=dateValue(p.followUpDate);return !!date && date<today;});
  const all=active.filter(p=>first.includes(p)||overdue.includes(p)||p.followUpDate===today||(promised.includes(p)&&p.promiseDate!<today));
  all.sort((a,b)=>(contactDate(b)||'').localeCompare(contactDate(a)||''));
  return {all,first,promised,overdue};
}
