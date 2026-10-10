import {RefreshCw} from 'lucide-react';
import {useEffect,useState} from 'react';
declare const __ACOUNT_VERSION__:string;
export function AppVersion({entry=false}:{entry?:boolean}){
 const [latest,setLatest]=useState(''),[status,setStatus]=useState('Checking latest version…');
 async function check(){setStatus('Checking latest version…');try{const r=await fetch('./version.json',{cache:'no-store',signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error();const data=await r.json() as {version?:unknown};if(typeof data.version!=='string')throw Error();setLatest(data.version);setStatus(data.version===__ACOUNT_VERSION__?'You have the most recent version.':'A newer version is available. Close all aCOUNT windows and reopen while online.');}catch{setLatest('');setStatus('Connect to the internet to check the most recent version.');}}
 useEffect(()=>{void check();},[]);
 return <section className="app-version"><div className="version-card-top"><img src={entry?'./entry-icon.png':'./app-icon.png'} alt=""/><div><h3><i className={latest===__ACOUNT_VERSION__?'current':''}/>{latest?latest===__ACOUNT_VERSION__?'aCOUNT is up to date':'Update available':'App version'}</h3><p className="version-name">{__ACOUNT_VERSION__}</p><div className="version-comparison"><span><small>Installed</small><b>{__ACOUNT_VERSION__}</b></span><span><small>Latest</small><b>{latest||'Not checked'}</b></span></div></div></div><p className="version-status" role="status">{status}</p><button onClick={()=>void check()}><RefreshCw size={22}/>Check for Updates</button></section>;
}
export const installedVersion=__ACOUNT_VERSION__;
