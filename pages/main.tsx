import {useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {GoogleAuthProvider,onAuthStateChanged,signInWithPopup,signOut,type User} from 'firebase/auth';
import {doc,onSnapshot} from 'firebase/firestore';
import {auth,db} from '../app/firebase';
import App from '../app/page';
import '../app/globals.css';
import '../app/reference-overrides.css';
import '../app/tally-overrides.css';
import '../app/contacts-reference.css';
import '../app/app-mode.css';
import '@fontsource-variable/montserrat';
import '../app/design-audit.css';
function Gate(){
 const [user,setUser]=useState<User|null>(null),[allowed,setAllowed]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState('');
 useEffect(()=>{let stopMember=()=>{};const stop=onAuthStateChanged(auth,u=>{
  stopMember();setUser(u);setAllowed(false);setError('');setLoading(Boolean(u));
  if(u)stopMember=onSnapshot(doc(db,'members',u.uid),s=>{setAllowed(u.emailVerified&&s.exists());setLoading(false);if(!s.exists())setError('Your account has not been approved for this ministry yet.');},()=>{setAllowed(false);setLoading(false);setError('Could not verify access. Check your connection and reload.');});
 });return()=>{stop();stopMember();};},[]);
 if(allowed)return <App/>;
 return <main className="sign-in-screen"><h1>Bible Handout Follow-Up</h1><p>Private ministry records. Sign in with your approved Google account.</p>{loading?<p>Checking access…</p>:<button onClick={()=>{setError('');void (user?signOut(auth):signInWithPopup(auth,new GoogleAuthProvider())).catch(e=>setError(e.code==='auth/unauthorized-domain'?'This preview address needs approval in Firebase Authentication settings.':e.code==='auth/popup-blocked'?'Allow the Google sign-in popup in your browser, then retry.':'Sign-in did not finish. Please try again.'));}}>{user?'Use another account':'Sign in with Google'}</button>}{error&&<p role="alert">{error}</p>}{user&&!allowed&&<p>Your approval ID: <code style={{overflowWrap:'anywhere'}}>{user.uid}</code></p>}</main>;
}
createRoot(document.getElementById('root')!).render(<Gate/>);
