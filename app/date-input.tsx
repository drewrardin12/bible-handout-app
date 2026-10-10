import type {InputHTMLAttributes} from 'react';
import {dateKey} from '../functions/outing-entry.mjs';
import {displayDate} from './date-display';
type Props=Omit<InputHTMLAttributes<HTMLInputElement>,'value'|'onChange'|'type'> & {value?:string;onChange:(value:string)=>void};
export function DateInput({value='',onChange,...props}:Props){
 const shown=displayDate(value);
 return <input {...props} type="text" inputMode="numeric" placeholder="MM-DD-YYYY" maxLength={10} pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}" value={shown} aria-invalid={shown.length===10&&!dateKey(shown)||undefined} onChange={e=>{
  const digits=e.target.value.replace(/\D/g,'').slice(0,8);
  const formatted=digits.slice(0,2)+(digits.length>2?'-'+digits.slice(2,4):'')+(digits.length>4?'-'+digits.slice(4):'');
  onChange(dateKey(formatted)||formatted);
 }}/>
}
