export function dateKey(value){
 if(!value)return '';
 if(/^\d{4}-\d{2}-\d{2}$/.test(value)){
  const [y,m,d]=value.split('-').map(Number),date=new Date(Date.UTC(y,m-1,d));
  return date.getUTCFullYear()===y&&date.getUTCMonth()===m-1&&date.getUTCDate()===d?value:'';
 }
 const date=new Date(value);
 return Number.isNaN(date.getTime())?'':`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function matchOutings(card,outings){const date=dateKey(card.metDate);return date?outings.filter(o=>dateKey(o.date)===date):[];}
