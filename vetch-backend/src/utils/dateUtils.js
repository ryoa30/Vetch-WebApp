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
    day: "2-digit",
    month: "2-digit", // numeric so we can map to our custom short month
    year: "numeric",
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
  const day = get("day"); // "15"
  const mon = Number(get("month")); // "Sep"
  const year = get("year"); // "07"

  // Anchor to 1970-01-01 UTC so it matches Postgres TIME
  const timeOfDay = new Date(Date.UTC(1970, 0, 1, hh, mm, ss, 0));
  return { weekday: Number(weekday), timeOfDay, todayDate: new Date(`${year}-${String(mon).padStart(2,"0")}-${day}T00:00:00.000Z`) };
}

const hourToTime = (h) => {
  const hh = String(Math.floor(h)).padStart(2, "0");
  // gunakan UTC agar konsisten dengan kolom time tanpa zona
  return new Date(`1970-01-01T${hh}:00:00.000Z`);
};

// ===== NEW: mapping JS <-> DB day =====
const jsDayToDbDay = (js) => ((js + 6) % 7) + 1; // 0(Sun)->7, 1(Mon)->1, ... 6(Sat)->6
const normalizeWeekdayToDb = (w) =>
  w >= 0 && w <= 6 ? jsDayToDbDay(w) : w; // kalau sudah 1..7, biarkan

// ubah helper preset agar hasilnya 1..7 (DB)
function daysForPresetDb(preset, baseDate ) {
  const todayJs = baseDate.getDay();     // 0..6
  const todayDb = jsDayToDbDay(todayJs); // 1..7

  switch (preset) {
    case "Today":
      return [todayDb];
    case "Tomorrow": {
      const tmrDb = todayDb === 7 ? 1 : todayDb + 1;
      return [tmrDb];
    }
    case "This Week":
      // dari hari ini s/d Minggu (wrap ke 7)
      return Array.from({ length: 7 }, (_, i) => {
        const d = todayDb + i;
        return d > 7 ? d - 7 : d;
      });
    case "Custom":
    default:
      return [jsDayToDbDay((baseDate ?? new Date()).getDay())];
  }
}

 function toMins(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  function minsToHHMM(mins) {
    const m = (mins + MIN_PER_DAY) % MIN_PER_DAY;
    const h = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    return `${h}:${mm}`;
  }


  function formatIsoJakartaShort(iso) {
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
    .reduce((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});

  const day = parts.day; // "15"
  const mon = months[Number(parts.month) - 1]; // "Sep"
  const year = parts.year; // "07"

  return `${day} ${mon} ${year}`;
}


module.exports = {
  hhmmToUTCDate,
  hourToTime,
  daysForPresetDb,
  normalizeWeekdayToDb,
  dateToHHMM,
  nowForSchedule,
  toMins,
  minsToHHMM,
  formatIsoJakartaShort,
};
