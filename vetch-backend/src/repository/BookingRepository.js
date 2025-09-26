const BaseRepository = require("./BaseRepository");

class BookingRepository extends BaseRepository {
  constructor() {
    super("Booking");
  }

  async retrieveBookingByUserIdDateTime(userId, bookingDate, bookingTime) {
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


  async getBookingsByUserId(userId, status, type) {
    const where = {
      userId,
      isDeleted: false,
      bookingStatus: status
        ? status
        : { in: ["Pending", "Confirmed", "Completed", "Cancelled"] },
      bookingType: type ? type : { in: ["Consultation", "Hospitalization"] },
    };
  }

  async getBookingByVetIdAndDate(vetId, bookingDate) {
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
}

module.exports = BookingRepository;
