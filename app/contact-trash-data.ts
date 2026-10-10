export function activeContacts<T extends {deletedAt?:string}>(contacts:T[]){return contacts.filter(p=>!p.deletedAt);}
