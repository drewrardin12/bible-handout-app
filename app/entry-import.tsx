import {useEffect,useRef,useState} from 'react';
import {collection,onSnapshot} from 'firebase/firestore';
import {db} from './firebase';
import {useAccount} from './account';
import {matchingOutings,outingName} from './outing-entry.mjs';
import {importEntryRecord} from './import-entry-record.mjs';
export function EntryImports({outings}:{outings:any[]}){
 const account=useAccount(),[items,setItems]=useState<any[]>([]),[error,setError]=useState(''),[retry,setRetry]=useState(0),[choices,setChoices]=useState<Record<string,string>>({});const working=useRef(new Set<string>());
 useEffect(()=>onSnapshot(collection(db,`ministries/${account.ministryId}/entryInbox`),s=>setItems(s.docs.filter(d=>!d.data().processed).map(d=>({id:d.id,...d.data()}))),()=>setError('Entry cards could not load. They remain stored for retry.')),[account.ministryId]);
 async function importCard(item:any,outing:any){if(working.current.has(item.id))return;working.current.add(item.id);try{await importEntryRecord(db,account.ministryId,account.uid,item.id,outing.id);setError('');}catch{setError('Entry import will retry. All cards remain saved.');}finally{working.current.delete(item.id);}}
 useEffect(()=>{for(const item of items){const matches=matchingOutings(item.card,outings);const selected=matches.length===1?matches[0]:matches.find((o:any)=>o.id===choices[item.id]);if(selected)void importCard(item,selected);}},[items,outings,retry,choices]);
 useEffect(()=>{const timer=setInterval(()=>setRetry(n=>n+1),15000);return()=>clearInterval(timer);},[]);
 return <>{error&&<p role="alert">{error}</p>}{items.map(item=>{const matches=matchingOutings(item.card,outings);return matches.length!==1?<div className="storage-notice" key={item.id}><b>{item.card.name}</b><p>{matches.length?'Choose the outing for this card:':`Waiting for an outing on ${item.card.metDate}.`}</p>{matches.length>1&&<select value={choices[item.id]||''} aria-label={`Outing for ${item.card.name}`} onChange={e=>{setChoices({...choices,[item.id]:e.target.value});}}><option value="">Select outing</option>{matches.map((o:any)=><option key={o.id} value={o.id}>{outingName(o)}</option>)}</select>}</div>:null;})}</>;
}
