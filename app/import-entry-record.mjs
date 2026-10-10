import {doc,runTransaction,serverTimestamp} from 'firebase/firestore';
import {validateRecord} from './record-validation.mjs';
export async function importEntryRecord(db,ministryId,uid,id,outingId){
 return runTransaction(db,async tx=>{
  const inbox=doc(db,`ministries/${ministryId}/entryInbox`,id),record=doc(db,`ministries/${ministryId}/records`,`entry-${id}`);
  const [pending,existing]=await Promise.all([tx.get(inbox),tx.get(record)]);
  if(!pending.exists()||pending.data().processed)return;
  const card=pending.data().card;validateRecord('contact',card);
  if(!existing.exists())tx.set(record,{kind:'contact',data:{...card,outingId},revision:1,updatedBy:uid,updatedAt:serverTimestamp()});
  tx.update(inbox,{processed:true});
 });
}
