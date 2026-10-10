import {useState} from 'react';
import {createUserWithEmailAndPassword,sendEmailVerification,sendPasswordResetEmail,signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from './firebase';

export function EmailSignIn(){
 const[email,setEmail]=useState(''),[password,setPassword]=useState(''),[creating,setCreating]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 async function submit(e:React.FormEvent){e.preventDefault();if(busy)return;setBusy(true);setMessage('');try{
  if(creating){const result=await createUserWithEmailAndPassword(auth,email.trim(),password);await sendEmailVerification(result.user);}
  else await signInWithEmailAndPassword(auth,email.trim(),password);
  setPassword('');
 }catch(e){const code=(e as {code?:string}).code;setMessage(code==='auth/email-already-in-use'?'This email already has an account. Use Set or reset app password below to keep your existing account and records.':code==='auth/weak-password'?'Choose a stronger password with at least 8 characters.':code==='auth/too-many-requests'?'Too many attempts. Wait a little and try again.':'Sign-in did not finish. Check your email and app password, or use Set or reset app password.');}finally{setBusy(false);}}
 async function reset(){if(busy)return;if(!email.trim()){setMessage('Enter your email address first.');return;}setBusy(true);try{await sendPasswordResetEmail(auth,email.trim());setMessage('If this email has an account, a password setup link has been sent. Check your inbox and spam folder. This sets your aCOUNT password, not your Google password.');}catch{setMessage('Could not send the setup link. Check your email and try again.');}finally{setBusy(false);}}
 return <form className="email-sign-in" onSubmit={submit}><label>Email<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>App password<input type="password" autoComplete={creating?'new-password':'current-password'} required minLength={creating?8:undefined} value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={busy} type="submit">{busy?'Please wait…':creating?'Create account':'Sign in'}</button><button disabled={busy} type="button" className="secondary-auth" onClick={()=>void reset()}>Set or reset app password</button><button disabled={busy} type="button" className="secondary-auth" onClick={()=>{setCreating(!creating);setPassword('');setMessage('');}}>{creating?'Already have an account? Sign in':'First time here? Create account'}</button><p className="auth-hint">Already used Google sign-in? Set an app password above to keep the same account and records. New accounts need email verification and approval.</p>{message&&<p role="status">{message}</p>}</form>;
}
