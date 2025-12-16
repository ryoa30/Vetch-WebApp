const BookingRepository = require('../repository/BookingRepository');
const RatingRepository = require('../repository/RatingRepository');
const ConcernDetailRepository = require('../repository/ConcernDetailRepository');
const ConcernTypeRepository = require('../repository/ConcernTypeRepository');
const NotificationController = require('./NotificationController');
const PetRepository = require('../repository/PetRepository');
const { hhmmToUTCDate, dateToHHMM, formatIsoJakartaShort } = require('../utils/dateUtils');


class BookingController {
    #bookingRepository;
    #concernDetailRepository;
    #concernTypeRepository;
    #ratingRepository;
    #notificationController;
    #petRepository;

    constructor() {
        this.#ratingRepository = new RatingRepository();
        this.#bookingRepository = new BookingRepository();
        this.#concernDetailRepository = new ConcernDetailRepository();
        this.#concernTypeRepository = new ConcernTypeRepository();
        this.#notificationController = new NotificationController();
        this.#petRepository = new PetRepository();

        this.getConcernTypes = this.getConcernTypes.bind(this);
        this.createBooking = this.createBooking.bind(this);
        this.createBookingRating = this.createBookingRating.bind(this);
        this.getBookingByUserIdDateTime = this.getBookingByUserIdDateTime.bind(this);
        this.putBookingStatus = this.putBookingStatus.bind(this);
        this.getBookingsByUserId = this.getBookingsByUserId.bind(this);
        this.getBookingByVetId = this.getBookingByVetId.bind(this);
        this.getPastBookingsByPetId = this.getPastBookingsByPetId.bind(this);
        this.syncBookings = this.syncBookings.bind(this);
        this.putConclussionDates = this.putConclussionDates.bind(this);
        this.getBookingById = this.getBookingById.bind(this);
    }

