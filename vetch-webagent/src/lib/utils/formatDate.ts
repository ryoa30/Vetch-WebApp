const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatIsoJakarta(iso: string) {

  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta", 
    day: "2-digit",
    month: "2-digit",
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

  const day = parts.day; // "15"
  const mon = months[Number(parts.month) - 1]; // "Sep"
  const year = parts.year; // "2025"
  const hh = parts.hour; // "11"
  const mm = parts.minute;


  return `${day} ${mon} ${year} at ${hh}:${mm}`;
}

export function hourMinuteFromString(iso: string) {

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

  const hh = parts.hour;
  const mm = parts.minute;


  return {hours: Number(hh), minutes: Number(mm)} as {hours: number, minutes: number};
}

export function formatIsoJakartaShort(iso: string) {

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

  const day = parts.day; // "15"
  const mon = months[Number(parts.month) - 1]; // "Sep"
  const year = parts.year; // "07"

  return `${day} ${mon} ${year}`;
}

export const formatLocalDate = (d: Date) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

export function hhmmToUTCDate(hhmm) {
  console.log("hhmmToUTCDate", hhmm);
    if (typeof hhmm !== "string" || !/^\d{2}:\d{2}$/.test(hhmm)) {
    throw new Error("time must be 'HH:mm'");
  }
  const [h, m] = hhmm.split(":").map(Number);
  if (h > 23 || m > 59) throw new Error("invalid HH:mm");
  return new Date(Date.UTC(1970, 0, 1, h, m, 0, 0));
}

export function dateToHHMM(d) {
  // date is anchored at 1970-01-01Z; safe to use toISOString slice
  return d.toISOString().slice(11, 16);
}

export function dateToUTCDate(d: Date) {
  return hhmmToUTCDate(dateToHHMM(d));
}

export function hhmmToUtcString(hhmm: {hours: number; minutes: number}) {
  const h = String(hhmm.hours).padStart(2, "0");
  const m = String(hhmm.minutes).padStart(2, "0");
  return `1970-01-01T${h}:${m}:00.000Z`;
}

/**
 * Calculate age (years + months) from a date of birth.
 * - Uses UTC to avoid timezone/DST edge cases.
 * - Accepts Date or ISO string for both dob and asOf.
 */
export function ageFromDob(
  dob: Date | string,
  asOf: Date | string = new Date()
): { years: number; months: number; totalMonths: number } {
  const d0 = toUTCDate(dob);
  const d1 = toUTCDate(asOf);

  if (isNaN(d0.getTime())) throw new Error("Invalid DOB");
  if (isNaN(d1.getTime())) throw new Error("Invalid asOf date");
  if (d1 < d0) return { years: 0, months: 0, totalMonths: 0 };

  // Raw differences
  let years = d1.getUTCFullYear() - d0.getUTCFullYear();
  let months = d1.getUTCMonth() - d0.getUTCMonth();

  // If day-of-month hasn't reached yet this month, borrow 1 month
  const dayDiff = d1.getUTCDate() - d0.getUTCDate();
  if (dayDiff < 0) months -= 1;

  // Normalize negatives
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, totalMonths: years * 12 + months };
}

function toUTCDate(d: Date | string): Date {
  const dt = typeof d === "string" ? new Date(d) : d;
  // Normalize to a UTC date (strip local time component if you pass a date-only string)
  return new Date(
    Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate())
  );
}

/** Optional: pretty printer like "2y 3m" or "7 months" */
export function formatAge(age: { years: number; months: number }) {
  const parts: string[] = [];
  if (age.years) parts.push(`${age.years}y`);
  if (age.months) parts.push(`${age.months}m`);
  return parts.length ? parts.join(" ") : "0m";
}
