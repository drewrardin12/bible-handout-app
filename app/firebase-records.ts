import {collection,doc,onSnapshot,runTransaction,serverTimestamp} from 'firebase/firestore';
import {auth,db} from './firebase';
import {validateRecord} from './record-validation.mjs';
export type MinistryRecord={id?:string;revision?:number;name:string;[key:string]:unknown};
export function watchRecords(ministryId:string,onRecords:(records:MinistryRecord[])=>void,onError:()=>void){
 return onSnapshot(collection(db,`ministries/${ministryId}/records`),s=>onRecords(s.docs.map(d=>({...d.data().data,id:d.id,revision:d.data().revision,kind:d.data().kind}))),onError);
}
export async function saveRecord(ministryId:string,uid:string,kind:'contact'|'outing',record:MinistryRecord){
 const user=auth.currentUser;if(!user)throw new Error('Please sign in before saving.');
 if(user.uid!==uid)throw new Error('Your account changed. Reopen the app before saving.');
 if(!navigator.onLine)throw new Error('Offline. Keep the form open and retry when connected.');
 validateRecord(kind,record);
 const id=record.id||crypto.randomUUID();
 const {id:unusedId,revision:unusedRevision,kind:unusedKind,...fields}=record;
 const data=JSON.parse(JSON.stringify(fields));
 const ref=doc(db,`ministries/${ministryId}/records`,id);
 const revision=await runTransaction(db,async t=>{
  const previous=await t.get(ref),current=previous.exists()?previous.data().revision:0;
  if(previous.exists()&&previous.data().kind!==kind)throw new Error('Record type does not match. Nothing was saved.');
  if(current!==(record.revision||0))throw new Error('Changed on another device. Reopen this record before editing.');
  t.set(ref,{kind,data,revision:current+1,updatedBy:user.uid,updatedAt:serverTimestamp()});return current+1;
 });
 return {...record,id,revision};
}
