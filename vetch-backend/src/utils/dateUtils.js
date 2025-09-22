// "07:00" -> Date anchored to 1970-01-01T07:00:00Z
function hhmmToUTCDate(hhmm) {
  console.log("hhmmToUTCDate", hhmm);
    if (typeof hhmm !== "string" || !/^\d{2}:\d{2}$/.test(hhmm)) {
    throw new Error("time must be 'HH:mm'");
  }
  const [h, m] = hhmm.split(":").map(Number);
  if (h > 23 || m > 59) throw new Error("invalid HH:mm");
  return new Date(Date.UTC(1970, 0, 1, h, m, 0, 0));
}

// Date (from Prisma @db.Time) -> "HH:mm"
function dateToHHMM(d) {
  // date is anchored at 1970-01-01Z; safe to use toISOString slice
  return d.toISOString().slice(11, 16);
}

const BUSINESS_TZ = "Asia/Jakarta";

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

// Build { weekday: "monday", timeOfDay: Date(1970-01-01THH:mm:ssZ) }
function nowForSchedule(zone = BUSINESS_TZ) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (t) => parts.find((p) => p.type === t)?.value;
  const weekday = daysOfWeek.indexOf(get("weekday").toLowerCase())+1; // "monday", "tuesday", ...
  const hh = Number(get("hour"));
  const mm = Number(get("minute"));
  const ss = Number(get("second"));

  // Anchor to 1970-01-01 UTC so it matches Postgres TIME
  const timeOfDay = new Date(Date.UTC(1970, 0, 1, hh, mm, ss, 0));
  return { weekday: Number(weekday), timeOfDay };
}

module.exports = {
  hhmmToUTCDate,
  dateToHHMM,
  nowForSchedule
};
