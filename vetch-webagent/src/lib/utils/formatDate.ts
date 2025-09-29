export function formatIsoJakarta(iso: string) {
  console.log("date format",iso)
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit", // numeric so we can map to our custom short month
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(new Date(iso.split("Z")[0]))
    .reduce<Record<string, string>>((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});

  const day = parts.day;                     // "15"
  const mon = months[Number(parts.month) - 1]; // "Sep"
  const year = parts.year;                   // "2025"
  const hh = parts.hour;                     // "11"
  const mm = parts.minute;  
  
  console.log(hh);

  return `${day} ${mon} ${year} at ${hh}:${mm}`;
}
export function formatIsoJakartaShort(iso: string) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit", // numeric so we can map to our custom short month
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(new Date(iso))
    .reduce<Record<string, string>>((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});

  const day = parts.day;                     // "15"
  const mon = months[Number(parts.month) - 1]; // "Sep"
  const year = parts.year;               // "07"

  return `${day} ${mon} ${year}`;
}

export const formatLocalDate = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };