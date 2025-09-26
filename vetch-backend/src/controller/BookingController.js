const BookingRepository = require('../repository/BookingRepository');
const ConcernDetailRepository = require('../repository/ConcernDetailRepository');
const ConcernTypeRepository = require('../repository/ConcernTypeRepository');
const { hhmmToUTCDate } = require('../utils/dateUtils');


class BookingController {
    #bookingRepository;
    #concernDetailRepository;
    #concernTypeRepository;

    constructor() {
        this.#bookingRepository = new BookingRepository();
        this.#concernDetailRepository = new ConcernDetailRepository();
        this.#concernTypeRepository = new ConcernTypeRepository();

        this.getConcernTypes = this.getConcernTypes.bind(this);
        this.createBooking = this.createBooking.bind(this);
        this.getBookingByUserIdDateTime = this.getBookingByUserIdDateTime.bind(this);
        this.updateBookingStatus = this.updateBookingStatus.bind(this);
    }

    async getConcernTypes(req, res) {
        try {
            const concernTypes = await this.#concernTypeRepository.findAll();
            res.status(200).json({ok: true, data: concernTypes, message: 'Concern types fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching concern types', error: error.message });
        }
    }

    async getBookingByUserIdDateTime(req, res) {
        try {
            const {userId, bookingDate, bookingTime} = req.query;
            const booking = await this.#bookingRepository.retrieveBookingByUserIdDateTime(userId, bookingDate, bookingTime);
            res.status(200).json({ok: true, data: booking, message: 'Bookings fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching bookings', error: error.message });
        }
    }

    async createBooking (req,res) {
        try {
            const {vetId, petId, locationId, illnessDescription, bookingDate, bookingTime, bookingPrice, bookingType, concerns} = req.body;
            const newBooking = await this.#bookingRepository.create({
                vetId,
                petId,
                locationId,
                illnessDescription,
                bookingDate: new Date(bookingDate),
                bookingTime: hhmmToUTCDate(bookingTime),
                bookingPrice,
                bookingStatus: 'PAYMENT',
                bookingType
            });

            const insertedConcerns = [];

            if (concerns && concerns.length > 0) {
                
                concerns.map(async (concern) => {
                    console.log("Concern", concern);
                    const newConcern = await this.#concernDetailRepository.create({
                        bookingId: newBooking.id,
                        concernId: concern.id,
                    });
                    insertedConcerns.push(newConcern);
                });
            }

            res.status(201).json({ok: true, data: newBooking, message: 'Booking created successfully'});

        } catch (error) {
            console.log(error);
            res.status(500).json({ok: false, message: 'Error creating booking', error: error.message });
        }
    }

    async updateBookingStatus (req, res) { 
        try {
            const {id, status} = req.body;
            const updatedBooking = await this.#bookingRepository.update(id, {bookingStatus: status});
            res.status(200).json({ok: true, data: updatedBooking, message: 'Booking status updated successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ok: false, message: 'Error updating booking status', error: error.message });
        }
    }
}


module.exports = BookingController;