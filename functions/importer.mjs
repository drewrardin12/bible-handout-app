import {FieldValue} from 'firebase-admin/firestore';
import {matchOutings} from './outing-entry.mjs';
export async function importCard(db,ministryId,id){
 const inbox=db.doc(`ministries/${ministryId}/entryInbox/${id}`),record=db.doc(`ministries/${ministryId}/records/entry-${id}`);
 await db.runTransaction(async tx=>{
  const pending=await tx.get(inbox);if(!pending.exists||pending.data().processed)return;
  const card=pending.data().card;
  const outings=await tx.get(db.collection(`ministries/${ministryId}/records`).where('kind','==','outing'));
  const matches=matchOutings(card,outings.docs.map(d=>({id:d.id,...d.data().data})));
  if(matches.length!==1)return;
  const previous=await tx.get(record);
  if(!previous.exists)tx.set(record,{kind:'contact',data:{...card,outingId:matches[0].id},revision:1,updatedBy:'entry-sync',updatedAt:FieldValue.serverTimestamp()});
  tx.update(inbox,{processed:true});
 });
}
