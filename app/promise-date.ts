export function nextSunday(today:string){
 const date=new Date(`${today}T12:00:00`);date.setDate(date.getDate()+(7-date.getDay())%7);
 return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function isSunday(value:string){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const date=new Date(`${value}T12:00:00`);
 return !Number.isNaN(date.getTime())&&date.getDay()===0&&`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`===value;
}
