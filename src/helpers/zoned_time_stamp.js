export default function(timeStamp, timeZone = "America/New_York") {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .formatToParts(new Date(timeStamp || Date.now()))
      .map(p => [p.type, p.value])
  );
  let s_part = (parts.second < 30) ? "00" : "30";
  let h_part = (parts.hour < 24) ? parts.hour : "00";
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${h_part}:${parts.minute}:${s_part}`, month: parts.month, day: parts.day, year: parts.year };
}