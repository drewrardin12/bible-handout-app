export function dateKey(value){
 if(!value)return '';
 if(/^\d{2}-\d{2}-\d{4}$/.test(value)){const [m,d,y]=value.split('-');return dateKey(`${y}-${m}-${d}`);}
 if(/^\d{4}-\d{2}-\d{2}T/.test(value))return dateKey(value.slice(0,10));
 if(/^\d{4}-\d{2}-\d{2}$/.test(value)){
  const [y,m,d]=value.split('-').map(Number),date=new Date(Date.UTC(y,m-1,d));
  return date.getUTCFullYear()===y&&date.getUTCMonth()===m-1&&date.getUTCDate()===d?value:'';
 }
 if(!/^[A-Za-z]{3,9} \d{1,2}, \d{4}$/.test(value))return '';
 const date=new Date(value);
 return Number.isNaN(date.getTime())?'':`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function matchOutings(card,outings){const date=dateKey(card.metDate);return date?outings.filter(o=>!o.deletedAt&&dateKey(o.date)===date):[];}
