import {useEffect,useState} from 'react';
import {doc,onSnapshot,runTransaction,serverTimestamp} from 'firebase/firestore';
import {auth,db} from './firebase';
import {useAccount} from './account';
export const defaults:Record<string,string>={
 'First Follow-Up':'Hi {firstName}, it was good meeting you! How are you doing? Please let me know if you have any questions about the Bible we shared.',
 'Invitation to Church':'Hi {firstName}, I wanted to invite you to join us at church this Sunday. Let me know if you would like the details or need a ride!',
 'Encouragement (After Attendance)':'Hi {firstName}, it was wonderful having you at church! I hope you felt welcome. Is there anything we can pray about with you?',
 'Thank You':'Hi {firstName}, thank you for taking time to talk with us. We appreciate you!',
 'Missed You':'Hi {firstName}, we missed seeing you at church. I hope you are doing well. Please let me know if we can help.',
 'Checking Back In':'Hi {firstName}, just checking in to see how you are doing. Is there anything you would like prayer for?',
 'Prayer Follow-Up':'Hi {firstName}, I wanted to follow up and see how things are going. We have been praying for you.',
 'Bible Study Invitation':'Hi {firstName}, would you be interested in studying the Bible together? We would love to find a time that works for you.'
};
export const personalize=(text:string,name:string)=>text.replaceAll('{firstName}',name.trim().split(/\s+/)[0]||'friend');
export function phoneLink(phone:string){return 'tel:'+phone.replace(/[^+\d]/g,'');}
export function textLink(phone:string,text:string){const apple=/iPad|iPhone|Mac/.test(navigator.userAgent);return 'sms:'+phone.replace(/[^+\d]/g,'')+(apple?'&':'?')+'body='+encodeURIComponent(text);}
export function useTemplates(){
 const account=useAccount();
 const[items,setItems]=useState(defaults),[error,setError]=useState(''),[revision,setRevision]=useState(0),[ready,setReady]=useState(false);
 useEffect(()=>onSnapshot(doc(db,`ministries/${account.ministryId}/settings/templates`),s=>{setItems({...defaults,...s.data()?.items});setRevision(s.data()?.revision||0);setReady(true);setError('');},()=>{setError('Shared templates could not load. Default messages are available.');setReady(false);}),[account.ministryId]);
 const save=async(key:string,body:string)=>{if(!ready||!auth.currentUser||auth.currentUser.uid!==account.uid)throw new Error('Templates are not ready to save.');if(!body.trim()||body.length>5000)throw new Error('Enter a message of 1–5000 characters.');await runTransaction(db,async tx=>{const ref=doc(db,`ministries/${account.ministryId}/settings/templates`),s=await tx.get(ref);if((s.data()?.revision||0)!==revision)throw new Error('Templates changed. Reopen the editor and try again.');tx.set(ref,{items:{...items,[key]:body},revision:revision+1,updatedBy:auth.currentUser!.uid,updatedAt:serverTimestamp()});});};
 return {items,error,save,ready};
}
export function TemplateEditor({back}:{back:()=>void}){
 const{items,error,save,ready}=useTemplates();const[key,setKey]=useState('First Follow-Up'),[body,setBody]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>setBody(items[key]),[key,items]);
 return <div className="contact-form template-editor"><h2>Message Templates</h2><p>Saved only in your account. Use {'{firstName}'} for the contact’s name.</p><select aria-label="Template to edit" value={key} onChange={e=>{setKey(e.target.value);setMessage('');}}>{Object.keys(items).map(k=><option key={k}>{k}</option>)}</select><textarea aria-label="Template message" value={body} onChange={e=>setBody(e.target.value)}/>{(error||message)&&<p role="status">{error||message}</p>}<button className="green-save" disabled={busy||!ready} onClick={async()=>{setBusy(true);try{await save(key,body);setMessage('Template saved for your account.');}catch(e){setMessage(e instanceof Error?e.message:'Not saved.');}finally{setBusy(false);}}}>{busy?'Saving…':'Save Template'}</button><button onClick={back}>Back to message</button></div>;
}
