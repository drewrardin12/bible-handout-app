// Use local calendar dates so daylight-saving changes do not shift the rollover.
export function saturdayWeek(date=new Date()) {
  const day=Date.UTC(date.getFullYear(),date.getMonth(),date.getDate());
  return Math.floor((day-Date.UTC(2026,9,10))/(7*86400000));
}
export function weeklyIndex(length:number,date=new Date()) {
  return ((saturdayWeek(date)%length)+length)%length;
}
export const encouragements=[
  'A faithful conversation today can become the beginning of a lifelong walk with Christ.',
  'Give the Word with kindness, listen with patience, and leave room for God to work.',
  'The person in front of you is worth your time, your prayer, and your follow-up.',
  'Small acts of faithfulness matter: a Bible shared, a name remembered, a call returned.',
  'You may not see the harvest today. Keep sowing with love and praying with hope.',
  'Follow-up is an opportunity to show that your care continues beyond the first conversation.',
  'Go with humility, speak with grace, and trust God with the results.',
  'Remember the person behind the contact card. Reach out, listen, and take the next faithful step.'
];
