const { nowForSchedule } = require("../utils/dateUtils");
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
        concernDetails: {
          include: {
            concern: true,
          }
        },
        payment: true,
        rating: true,
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
      bookingType: type ? type : { in: ["Online", "Homecare", "Emergency"] },
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

  
  async findBookingByIntervalStatusType(interval, status){
    const { timeOfDay } = nowForSchedule();
    const startDate = new Date(`${new Date().toISOString().split("T")[0]}T00:00:00.000Z`);
    const endDate = new Date(`${new Date().toISOString().split("T")[0]}T23:59:59.999Z`);
    
    const start = new Date(`1970-01-01T${new Date(timeOfDay.getTime() + (interval-1) * 60 * 1000).toISOString().split("T")[1]}`);
    const end = new Date(`1970-01-01T${new Date(timeOfDay.getTime() + interval * 60 * 1000).toISOString().split("T")[1]}`);

    const bookings = await this._model.findMany({
      where:{
        bookingDate: { gte: startDate, lte: endDate },
        bookingTime: { gt: start, lte: end },
        bookingStatus: status? {in: status}: { in: ["PAYMENT", "PENDING", "ACCEPTED", "ONGOING"] },
      },
      include:{
        pet: true,
        vet: true
      }
    })

    return bookings;
  }

  async findFinishedOngoingBooking(){
    const { timeOfDay } = nowForSchedule();
    
    const startDate = new Date(`${new Date().toISOString().split("T")[0]}T00:00:00.000Z`);
    const endDate = new Date(`${new Date().toISOString().split("T")[0]}T23:59:59.999Z`);
    
    const baselineDate = new Date(`1970-01-01T${new Date(timeOfDay.getTime() - (40) * 60 * 1000).toISOString().split("T")[1]}`);

    const bookings = await this._model.findMany({
      where:{
        bookingDate: { gte: startDate, lte: endDate },
        bookingTime: { lt: baselineDate },
        bookingStatus: { in: ["ONGOING"] },
        bookingType: { in: ["Online"] },
      },
      include:{
        pet: true,
        vet: true
      }
    })

    return bookings;
  }

  async findExpiredBooking(){
    const { timeOfDay } = nowForSchedule();
    const endDate = new Date(`${new Date().toISOString().split("T")[0]}T23:59:59.999Z`);
    
    const start = new Date(`1970-01-01T${timeOfDay.toISOString().split("T")[1]}`);

    const bookings = await this._model.findMany({
      where:{
        bookingDate: { lte: endDate },
        bookingTime: { lt: start },
        bookingStatus: { in: ["PAYMENT", "PENDING", "ONGOING"] },
        bookingType: { in: ["Online"] },
      },
      include:{
        pet: true,
        vet: true
      }
    })

    return bookings;
  }

  async updateBookingsStatus(bookingIds, status){
    const result = await this._model.updateMany({
      where:{
        id: { in: bookingIds },
        isDeleted: false,
      },
      data:{
        bookingStatus: status,
      }
    })
    return result;
  }
}


module.exports = BookingRepository;
