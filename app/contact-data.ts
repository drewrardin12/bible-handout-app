export type ContactFields = {title:string;firstName:string;lastName:string;street:string;city:string;state:string};
export const titles=['Mr.','Mrs.','Ms.','Miss','Dr.','Rev.','Pastor'];
export function contactFields(p:{name:string;address:string;title?:string;firstName?:string;lastName?:string;street?:string;city?:string;state?:string}):ContactFields {
 const parts=p.name.trim().split(/\s+/);
 const legacyTitle=titles.find(t=>t.toLowerCase()===parts[0]?.toLowerCase());
 if(legacyTitle)parts.shift();
 return {title:p.title??legacyTitle??'',firstName:p.firstName??parts.shift()??'',lastName:p.lastName??parts.join(' '),street:p.street??p.address,city:p.city??'',state:p.state??''};
}
export function assembledContact(f:ContactFields){
 const fields=Object.fromEntries((['title','firstName','lastName','street','city','state'] as const).map(k=>[k,f[k].trim()])) as ContactFields;
 return {...fields,name:[fields.firstName,fields.lastName].filter(Boolean).join(' '),initials:[fields.firstName[0],fields.lastName[0]].filter(Boolean).join('').toUpperCase(),address:[fields.street,[fields.city,fields.state].filter(Boolean).join(', ')].filter(Boolean).join(', ')};
}
