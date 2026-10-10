import {useState} from 'react';
import {displayDate} from './date-display';
export function HandoutTrash<T extends {id:string;name:string;date:string}>({outings,close,restore}:{outings:T[];close:()=>void;restore:(outing:T)=>Promise<void>}){
 const[busy,setBusy]=useState(''),[error,setError]=useState('');
 async function recover(outing:T){if(busy)return;setBusy(outing.id);setError('');try{await restore(outing);}catch{setError('Could not restore this handout. Please retry.');}finally{setBusy('');}}
 return <div className="overlay"><div className="sheet contact-trash"><header><button aria-label="Close handout Trash" onClick={close}>‹</button><h2>Handout Trash</h2></header><p>Deleted handouts are excluded from reports and outing matching. Their totals and linked contacts are preserved.</p>{error&&<p role="alert">{error}</p>}{outings.map(o=><article key={o.id}><div><b>{o.name}</b><small>{displayDate(o.date)}</small></div><button disabled={!!busy} onClick={()=>void recover(o)}>{busy===o.id?'Restoring…':'Restore handout'}</button></article>)}{!outings.length&&<p>Handout Trash is empty.</p>}</div></div>;
}
