const { hhmmToUTCDate, nowForSchedule } = require("../utils/dateUtils");
const BaseRepository = require("./BaseRepository");
const BookingRepository = require("./BookingRepository");

const MIN_PER_DAY = 1440;

class ScheduleRepository extends BaseRepository {
  #bookingRepository;

  constructor() {
    super("Schedule");

    this.#bookingRepository = new BookingRepository();

    this.findVetSchedulesByDayAndId = this.findVetSchedulesByDayAndId.bind(this);
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

    console.log(hhmmToUTCDate(this.minsToHHMM(lo)));

    const timeFilter =
      lo <= hi
        ? {
            gt: hhmmToUTCDate(this.minsToHHMM(lo)),
            lt: hhmmToUTCDate(this.minsToHHMM(hi)),
          }
        : {
            OR: [
              { gt: hhmmToUTCDate(this.minsToHHMM(lo)) }, // e.g., 23:40..24:00
              { lt: hhmmToUTCDate(this.minsToHHMM(hi)) }, // and 00:00..00:10
            ],
          };

    return this._model.findFirst({
      where: { vetId, dayNumber: day, timeOfDay: timeFilter },
      orderBy: { timeOfDay: "asc" },
    });
  }

  async findVetSchedulesByDayAndId(vetId, day, bookingDate /* "YYYY-MM-DD" optional */) {
    const { weekday, timeOfDay } = nowForSchedule();

    // Build timeOfDay filter (hide past times if requesting today)
    const timeOfDayFilter = {};
    if (weekday === Number(day)) {
      timeOfDayFilter.gt = timeOfDay;
    }

    // Collect booked times for the given calendar date (if provided)
    let bookedTimes = [];
    // console.log("Booking Date: ",bookingDate)
    if (bookingDate) {
      const bookings = await this.#bookingRepository.findBookingByVetIdAndDate(vetId, bookingDate);

      console.log(bookings);

      bookedTimes = bookings.map((b) => b.bookingTime);
      if (bookedTimes.length) {
        timeOfDayFilter.notIn = bookedTimes;
      }
    }

    const result = await this._model.findMany({
      where: {
        dayNumber: Number(day),
        vetId,
        isDeleted: false,
        ...(Object.keys(timeOfDayFilter).length ? { timeOfDay: timeOfDayFilter } : {}),
      },
      orderBy: { timeOfDay: "asc" },
    });

    return result.map((schedule) => ({
      ...schedule,
      timeOfDay: schedule.timeOfDay.toISOString().slice(11, 16),
    }));
  }
}

module.exports = ScheduleRepository;
