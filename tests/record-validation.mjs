import assert from 'node:assert/strict';
import {validateRecord} from '../app/record-validation.mjs';
const outing={name:'Test outing',bibles:7,contactCards:1,gospels:2,salvations:0,promises:3};
validateRecord('outing',outing);
validateRecord('contact',{name:'Test contact'});
for(const key of ['bibles','contactCards','gospels','salvations','promises']){
 for(const value of [-1,1.5,NaN,Infinity,'2',undefined])assert.throws(()=>validateRecord('outing',{...outing,[key]:value}));
}
for(const name of ['', '   ',null,2])assert.throws(()=>validateRecord('contact',{name}));
for(const id of ['', 'a/b',4])assert.throws(()=>validateRecord('contact',{name:'Test',id}));
for(const revision of [-1,.5,'2'])assert.throws(()=>validateRecord('contact',{name:'Test',revision}));
assert.throws(()=>validateRecord('other',outing));
console.log('Record validation passed: independent tallies, invalid counts, names, IDs, revisions and types.');
