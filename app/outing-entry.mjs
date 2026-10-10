import {dateKey,matchOutings} from '../functions/outing-entry.mjs';
export const outingDate=dateKey;
export function outingName(outing) {
  const date = outingDate(outing.date);
  if (!date || !outing.location?.trim()) return outing.name || 'Outing';
  const [y,m,d]=date.split('-');
  return `${outing.location.trim()} — ${m}-${d}-${y}`;
}
export const matchingOutings=matchOutings;
