import {useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {GoogleAuthProvider,onIdTokenChanged,signInWithPopup,signOut,sendEmailVerification,type User} from 'firebase/auth';
import {doc,onSnapshot} from 'firebase/firestore';
import {auth,db} from '../app/firebase';
import App from '../app/page';
import {AccountContext,type Account} from '../app/account';
import {EmailSignIn} from '../app/email-sign-in';
import '../app/globals.css';
import '../app/reference-overrides.css';
import '../app/tally-overrides.css';
import '../app/contacts-reference.css';
import '../app/app-mode.css';
import '@fontsource-variable/montserrat';
import '../app/design-audit.css';
function Gate(){
 const [user,setUser]=useState<User|null>(null),[account,setAccount]=useState<Account|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{let stops:(()=>void)[]=[];let generation=0;const stop=onIdTokenChanged(auth,u=>{
  generation++;const current=generation;stops.forEach(s=>s());stops=[];setUser(u);setAccount(null);setError('');setLoading(Boolean(u));
  if(!u)return;
  if(!u.emailVerified||!u.email){setLoading(false);setError('Verify your email using the link in your inbox, then tap Check verification.');return;}
  const apply=(data:any)=>{if(current!==generation)return;const id=data?.ministryId;if(typeof id!=='string'||!id||id.includes('/')){setAccount(null);setLoading(false);setError('Your account has not been approved yet.');return;}setAccount({uid:u.uid,ministryId:id,name:data?.name||u.displayName?.split(' ')[0]||'friend'});setLoading(false);setError('');};
  stops.push(onSnapshot(doc(db,'members',u.uid),s=>{
   if(current!==generation)return;
   if(s.exists()){apply({...s.data(),ministryId:s.data().ministryId||'abm'});return;}
   stops.push(onSnapshot(doc(db,'accessInvites',u.email!),invite=>apply(invite.exists()?invite.data():null),()=>{setAccount(null);setLoading(false);setError('Could not verify access. Please reload.');}));
  },()=>{setAccount(null);setLoading(false);setError('Could not verify access. Please reload.');}));
 });return()=>{generation++;stop();stops.forEach(s=>s());};},[]);
 if(account)return <AccountContext.Provider key={account.uid+account.ministryId} value={account}><App/></AccountContext.Provider>;
 return <main className="sign-in-screen"><h1>aCOUNT</h1><p>Sign in to your private ministry account.</p>{loading?<p>Checking access…</p>:user?<>{!user.emailVerified&&<><button onClick={()=>void user.reload().then(()=>user.getIdToken(true)).catch(()=>setError('Could not check verification. Please retry.'))}>Check verification</button><button className="secondary-auth" onClick={()=>void sendEmailVerification(user).then(()=>setError('Verification link sent. Check your inbox.')).catch(()=>setError('Could not send the link. Wait a little and retry.'))}>Resend verification email</button></>}<button className="secondary-auth" onClick={()=>void signOut(auth)}>Use another account</button></>:<><EmailSignIn/><div className="auth-divider">or</div><button className="secondary-auth" onClick={()=>{setError('');void signInWithPopup(auth,new GoogleAuthProvider()).catch(()=>setError('Google sign-in did not return to the app. Use email and app password above.'));}}>Sign in with Google</button></>}{error&&<p role="alert">{error}</p>}</main>;
}
createRoot(document.getElementById('root')!).render(<Gate/>);
