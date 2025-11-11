const {
  nowForSchedule,
  daysForPresetDb,
  hourToTime,
} = require("../utils/dateUtils");
const BaseRepository = require("./BaseRepository");
const RatingRepository = require("./RatingRepository");
const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});
class VetRepository extends BaseRepository {
  #ratingRepository;
  constructor() {
    super("Vet");
    this.#ratingRepository = new RatingRepository();

    this.findVetListConsultation = this.findVetListConsultation.bind(this);
    this.findVetListEmergency = this.findVetListEmergency.bind(this);
  }

  async findVetUserId(id) {
    return this._model.findUnique({
      where: { id: id },
      select: { userId: true },
    });
  }

  async findVetId(userId) {
    return this._model.findUnique({
      where: { userId: userId },
      select: { id: true },
    });
  }

  async findVetsCards(options = {}) {
    return this._model.findMany(options);
  }

  async findVetListConsultation(page = 1, volume = 10, query = "", filters) {
    const offset = (page - 1) * volume;
    const { weekday, timeOfDay } = nowForSchedule(); // current day + current time
    const q = query?.trim();

    console.log(filters);

    // --------- derive filters ---------
    const petTypes = filters.petTypes?.length ? filters.petTypes : undefined;

    // fee in DB = rupiah; UI dalam ribuan
    const feeMin = filters.feeRange ? filters.feeRange[0] * 1_000 : undefined;
    const feeMax = filters.feeRange ? filters.feeRange[1] * 1_000 : undefined;

    const wantHomecare = filters.homecareAble ?? false;

    const schedule = filters.schedule;
    console.log(schedule);
    const haveScheduleFilter = !!schedule;
    const scheduleDays = haveScheduleFilter
      ? daysForPresetDb(
          schedule.preset,
          schedule.date ? new Date(schedule.date) : new Date()
        )
      : undefined;
    const scheduleStart = haveScheduleFilter
      ? hourToTime(schedule.startHour)
      : undefined;
    const scheduleEnd = haveScheduleFilter
      ? hourToTime(schedule.endHour)
      : undefined;

    // --------- base WHERE (verified, non-deleted, future slots) ---------
    const where = {
      user: {
        is: {
          isDeleted: false,
          ...(q ? { fullName: { contains: q, mode: "insensitive" } } : {}),
        },
      },
      NOT: { price: 0, description: "" },
      verified: true,
      verifiedDate: { not: null },
      ...(feeMin != null || feeMax != null
        ? {
            price: {
              ...(feeMin != null ? { gte: feeMin } : {}),
              ...(feeMax != null ? { lte: feeMax } : {}),
            },
          }
        : {}),
      ...(wantHomecare ? { isAvailHomecare: true } : {}),

      // Pet types (via Species -> SpeciesType)
      ...(petTypes
        ? {
            speciesHandled: {
              some: {
                speciesType: {
                  speciesName: {
                    in: petTypes,
                    mode: "insensitive",
                  },
                },
              },
            },
          }
        : {}),

      // Schedules: tetap hanya masa depan
      schedules: {
        some: {
          isDeleted: false,
          AND: [
            {
              OR: [
                { dayNumber: weekday, timeOfDay: { gt: timeOfDay } }, // sisa hari ini
                { dayNumber: { gt: weekday } }, // hari-hari berikutnya
              ],
            },
            // tambahan filter schedule dari user (optional)
            ...(haveScheduleFilter
              ? [
                  {
                    dayNumber: { in: scheduleDays },
                  },
                  {
                    // time range:  start <= timeOfDay < end
                    timeOfDay: {
                      gte: scheduleStart,
                      lt: scheduleEnd,
                    },
                  },
                ]
              : []),
          ],
        },
      },
    };

    // 1) fetch vets + next 3 slots (unsorted)
    const rows = await this._model.findMany({
      select: {
        id: true,
        userId: true,
        price: true,
        isAvailHomecare: true,
        user: { select: { profilePicture: true, fullName: true } },
        schedules: {
          take: 3,
          where: {
            isDeleted: false,
            AND: [
              {
                OR: [
                  { dayNumber: weekday, timeOfDay: { gt: timeOfDay } },
                  { dayNumber: { gt: weekday } },
                ],
              },
              ...(haveScheduleFilter
                ? [
                    { dayNumber: { in: scheduleDays } },
                    { timeOfDay: { gte: scheduleStart, lt: scheduleEnd } },
                  ]
                : []),
            ],
          },
          orderBy: [{ dayNumber: "asc" }, { timeOfDay: "asc" }],
          select: { id: true, dayNumber: true, timeOfDay: true },
        },
      },
      where,
    });

    // 2) sort by soonest upcoming slot
    rows.sort((a, b) => {
      const A = a.schedules[0];
      const B = b.schedules[0];
      if (!A && !B) return 0;
      if (!A) return 1;
      if (!B) return -1;
      if (A.dayNumber !== B.dayNumber) return A.dayNumber - B.dayNumber;
      return A.timeOfDay.getTime() - B.timeOfDay.getTime();
    });

    // (optional) filter by minRating AFTER we know ratings
    const candidateIds = rows.map((v) => v.id);
    const ratingAgg = await this.#ratingRepository.findAverageRatingVets(
      candidateIds
    );
    const ratingMap = new Map(
      ratingAgg.map((r) => [
        r.vetId,
        {
          ratingAvg: r._avg.rating ?? 0,
          ratingCount: r._count._all,
        },
      ])
    );

