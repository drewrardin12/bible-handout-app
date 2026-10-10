export function validateRecord(kind, record) {
  if (!['contact', 'outing'].includes(kind)) throw new Error('Unknown record type.');
  if (typeof record.name !== 'string' || !record.name.trim()) throw new Error('Please enter a name.');
  if (record.id !== undefined && (typeof record.id !== 'string' || !record.id || record.id.includes('/'))) throw new Error('Invalid record identifier.');
  if (record.revision !== undefined && (!Number.isSafeInteger(record.revision) || record.revision < 0)) throw new Error('Invalid record revision.');
  if (kind === 'outing' && ['bibles','contactCards','gospels','salvations','promises'].some(k => !Number.isSafeInteger(record[k]) || record[k] < 0)) throw new Error('Tallies must be nonnegative whole numbers.');
}
