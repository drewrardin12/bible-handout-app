import assert from 'node:assert/strict';
import {initializeApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {importCard} from './importer.mjs';
process.env.FIRESTORE_EMULATOR_HOST='127.0.0.1:8085';
initializeApp({projectId:'demo-entry-server-tests'});const db=getFirestore();
const base='ministries/abm';
const card={name:'Synthetic server test',metDate:'2026-10-10',phone:'555-0100'};
const inbox=id=>db.doc(`${base}/entryInbox/${id}`),record=id=>db.doc(`${base}/records/${id}`);
try{
 await inbox('waiting').set({card});await importCard(db,'abm','waiting');assert.equal((await inbox('waiting').get()).data().processed,undefined);
 await record('outing-one').set({kind:'outing',data:{date:'Oct 10, 2026',location:'Park'}});
 await Promise.all([importCard(db,'abm','waiting'),importCard(db,'abm','waiting')]);
 assert.equal((await record('entry-waiting').get()).data().revision,1);
 assert.equal((await record('entry-waiting').get()).data().data.outingId,'outing-one');
 assert.equal((await inbox('waiting').get()).data().processed,true);
 await record('outing-two').set({kind:'outing',data:{date:'2026-10-10',location:'Mall'}});
 await inbox('ambiguous').set({card});await importCard(db,'abm','ambiguous');
 assert.equal((await record('entry-ambiguous').get()).exists,false);
 assert.equal((await inbox('ambiguous').get()).data().processed,undefined);
 console.log('Server importer: waiting cards, automatic matching, concurrent duplicate delivery and ambiguity passed.');
}finally{await db.recursiveDelete(db.doc('ministries/abm'));await db.terminate();}
