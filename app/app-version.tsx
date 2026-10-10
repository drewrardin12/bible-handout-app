import {useEffect,useState} from 'react';
declare const __ACOUNT_VERSION__:string;
export function AppVersion(){
 const [latest,setLatest]=useState(''),[status,setStatus]=useState('Checking latest version…');
 async function check(){setStatus('Checking latest version…');try{const r=await fetch('./version.json',{cache:'no-store',signal:AbortSignal.timeout(8000)});if(!r.ok)throw Error();const data=await r.json() as {version?:unknown};if(typeof data.version!=='string')throw Error();setLatest(data.version);setStatus(data.version===__ACOUNT_VERSION__?'You have the most recent version.':'A newer version is available. Close all aCOUNT windows and reopen while online.');}catch{setLatest('');setStatus('Connect to the internet to check the most recent version.');}}
 useEffect(()=>{void check();},[]);
 return <section className="app-version"><h3>App version</h3><p><b>This app:</b> {__ACOUNT_VERSION__}</p>{latest&&<p><b>Most recent version:</b> {latest}</p>}<p role="status">{status}</p><button onClick={()=>void check()}>Check latest version</button></section>;
}
