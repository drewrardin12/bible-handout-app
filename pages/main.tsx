import {useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {GoogleAuthProvider,onAuthStateChanged,signInWithPopup,signOut,type User} from 'firebase/auth';
import {doc,onSnapshot} from 'firebase/firestore';
import {auth,db} from '../app/firebase';
import App from '../app/page';
import {AccountContext,type Account} from '../app/account';
import '../app/globals.css';
import '../app/reference-overrides.css';
import '../app/tally-overrides.css';
import '../app/contacts-reference.css';
import '../app/app-mode.css';
import '@fontsource-variable/montserrat';
import '../app/design-audit.css';
function Gate(){
 const [user,setUser]=useState<User|null>(null),[account,setAccount]=useState<Account|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{let stops:(()=>void)[]=[];let generation=0;const stop=onAuthStateChanged(auth,u=>{
  generation++;const current=generation;stops.forEach(s=>s());stops=[];setUser(u);setAccount(null);setError('');setLoading(Boolean(u));
  if(!u)return;
  if(!u.emailVerified||!u.email){setLoading(false);setError('A verified Google email is required.');return;}
  const apply=(data:any)=>{if(current!==generation)return;const id=data?.ministryId;if(typeof id!=='string'||!id||id.includes('/')){setAccount(null);setLoading(false);setError('Your account has not been approved yet.');return;}setAccount({uid:u.uid,ministryId:id,name:data?.name||u.displayName?.split(' ')[0]||'friend'});setLoading(false);setError('');};
  stops.push(onSnapshot(doc(db,'members',u.uid),s=>{
   if(current!==generation)return;
   if(s.exists()){apply({...s.data(),ministryId:s.data().ministryId||'abm'});return;}
   stops.push(onSnapshot(doc(db,'accessInvites',u.email!),invite=>apply(invite.exists()?invite.data():null),()=>{setAccount(null);setLoading(false);setError('Could not verify access. Please reload.');}));
  },()=>{setAccount(null);setLoading(false);setError('Could not verify access. Please reload.');}));
 });return()=>{generation++;stop();stops.forEach(s=>s());};},[]);
 if(account)return <AccountContext.Provider key={account.uid+account.ministryId} value={account}><App/></AccountContext.Provider>;
 return <main className="sign-in-screen"><h1>aCOUNT</h1><p>Private ministry records. Sign in with your approved Google account.</p>{loading?<p>Checking access…</p>:<button onClick={()=>{setError('');void (user?signOut(auth):signInWithPopup(auth,new GoogleAuthProvider())).catch(()=>setError('Sign-in did not finish. Please try again.'));}}>{user?'Use another account':'Sign in with Google'}</button>}{error&&<p role="alert">{error}</p>}</main>;
}
createRoot(document.getElementById('root')!).render(<Gate/>);
