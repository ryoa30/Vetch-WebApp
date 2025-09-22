const { nowForSchedule } = require("../utils/dateUtils");
const BaseRepository = require("./BaseRepository");
const RatingRepository = require("./RatingRepository");

class VetRepository extends BaseRepository {
  #ratingRepository;
  constructor() {
    super("Vet");
    this.#ratingRepository = new RatingRepository();

    this.findVetListConsultation = this.findVetListConsultation.bind(this);
  }

  async findVetsCards(options = {}) {
    return this._model.findMany(options);
  }

  async findVetListConsultation(page = 1, volume = 10, query = "") {
    const offset = (page - 1) * volume;
    const { weekday, timeOfDay } = nowForSchedule();
    const q = query?.trim();

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
      schedules: {
        some: {
          isDeleted: false,
          OR: [
            { dayNumber: weekday, timeOfDay: { gt: timeOfDay } }, // later today
            { dayNumber: { gt: weekday } }, // any future day
          ],
        },
      },
    };

    // 1) fetch vets + next 3 slots (unsorted by next slot)
    const rows = await this._model.findMany({
      select: {
        id: true,
        userId: true,
        price: true,
        user: { select: { profilePicture: true, fullName: true } },
        schedules: {
          take: 3,
          where: {
            OR: [
              { dayNumber: weekday, timeOfDay: { gt: timeOfDay } }, // later today
              { dayNumber: { gt: weekday } }, // any future day
            ],
            isDeleted: false,
          },
          orderBy: [{ dayNumber: "asc" }, { timeOfDay: "asc" }],
          select: { id: true, dayNumber: true, timeOfDay: true },
        },
      },
      where,
    });

    // 2) sort by soonest upcoming slot (same logic you had)
    rows.sort((a, b) => {
      const A = a.schedules[0];
      const B = b.schedules[0];
      if (!A && !B) return 0;
      if (!A) return 1;
      if (!B) return -1;
      if (A.dayNumber !== B.dayNumber) return A.dayNumber - B.dayNumber;
      return A.timeOfDay.getTime() - B.timeOfDay.getTime();
    });

    // 3) paginate AFTER sort
    const pageRows = rows.slice(offset, offset + volume);

    // 4) aggregate ratings for the vets on this page
    const vetIds = pageRows.map((v) => v.id);
    const ratingAgg = await this.#ratingRepository.getAverageRatingVets(vetIds);

    // build a map: vetId -> { avg, count }
    const ratingMap = new Map(
      ratingAgg.map((r) => [
        r.vetId,
        {
          ratingAvg: r._avg.rating ?? 0,
          ratingCount: r._count._all,
        },
      ])
    );

    // 5) total for pagination
    const total = await this._model.count({ where });
    const totalPages = total === 0 ? 0 : Math.ceil(total / volume);

    // 6) shape response + format time to "HH:mm"
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
        ratingAvg: Math.round(agg.ratingAvg * 10) / 10, // 1 decimal (e.g., 4.3)
        schedules: vet.schedules.map((s) => ({
          ...s,
          timeOfDay: s.timeOfDay.toISOString().slice(11, 16),
        })),
      };
    });

    return { vets, totalPages, totalItems: total };
  }

  async findVetById(id) {
    const row = await this._model.findUnique({
      select: {
        id: true,
        userId: true,
        sipNumber: true,
        isAvailHomecare: true,
        isAvailEmergency: true,
        price: true,
        description: true,
        user: { select: { profilePicture: true, fullName: true } },
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

    const rating = await this.#ratingRepository.getAverageRatingVet(id);

    console.log(rating);

    const vet = {
      ...row,
      ...row.user,
      ratingAvg: rating[0] ? Math.round(rating[0]._avg.rating * 10) / 10 : 0,
      ratingCount: rating[0] ? rating[0]._count._all : 0,
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
}

module.exports = VetRepository;
