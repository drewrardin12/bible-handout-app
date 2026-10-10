import {DateInput} from './date-input';
import {displayDate} from './date-display';
import {useState} from 'react';
import {isSunday,nextSunday} from './promise-date';
import {localDate} from './dashboard-data';
export function PromiseButton({date,attended,save}:{date?:string;attended?:boolean;save:(date:string)=>Promise<void>}){
 const[open,setOpen]=useState(false),[sunday,setSunday]=useState(date||nextSunday(localDate())),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const promised=!!date&&!attended;
 async function remove(){if(busy)return;setBusy(true);setError('');try{await save('');setOpen(false);}catch{setError('Your promise was not removed. Please try again.');}finally{setBusy(false);}}
 async function submit(){if(busy)return;if(!isSunday(sunday)){setError('Please choose a Sunday.');return;}setBusy(true);setError('');try{await save(sunday);setOpen(false);}catch{setError('Your promise was not saved. Please try again.');}finally{setBusy(false);}}
 return <div className="contact-promise"><button type="button" className="promise-button" aria-pressed={promised} aria-expanded={open} onClick={()=>{setSunday(date||nextSunday(localDate()));setError('');setOpen(!open);}}>{promised?'PROMISED':'PROMISE'}</button>{promised&&<small>Sunday, {displayDate(date)}</small>}{open&&<div className="promise-date-form"><label>Which Sunday?<DateInput value={sunday} onChange={setSunday}/></label><div><button type="button" disabled={busy} onClick={()=>void submit()}>{busy?'Saving…':'Save promise'}</button><button type="button" disabled={busy} onClick={()=>setOpen(false)}>Cancel</button></div>{promised&&<button type="button" className="remove-promise" disabled={busy} onClick={()=>void remove()}>Remove promise</button>}{error&&<p role="alert">{error}</p>}</div>}</div>;
}
