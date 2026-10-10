export const periods=['Current Month','Last Quarter','YTD','All Time'] as const;
export type Period=typeof periods[number];
export function inPeriod(value:string|undefined,period:Period,now=new Date()){
 if(period==='All Time')return true;
 if(!value)return false;
 const date=new Date(/^\d{4}-\d{2}-\d{2}$/.test(value)?value+'T12:00:00':value);
 if(Number.isNaN(date.getTime()))return false;
 const year=now.getFullYear(),month=now.getMonth();
 const start=period==='Last Quarter'?new Date(year,Math.floor(month/3)*3-3,1):new Date(year,period==='YTD'?0:month,1);
 const end=period==='Last Quarter'?new Date(year,Math.floor(month/3)*3,1):new Date(year,month,now.getDate()+1);
 return date>=start&&date<end;
}
