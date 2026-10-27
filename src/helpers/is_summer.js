let summerSet = new Set([4, 5, 6, 7, 8, 9, 10])
function getCurrentMonth() {
  const month = new Intl.DateTimeFormat('en-US', {
    timeZone: `America/New_York`,
    month: 'numeric',
  }).format(new Date());

  return Number(month);
}
export default function(){
    return summerSet.has(getCurrentMonth());
}