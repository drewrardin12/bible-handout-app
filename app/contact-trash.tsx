import {displayDate} from './date-display';
import {useState} from 'react';
import {ChevronLeft,RotateCcw} from 'lucide-react';
export {activeContacts} from './contact-trash-data';
export function ContactTrash<T extends {id?:string;name:string;deletedAt?:string}>({contacts,close,restore}:{contacts:T[];close:()=>void;restore:(p:T)=>Promise<void>}){
 const[busy,setBusy]=useState<string|null>(null),[error,setError]=useState('');
 async function recover(p:T){if(busy)return;setBusy(p.id||p.name);setError('');try{await restore(p);}catch{setError('Could not restore this contact. Please try again.');}finally{setBusy(null);}}
 return <div className="overlay"><div className="sheet contact-trash"><header><button aria-label="Close Trash" onClick={close}><ChevronLeft/></button><h2>Trash</h2></header><p>Contacts stay here until you restore them. Their notes, history, and linked handout are preserved.</p>{error&&<p role="alert">{error}</p>}{contacts.map(p=><article key={p.id||p.name}><div><b>{p.name}</b><small>Moved to Trash {displayDate(p.deletedAt)}</small></div><button disabled={busy!==null} onClick={()=>void recover(p)}><RotateCcw/>{busy===(p.id||p.name)?'Restoring…':'Restore'}</button></article>)}{!contacts.length&&<p>Trash is empty.</p>}</div></div>;
}
