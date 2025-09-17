const { hhmmToUTCDate } = require("../utils/dateUtils");
const BaseRepository = require("./BaseRepository");

const MIN_PER_DAY = 1440;

class ScheduleRepository extends BaseRepository {
  constructor() {
    super("Schedule");
  }

  toMins(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  minsToHHMM(mins) {
    const m = (mins + MIN_PER_DAY) % MIN_PER_DAY;
    const h = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    return `${h}:${mm}`;
  }

  async findInvalidSchedule(vetId, day, targetHHMM) {
    const center = this.toMins(targetHHMM);
    const lo = (center - 30 + MIN_PER_DAY) % MIN_PER_DAY;
    const hi = (center + 30) % MIN_PER_DAY;

    console.log(hhmmToUTCDate(this.minsToHHMM(lo)))

    const timeFilter =
      lo <= hi
        ? { gt: hhmmToUTCDate(this.minsToHHMM(lo)), lt: hhmmToUTCDate(this.minsToHHMM(hi)) }
        : {
            OR: [
              { gt: hhmmToUTCDate(this.minsToHHMM(lo)) }, // e.g., 23:40..24:00
              { lt: hhmmToUTCDate(this.minsToHHMM(hi)) }, // and 00:00..00:10
            ],
          };

    return this._model.findFirst({
      where: { vetId, dayOfWeek:day, timeOfDay: timeFilter },
      orderBy: { timeOfDay: "asc" },
    });
  }
}

module.exports = ScheduleRepository;
