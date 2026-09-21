export default function () {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
      .formatToParts(new Date(Date.now() - (24 * 60 * 60 * 1000)))
      .map(p => [p.type, p.value])
  );

  return `${parts.year}-${parts.month}-${parts.day}`;
}