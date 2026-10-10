import assert from 'node:assert/strict';
import {initializeApp,deleteApp} from 'firebase/app';
import {getAuth,connectAuthEmulator,GoogleAuthProvider,signInWithCredential,sendPasswordResetEmail,confirmPasswordReset,signOut,signInWithEmailAndPassword} from 'firebase/auth';
const app=initializeApp({apiKey:'fake-test-key',projectId:'demo-handout-privacy'},'email-auth-test');
const auth=getAuth(app);connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});
const email='password-test@example.test';
const encode=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
try {
 const token=[encode({alg:'none'}),encode({sub:'synthetic-google-user',email,email_verified:true,name:'Synthetic test',iss:'https://accounts.google.com',aud:'test',iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+3600}),''].join('.');
 const original=await signInWithCredential(auth,GoogleAuthProvider.credential(token));
 const uid=original.user.uid;
 await sendPasswordResetEmail(auth,email);
 const response=await fetch('http://127.0.0.1:9099/emulator/v1/projects/demo-handout-privacy/oobCodes');
 const codes=(await response.json()).oobCodes;
 const code=codes.find(c=>c.email===email&&c.requestType==='PASSWORD_RESET');
 assert.ok(code,'Password setup code must be issued for the existing Google identity');
 await confirmPasswordReset(auth,code.oobCode,'Synthetic-test-only-48!');
 await signOut(auth);
 const signedIn=await signInWithEmailAndPassword(auth,email,'Synthetic-test-only-48!');
 assert.equal(signedIn.user.uid,uid,'Password sign-in must retain the existing UID');
 assert.equal(signedIn.user.emailVerified,true);
 console.log('Email/password setup passed: existing Google UID and verification preserved.');
} finally {await signOut(auth);await deleteApp(app);}
