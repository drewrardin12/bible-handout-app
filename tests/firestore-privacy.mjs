import {readFileSync} from 'node:fs';
import {initializeTestEnvironment,assertFails,assertSucceeds} from '@firebase/rules-unit-testing';
import {doc,collection,getDoc,getDocs,setDoc,updateDoc,deleteDoc,serverTimestamp} from 'firebase/firestore';
const env=await initializeTestEnvironment({projectId:'demo-handout-privacy',firestore:{rules:readFileSync('firestore.rules','utf8'),host:'127.0.0.1',port:8080}});
const path='ministries/abm/records/test-contact';
try {
 await env.withSecurityRulesDisabled(async ctx=>{await setDoc(doc(ctx.firestore(),'members/approved'),{name:'Test member'});await setDoc(doc(ctx.firestore(),path),{kind:'contact',data:{name:'Synthetic test'},revision:1,updatedBy:'approved',updatedAt:new Date()});});
 for(const ctx of [env.unauthenticatedContext(),env.authenticatedContext('outsider',{email_verified:true}),env.authenticatedContext('approved',{email_verified:false})]) {
  const db=ctx.firestore();
  await assertFails(getDoc(doc(db,path)));
  await assertFails(getDoc(doc(db,'ministries/abm/settings/templates')));
  await assertFails(setDoc(doc(db,'ministries/abm/settings/templates'),{items:{test:'Denied'},revision:1,updatedBy:'outsider',updatedAt:serverTimestamp()}));
  await assertFails(getDocs(collection(db,'ministries/abm/records')));
  await assertFails(setDoc(doc(db,'ministries/abm/records/forbidden'),{kind:'contact',data:{name:'Unauthorized'},revision:1,updatedBy:ctx.auth?.uid||'outsider',updatedAt:serverTimestamp()}));
  await assertFails(updateDoc(doc(db,path),{revision:2}));
  await assertFails(setDoc(doc(db,'members/outsider'),{name:'Self approval'}));
 }
 const db=env.authenticatedContext('approved',{email_verified:true}).firestore();
 await assertSucceeds(getDoc(doc(db,path)));
 const template=doc(db,'ministries/abm/settings/templates');
 await assertSucceeds(setDoc(template,{items:{test:'Hello'},revision:1,updatedBy:'approved',updatedAt:serverTimestamp()}));
 await assertSucceeds(updateDoc(template,{items:{test:'Updated'},revision:2,updatedAt:serverTimestamp()}));
 await assertFails(updateDoc(template,{revision:2,updatedAt:serverTimestamp()}));
 await assertFails(getDoc(doc(db,'ministries/another/settings/templates')));
 await assertSucceeds(getDocs(collection(db,'ministries/abm/records')));
 await assertSucceeds(getDoc(doc(db,'members/approved')));
 await assertFails(getDocs(collection(db,'members')));
 await assertFails(getDoc(doc(db,'members/other')));
 await assertSucceeds(updateDoc(doc(db,path),{revision:2,updatedBy:'approved',updatedAt:serverTimestamp()}));
 await assertFails(updateDoc(doc(db,path),{revision:2,updatedAt:serverTimestamp()}));
 await assertFails(deleteDoc(doc(db,path)));
 await assertFails(setDoc(doc(db,'ministries/other/records/test'),{kind:'contact',data:{name:'Test'}}));
 console.log('Privacy passed: anonymous, nonmember, unverified, self-approval, cross-ministry, stale writes and deletion denied; approved read/save allowed.');
} finally {await env.cleanup();}
