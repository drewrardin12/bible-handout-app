import {initializeApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {onDocumentCreated,onDocumentWritten} from 'firebase-functions/v2/firestore';
import {importCard} from './importer.mjs';
initializeApp();const db=getFirestore();
export const syncEntryCard=onDocumentCreated({document:'ministries/{ministryId}/entryInbox/{id}',retry:true},event=>importCard(db,event.params.ministryId,event.params.id));
export const matchWaitingEntryCards=onDocumentWritten({document:'ministries/{ministryId}/records/{id}',retry:true},async event=>{
 if(event.data?.after.data()?.kind!=='outing')return;
 const inbox=await db.collection(`ministries/${event.params.ministryId}/entryInbox`).get();
 for(const card of inbox.docs)if(!card.data().processed)await importCard(db,event.params.ministryId,card.id);
});
