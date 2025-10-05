const BaseRepository = require("./BaseRepository");

class BookingRepository extends BaseRepository {
  constructor() {
    super("Booking");
  }

  async findBookingByUserIdDateTime(userId, bookingDate, bookingTime) {
    const start = new Date(`${bookingDate}T00:00:00.000Z`);
    const end = new Date(`${bookingDate}T23:59:59.999Z`);
    const bookingTimeDate = new Date(`1970-01-01T${bookingTime}:00.000Z`);
    console.log(userId, bookingDate, bookingTimeDate);
    const result = await this._model.findFirst({
        where: {
            pet: {
                userId: userId
            },
            isDeleted: false,
            bookingDate: { gte: start, lte: end },
            bookingTime: bookingTimeDate,
            bookingStatus: { notIn: ["CANCELLED"] }
        },
        orderBy: { bookingTime: "asc" },
    })
    console.log(result);
    return result;
  }


  async findBookingsByUserId(userId, status, type) {
    const where = {
      pet: {
        userId: userId,
      },
      isDeleted: false,
      bookingStatus: status
        ? status
        : { in: ["PAYMENT", "PENDING", "ACCEPTED", "ONGOING", "DONE", "CANCELLED"] },
      bookingType: type ? type : { in: ["Online", "Homecare"] },
    };

    const bookings = await this._model.findMany({
      where,
      orderBy: [ {bookingDate: "desc"}, {bookingTime: "desc"} ],
      include: {
        pet: true,
        vet: {
          include: {
            user: true,
          }
        },
      }
    });

    return bookings;

  }

  async findBookingByVetIdAndDate(vetId, bookingDate) {
    const start = new Date(`${bookingDate}T00:00:00.000Z`);
    const end = new Date(`${bookingDate}T23:59:59.999Z`);

    const bookings = await this._model.findMany({
      where: {
        vetId,
        isDeleted: false,
        bookingDate: { gte: start, lte: end },
        // optionally exclude cancelled statuses if you have them:
        bookingStatus: { notIn: ["CANCELLED"] }
      },
      select: { bookingTime: true },
    });

    return bookings;
  }

  async findBookingByVetId(userId, status, type, date) {
    const start =date? new Date(`${date}T00:00:00.000Z`): undefined;
    const end = date?new Date(`${date}T23:59:59.999Z`):undefined;
    const where = {
      vet:{
        userId: userId,
      },
      isDeleted: false,
      bookingStatus: status.length > 0
        ? {in: status}
        : { in: ["PAYMENT", "PENDING", "ACCEPTED", "ONGOING", "DONE", "CANCELLED"] },
      bookingType: type ? type : { in: ["Online", "Homecare"] },
      bookingDate: { gte: start, lte: end },
      ...(date
        ? {
            bookingDate: { gte: start, lte: end },
          }
        : {})
    };

    console.log(where);
    console.log(start, end);

    const bookings = await this._model.findMany({
      where,
      orderBy: [ {bookingDate: "desc"}, {bookingTime: "desc"} ],
      include: {
        pet: {
          include: {
            user: true,
          }
        },
        vet: {
          include: {
            user: true,
          }
        },
        concernDetails: {
          include: {
            concern: true,
          }
        },
      }
    });

    return bookings;
  }

  async findPastBookingsByPetId(petId, vetId){
    const bookings = await this._model.findMany({
      where:  {
        petId,
        bookingStatus: { in: ["DONE"] },
        ...(vetId
          ? {
              vetId,
            }
          : {})
      },
      include: {
        concernDetails: {
          include: {
            concern: true,
          }
        },
      }
    })

    return bookings;
  }
}


module.exports = BookingRepository;
