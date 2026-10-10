import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// Public identifiers; database rules enforce access.
const app=initializeApp({projectId:'bible-handout-follow-up-abm',appId:'1:317639700250:web:a0231871890ed8d6d946a3',apiKey:'AIzaSyCAMs3skHregrqyPH9f3SzZOxK0b_1kI2o',authDomain:'bible-handout-follow-up-abm.firebaseapp.com'});
export const auth=getAuth(app);
export const db=getFirestore(app);
