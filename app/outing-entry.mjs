import {dateKey,matchOutings} from '../functions/outing-entry.mjs';
export const outingDate=dateKey;
export function outingName(outing) {
  const date = outingDate(outing.date);
  if (!date || !outing.location?.trim()) return outing.name || 'Outing';
  const [y,m,d] = date.split('-').map(Number);
  return `${outing.location.trim()} — ${new Date(y,m-1,d).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}`;
}
export const matchingOutings=matchOutings;