    async createBookingRating (req, res) {
        try {
            const {vetId, userId, bookingId, context, rating} = req.body;
            const newRating = await this.#ratingRepository.create({
                vetId,
                userId,
                bookingId,
                context,
                rating,
                ratingDate: new Date(),
            });
            res.status(201).json({ok: true, data: newRating, message: 'Rating created successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error rating booking', error: error.message });
        }
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
            const booking = await this.#bookingRepository.findBookingByUserIdDateTime(userId, bookingDate, bookingTime);
            res.status(200).json({ok: true, data: booking, message: 'Bookings fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching bookings', error: error.message });
        }
    }

    async getBookingById(req, res) {
        try {
            const {bookingId} = req.params;
            const booking = await this.#bookingRepository.findBookingById(bookingId);
            res.status(200).json({ok: true, data: booking, message: 'Booking fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching booking', error: error.message });
        }
    }

    async getBookingsByUserId(req, res) {
        try {
            const {userId, status, type} = req.query;
            const bookings = await this.#bookingRepository.findBookingsByUserId(userId, status, type);
            res.status(200).json({ok: true, data: bookings, message: 'Bookings fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching bookings', error: error.message });
        }
    }

    async getBookingByVetId(req, res) {
        try {
            const {userId, status, type, date} = req.query;
            const bookings = await this.#bookingRepository.findBookingByVetId(userId, status.split(","), type, date);
            res.status(200).json({ok: true, data: bookings, message: 'Bookings fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching bookings', error: error.message });
        }
    }

    async getPastBookingsByPetId(req, res){
        try {
            const {petId, vetId} = req.query;
            const bookings = await this.#bookingRepository.findPastBookingsByPetId(petId, vetId);
            res.status(200).json({ok: true, data: bookings, message: 'Bookings fetched successfully'});
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
            console.log(newBooking);

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

    async putBookingStatus (req, res) { 
        try {
            const {id, status} = req.body;
            const updatedBooking = await this.#bookingRepository.update(id, {bookingStatus: status});
            console.log(updatedBooking);
            if(status === "PENDING") {
                this.#notificationController.sendToVets([updatedBooking.vetId], {title:`You have a new ${updatedBooking.bookingType} booking request on ${formatIsoJakartaShort(updatedBooking.bookingDate)} at ${dateToHHMM(updatedBooking.bookingTime)}`});
            }else if(status === "ACCEPTED") {
                this.#notificationController.sendToPetOwners(status,[updatedBooking.petId], {title:`Your booking has been accepted by the vet for ${formatIsoJakartaShort(updatedBooking.bookingDate)} at ${dateToHHMM(updatedBooking.bookingTime)}`});
            }else if(status === "CANCELLED") {
                this.#notificationController.sendToPetOwners(status,[updatedBooking.petId], {title:`Your ${updatedBooking.bookingType} booking has been cancelled`});
                this.#notificationController.sendToVets([updatedBooking.vetId], {title:`The booking for ${formatIsoJakartaShort(updatedBooking.bookingDate)} at ${dateToHHMM(updatedBooking.bookingTime)} has been cancelled`});
            }else if(status === "DONE") {
                this.#notificationController.sendToPetOwners(status,[updatedBooking.petId], {title:`Your ${updatedBooking.bookingType} booking has been done`});
                this.#notificationController.sendToVets([updatedBooking.vetId], {title:`The booking for ${formatIsoJakartaShort(updatedBooking.bookingDate)} at ${dateToHHMM(updatedBooking.bookingTime)} has been done`});
            }else if(status === "ONGOING") {
                this.#notificationController.sendToPetOwners(status,[updatedBooking.petId], {title:`Your ${updatedBooking.bookingType} booking for ${formatIsoJakartaShort(updatedBooking.bookingDate)} at ${dateToHHMM(updatedBooking.bookingTime)} is now ongoing`});
                this.#notificationController.sendToVets([updatedBooking.vetId], {title:`The booking for ${formatIsoJakartaShort(updatedBooking.bookingDate)} at ${dateToHHMM(updatedBooking.bookingTime)} is now ongoing`});
            }
            res.status(200).json({ok: true, data: updatedBooking, message: 'Booking status updated successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ok: false, message: 'Error updating booking status', error: error.message });
        }
    }

    async putConclussionDates (req, res) { 
        try {
            const {id, conclusion, consultationDate, vaccineDate} = req.body;
            const updatedBooking = await this.#bookingRepository.update(id, {bookingConclusion: conclusion});
            if(consultationDate || vaccineDate){
                await this.#petRepository.update(updatedBooking.petId, {reminderConsultationDate: consultationDate ? new Date(consultationDate) : null, reminderVaccineDate: vaccineDate ? new Date(vaccineDate) : null});
            }
            console.log(updatedBooking);
            res.status(200).json({ok: true, data: updatedBooking, message: 'Booking status updated successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ok: false, message: 'Error updating booking status', error: error.message });
        }
    }

    async syncBookings() {
        try {
            console.log("Syncing bookings...");
            const bookings30Minute = await this.#bookingRepository.findBookingByIntervalStatusType(30);
            const bookings15Minute = await this.#bookingRepository.findBookingByIntervalStatusType(15);
            const bookings5Minute = await this.#bookingRepository.findBookingByIntervalStatusType(5);
            const bookingsStart = await this.#bookingRepository.findBookingByIntervalStatusType(1, ["ACCEPTED", "ONGOING"]);
            if (bookings30Minute.length > 0) {
                const vetIds = bookings30Minute.filter(item => item.bookingStatus != "PAYMENT").map(b => b.vetId);
                if(vetIds.length > 0){
                    this.#notificationController.sendToVets(vetIds, {title: "You have a booking in under 30 minutes, please prepare"});
                    this.#notificationController.sendToUsers("ACCEPTED",bookings30Minute.filter(item => item.bookingStatus !== "PAYMENT").map(b => b.pet.userId), {title: "Your booking is in under 30 minutes, please prepare"});
                }
                if(bookings30Minute.filter(item => item.bookingStatus == "PAYMENT").length > 0){
                    this.#notificationController.sendToUsers("PAYMENT",bookings30Minute.filter(item => item.bookingStatus == "PAYMENT").map(b => b.pet.userId), {title: "You have a booking pending payment, please complete your payment to proceed"});
                }
            }
            if(bookings15Minute.length > 0) {
                const vetIds = bookings15Minute.filter(item => item.bookingStatus != "PAYMENT").map(b => b.vetId);
                this.#notificationController.sendToVets(vetIds, {title: "You have a booking in under 15 minutes, please prepare"});
                this.#notificationController.sendToUsers("ACCEPTED",bookings15Minute.map(b => b.pet.userId), {title: "Your booking is in under 15 minutes, please prepare"});
                if(bookings30Minute.filter(item => item.bookingStatus == "PAYMENT").length > 0){
                    this.#notificationController.sendToUsers("PAYMENT",bookings5Minute.filter(item => item.bookingStatus == "PAYMENT").map(b => b.pet.userId), {title: "You have a booking pending payment, please complete your payment to proceed"});
                }
            }
            if(bookings5Minute.length > 0) {
                const vetIds = bookings5Minute.filter(item => item.bookingStatus != "PAYMENT").map(b => b.vetId);
                this.#notificationController.sendToVets(vetIds, {title: "You have a booking in under 5 minutes, please prepare"});
                this.#notificationController.sendToUsers("ACCEPTED",bookings5Minute.map(b => b.pet.userId), {title: "Your booking is in under 5 minutes, please prepare"});
                if(bookings30Minute.filter(item => item.bookingStatus == "PAYMENT").length > 0){
                    this.#notificationController.sendToUsers("PAYMENT",bookings5Minute.filter(item => item.bookingStatus == "PAYMENT").map(b => b.pet.userId), {title: "You have a booking pending payment, please complete your payment to proceed"});
                }
            }
            if(bookingsStart.length > 0) {
                const bookingIds = bookingsStart.filter(item => item.bookingStatus == "ACCEPTED").map(b => b.id);
                const vetIds = bookingsStart.map(b => b.vetId);
                await this.#bookingRepository.updateBookingsStatus(bookingIds, "ONGOING");
                this.#notificationController.sendToVets(vetIds, {title: "Your booking is starting now, please begin the consultation"});
                this.#notificationController.sendToUsers("ONGOING",bookingsStart.map(b => b.pet.userId), {title: "Your booking is starting now, please begin the consultation"});
            }

            const expiredBooking = await this.#bookingRepository.findExpiredBooking();
            console.log("Expired bookings:", expiredBooking);
            if (expiredBooking.length > 0) {
                const bookingIds = expiredBooking.map(b => b.id);
                await this.#bookingRepository.updateBookingsStatus(bookingIds, "CANCELLED");
                this.#notificationController.sendToUsers("CANCELLED",expiredBooking.map(b => b.pet.userId), {title: "Your booking has expired"});
            }

            const finishedBooking = await this.#bookingRepository.findFinishedOngoingBooking();
            console.log("Finished bookings:", finishedBooking);
            if (finishedBooking.length > 0) {
                const bookingIds = finishedBooking.map(b => b.id);
                await this.#bookingRepository.updateBookingsStatus(bookingIds, "DONE");
                this.#notificationController.sendToUsers("DONE",finishedBooking.map(b => b.pet.userId), {title: "Your booking has ended"});
                this.#notificationController.sendToVets(finishedBooking.map(b => b.vetId), {title: "Your booking has ended"});
            }
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = BookingController;