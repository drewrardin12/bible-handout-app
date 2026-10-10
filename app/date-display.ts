import {dateKey} from '../functions/outing-entry.mjs';
export function displayDate(value?:string|null){
 if(!value)return '';
 let key=dateKey(value);
 if(/^\d{4}-\d{2}-\d{2}T/.test(value)){const date=new Date(value);if(!Number.isNaN(date.getTime()))key=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
 if(!key)return value;
 const [year,month,day]=key.split('-');
 return `${month}-${day}-${year}`;
}
export function displayHistory(value:string){
 return value.replace(/\b\d{4}-\d{2}-\d{2}\b/g,date=>displayDate(date)).replace(/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) \d{1,2}, \d{4}\b/g,date=>displayDate(date));
}