    const minRating = filters.minRating ?? undefined;
    const rowsAfterRating = minRating
      ? rows.filter((v) => {
          const agg = ratingMap.get(v.id);
          const avg = agg ? agg.ratingAvg : 0;
          return avg >= minRating;
        })
      : rows;

    // 3) paginate AFTER sort (+ after rating filter)
    const totalItems = rowsAfterRating.length;
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / volume);
    const pageRows = rowsAfterRating.slice(offset, offset + volume);

    // 4) shape response
    const vets = pageRows.map((vet) => {
      const agg = ratingMap.get(vet.id) ?? { ratingAvg: 0, ratingCount: 0 };
      return {
        ...vet,
        ...vet.user,
        profilePicture:
          vet.user.profilePicture ||
          "https://res.cloudinary.com/daimddpvp/image/upload/v1758101764/default-profile-pic_lppjro.jpg",
        user: undefined,
        ratingCount: agg.ratingCount,
        ratingAvg: Math.round((agg.ratingAvg ?? 0) * 10) / 10,
        schedules: vet.schedules.map((s) => ({
          ...s,
          timeOfDay: s.timeOfDay.toISOString().slice(11, 16), // "HH:mm"
        })),
      };
    });

    return { vets, totalPages, totalItems };
  }

  async findVetListEmergency(
    page = 1,
    volume = 10,
    query = "",
    filters,
    userLocation
  ) {
    const offset = (page - 1) * volume;
    const { timeOfDay, todayDate } = nowForSchedule(); // current day + current time
    const q = query?.trim();
    const timeIn1h = new Date(timeOfDay + 60 * 60 * 1000);


    console.log(filters);

    // --------- derive filters ---------
    const petTypes = filters.petTypes?.length ? filters.petTypes : undefined;

    // fee in DB = rupiah; UI dalam ribuan
    const feeMin = filters.feeRange ? filters.feeRange[0] * 1_000 : undefined;
    const feeMax = filters.feeRange ? filters.feeRange[1] * 1_000 : undefined;

    // --------- base WHERE (verified, non-deleted, future slots) ---------
    const where = {
      bookings: {
        none: {
          OR: [
            {
              bookingStatus: { in: ["ACCEPTED", "ONGOING"] },
              isDeleted: false,
              bookingDate: { equals: todayDate },
              bookingTime: { gte: timeOfDay, lt: timeIn1h },
            },
            {
              bookingStatus: { in: ["ACCEPTED", "ONGOING"] },
              isDeleted: false,
              bookingDate: { equals: todayDate },
              bookingType: "Emergency",
            },
          ],
        },
      },

      user: {
        is: {
          isDeleted: false,
          ...(q ? { fullName: { contains: q, mode: "insensitive" } } : {}),
        },
      },
      NOT: { price: 0, description: "" },
      verified: true,
      verifiedDate: { not: null },
      ...(feeMin != null || feeMax != null
        ? {
            price: {
              ...(feeMin != null ? { gte: feeMin } : {}),
              ...(feeMax != null ? { lte: feeMax } : {}),
            },
          }
        : {}),
      isAvailHomecare: true,
      isAvailEmergency: true,

      // Pet types (via Species -> SpeciesType)
      ...(petTypes
        ? {
            speciesHandled: {
              some: {
                speciesType: {
                  speciesName: {
                    in: petTypes,
                    mode: "insensitive",
                  },
                },
              },
            },
          }
        : {}),
    };

    // 1) fetch vets + next 3 slots (unsorted)
    const rows = await this._model.findMany({
      select: {
        id: true,
        userId: true,
        price: true,
        isAvailHomecare: true,
        user: {
          select: { profilePicture: true, fullName: true, locations: true },
        },
      },
      where,
    });

    // console.log(rows[0].user.locations[0]);

    const distancedRows = (
      await Promise.all(
        rows.map(async (vet) => {
          if (!vet.user?.locations?.length) return null;
          const loc = vet.user.locations[0];

          const { data } = await client.distancematrix({
            params: {
              key: process.env.GOOGLE_MAPS_API_KEY,
              origins: [loc.coordinates],
              destinations: [userLocation.coordinates],
              mode: "driving",
              units: "metric",
            },
          });

          const el = data.rows[0].elements[0];
          if (!el?.distance?.value) return null;

          return {
            ...vet,
            distance: el.distance, // meters
            duration: el.duration, // seconds
          };
        })
      )
    ).filter(Boolean);

    // sort by smallest distance (meters) ascending; undefined distances go last
    distancedRows.sort(
      (a, b) =>
        (a.distance?.value ?? Number.POSITIVE_INFINITY) -
        (b.distance?.value ?? Number.POSITIVE_INFINITY)
    );

    console.log(distancedRows);

    // (optional) filter by minRating AFTER we know ratings
    const candidateIds = distancedRows.map((v) => v.id);
    const ratingAgg = await this.#ratingRepository.findAverageRatingVets(
      candidateIds
    );
    const ratingMap = new Map(
      ratingAgg.map((r) => [
        r.vetId,
        {
          ratingAvg: r._avg.rating ?? 0,
          ratingCount: r._count._all,
        },
      ])
    );

    const minRating = filters.minRating ?? undefined;
    const rowsAfterRating = minRating
      ? distancedRows.filter((v) => {
          const agg = ratingMap.get(v.id);
          const avg = agg ? agg.ratingAvg : 0;
          return avg >= minRating;
        })
      : distancedRows;

    // 3) paginate AFTER sort (+ after rating filter)
    const totalItems = rowsAfterRating.length;
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / volume);
    const pageRows = rowsAfterRating.slice(offset, offset + volume);

    // 4) shape response
    const vets = pageRows.map((vet) => {
      const agg = ratingMap.get(vet.id) ?? { ratingAvg: 0, ratingCount: 0 };
      return {
        ...vet,
        ...vet.user,
        profilePicture:
          vet.user.profilePicture ||
          "https://res.cloudinary.com/daimddpvp/image/upload/v1758101764/default-profile-pic_lppjro.jpg",
        user: undefined,
        ratingCount: agg.ratingCount,
        ratingAvg: Math.round((agg.ratingAvg ?? 0) * 10) / 10,
      };
    });

    return { vets, totalPages, totalItems };
  }

  async findVetById(id, userLocation) {
    const row = await this._model.findUnique({
      select: {
        id: true,
        userId: true,
        sipNumber: true,
        isAvailHomecare: true,
        isAvailEmergency: true,
        price: true,
        description: true,
        user: {
          select: { profilePicture: true, fullName: true, locations: true },
        },
        speciesHandled: {
          select: {
            speciesType: {
              select: {
                speciesName: true,
              },
            },
          },
        },
      },
      where: {
        id: id,
        user: {
          isDeleted: false,
        },
      },
    });

    let el = null;

    if (userLocation != null) {
      const { data } = await client.distancematrix({
        params: {
          key: process.env.GOOGLE_MAPS_API_KEY,
          origins: [row.user.locations[0].coordinates],
          destinations: [userLocation.coordinates],
          mode: "driving",
          units: "metric",
        },
      });

      el = data.rows[0].elements[0];
    }

    const rating = await this.#ratingRepository.findAverageRatingVet(id);

    console.log(rating);

    const vet = {
      ...row,
      ...row.user,
      ratingAvg: rating[0] ? Math.round(rating[0]._avg.rating * 10) / 10 : 0,
      ratingCount: rating[0] ? rating[0]._count._all : 0,
      distance: el ? el.distance : undefined, // meters
      duration: el ? el.duration : undefined, // seconds
      profilePicture:
        row.user.profilePicture ||
        "https://res.cloudinary.com/daimddpvp/image/upload/v1758101764/default-profile-pic_lppjro.jpg",
      user: undefined,
      speciesHandled: row.speciesHandled.map((species) => {
        return species.speciesType.speciesName;
      }),
    };
    return vet;
  }

  async findVetsUnconfirmedCertificates(page = 0, volume = 10, query = "") {
    console.log(page, volume, query);
    const offset = (page - 1) * volume;

    const q = query?.trim();

    const where = {
      verified: false,
      verifiedDate: null,
      user: {
        is: {
          isDeleted: false,
          ...(q ? { fullName: { contains: q, mode: "insensitive" } } : {}),
        },
      }, // relation filter
    };

    const vets = await this._model.findMany({
      skip: offset,
      take: volume,
      include: { user: true },
      orderBy: {
        user: {
          createdAt: "asc",
        },
      },
      where,
    });
    const total = await this._model.count({ where });

    const totalPages = total === 0 ? 0 : Math.ceil(total / volume);

    const flattened = vets.map((vet) => ({
      ...vet,
      ...vet.user,
      user: undefined, // optional: remove nested user
    }));

    return { flattened, totalPages, totalItems: total };
  }

  async findVetByUserId(userId) {
    return this._model.findUnique({
      where: { userId: userId },
      include: {
        user: { include: { locations: true } },
        speciesHandled: { include: { speciesType: true } },
      },
    });
  }

  async findVetsConfirmedCertificates(page = 0, volume = 10, query = "") {
    const offset = (page - 1) * volume;
    const q = query?.trim();

    const where = {
      NOT: { verifiedDate: null },
      user: {
        is: {
          isDeleted: false,
          ...(q ? { fullName: { contains: q, mode: "insensitive" } } : {}),
        },
      }, // relation filter
    };

    const vets = await this._model.findMany({
      skip: offset,
      take: volume,
      include: { user: true },
      orderBy: { verifiedDate: "desc" },
      where,
    });

    const total = await this._model.count({ where });

    const totalPages = total === 0 ? 0 : Math.ceil(total / volume);

    const flattened = vets.map((vet) => ({
      ...vet,
      ...vet.user,
      user: undefined, // optional: remove nested user
    }));

    return { flattened, totalPages, totalItems: total };
  }

  async updateVetCertificateStatus(vetId, status) {
    return this._model.update({
      where: { userId: vetId },
      data: {
        verified: status,
        verifiedDate: new Date(),
      },
    });
  }

  async updateVetDetails(vet) {
    const updatedVet = await this._model.update({
      where: { id: vet.id },
      data: vet,
    });
    return updatedVet;
  }

  async countTotalPatients(userId) {
    const result = await this._model.findFirst({
      where: { userId: userId },
      select: {
        bookings: {
          distinct: ["petId"],
          select: {
            petId: true,
          },
        },
      },
    });
    return result.bookings.length;
  }

  async calculateTotalIncome(userId) {
    const result = await this._model.findFirst({
      where: { userId: userId },
      select: {
        bookings: {
          where: {
            bookingStatus: "DONE",
          },
          select: {
            bookingPrice: true,
          },
        },
      },
    });
    return result.bookings.reduce(
      (sum, booking) => sum + (booking.bookingPrice * 100) / 115,
      0
    );
  }

  async countUpcomingAppointments(userId) {
    const { timeOfDay } = nowForSchedule(); // current day + current time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = await this._model.findFirst({
      where: { userId: userId },
      select: {
        bookings: {
          where: {
            bookingStatus: { in: ["ACCEPTED", "ONGOING"] },
            OR: [
              { bookingDate: { gt: today } },
              {
                bookingDate: { equals: today },
                bookingTime: { gte: timeOfDay },
              },
            ],
          },
          select: {
            id: true,
          },
        },
      },
    });
    return result.bookings.length;
  }

  async countPendingAppointments(userId) {
    const result = await this._model.findFirst({
      where: { userId: userId },
      select: {
        bookings: {
          where: {
            bookingStatus: "PENDING",
          },
          select: {
            id: true,
          },
        },
      },
    });
    return result.bookings.length;
  }
}

module.exports = VetRepository;
