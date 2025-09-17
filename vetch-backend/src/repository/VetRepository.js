const { nowForSchedule } = require("../utils/dateUtils");
const BaseRepository = require("./BaseRepository");

class VetRepository extends BaseRepository {
  constructor() {
    super("Vet");
  }

  async findVetsCards(options = {}) {
    return this._model.findMany(options);
  }

  async findVetListConsultation(page = 1, volume = 10, query = "") {
    const offset = (page - 1) * volume;

    const { weekday, timeOfDay } = nowForSchedule();

    console.log(weekday, timeOfDay);

    const q = query?.trim();

    const where = {
      user: {
        is: {
          isDeleted: false,
          ...(q ? { fullName: { contains: q, mode: "insensitive" } } : {}),
        },
      },
      NOT: {price: 0, description: ""},
      verified: true,
      verifiedDate: { not: null },
      schedules: {
        some: {
          isDeleted: false,
          dayOfWeek: weekday, // only today's schedules
          timeOfDay: { gt: timeOfDay }, // strictly after "now" (clock time)
        },
      },
    };
    const rows = await this._model.findMany({
      skip: offset,
      take: volume,
      orderBy: { verifiedDate: "desc" },
      select: {
        id: true,
        userId: true,
        price: true,
        user: {
          select: {
            fullName: true,
          }
        },
        // ...your fields
        schedules: {
          take: 3,
          where: {
            dayOfWeek: weekday,
            timeOfDay: { gt: timeOfDay },
            isDeleted: false,
          },
          orderBy: { timeOfDay: "asc" },
          select: { id: true, dayOfWeek: true, timeOfDay: true },
        },
      },
      where,
    });

    const vets = rows.map((vet) => {
      return {
        ...vet,
        ...vet.user,
        user:undefined,
        schedules: vet.schedules.map((s) => {
          return {
            ...s,
            timeOfDay: s.timeOfDay.toISOString().slice(11, 16), // convert Date to "HH:mm"
          }
        })
      }
    })

    console.log(vets);

    return vets;
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
