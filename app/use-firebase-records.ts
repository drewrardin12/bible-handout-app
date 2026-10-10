import {useCallback,useEffect,useState} from 'react';
import {saveRecord,watchRecords,type MinistryRecord} from './firebase-records';
import {useAccount} from './account';
export function useSharedRecords<C,O>(){
 const account=useAccount();
 const [contacts,setContacts]=useState<C[]>([]),[outings,setOutings]=useState<O[]>([]),[ready,setReady]=useState(false),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 const refresh=useCallback(()=>setAttempt(n=>n+1),[]);
 useEffect(()=>{setReady(false);return watchRecords(account.ministryId,rows=>{setContacts(rows.filter(r=>r.kind==='contact') as C[]);setOutings(rows.filter(r=>r.kind==='outing') as O[]);setReady(true);setError('');},()=>{setContacts([]);setOutings([]);setReady(false);setError('Cannot load private records. Check your connection and access, then retry.');});},[attempt,account.ministryId]);
 async function save<T extends {id?:string;revision?:number}>(kind:'contact'|'outing',record:T):Promise<T>{
  if(!ready)throw new Error('Wait for saved records to load before saving.');
  return await saveRecord(account.ministryId,account.uid,kind,record as unknown as MinistryRecord) as unknown as T;
 }
 return {contacts,outings,ready,error,refresh,save};
}
