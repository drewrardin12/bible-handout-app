import {doc,runTransaction,serverTimestamp} from 'firebase/firestore';
import {validateRecord} from './record-validation.mjs';
export async function importEntryRecord(db,ministryId,uid,id,outingId,parentId=id){
 return runTransaction(db,async tx=>{
  const inbox=doc(db,`ministries/${ministryId}/entryInbox`,id),record=doc(db,`ministries/${ministryId}/records`,`entry-${parentId}`);
  const [pending,existing]=await Promise.all([tx.get(inbox),tx.get(record)]);
  if(!pending.exists()||pending.data().processed)return;
  const card=pending.data().card;validateRecord('contact',card);
  const version=pending.data().version||0;
  if(!existing.exists()||(existing.data().data.entryVersion??0)<version){
   const prior=existing.exists()?existing.data():null;
   const fields=['title','firstName','lastName','street','city','state','name','initials','address','phone','age','met','metDate','date','event','rating','notes','gospelShared','decisionMade'];
   const data=prior?{...prior.data,...Object.fromEntries(fields.filter(k=>k in card).map(k=>[k,card[k]])),outingId,entryVersion:version}:{...card,outingId,entryVersion:version};
   tx.set(record,{kind:'contact',data,revision:prior?prior.revision+1:1,updatedBy:uid,updatedAt:serverTimestamp()});
  }
  tx.update(inbox,{processed:true});
 });
}
