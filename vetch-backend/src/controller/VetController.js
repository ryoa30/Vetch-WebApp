const VetRepository = require('../repository/VetRepository');
const LocationRepository = require('../repository/LocationRepository');
const ScheduleRepository = require('../repository/ScheduleRepository');
const RatingRepository = require('../repository/RatingRepository');
const SpeciesRepository = require('../repository/SpeciesRepository');
const SpeciesTypeRepository = require('../repository/SpeciesTypeRepository');
const { hhmmToUTCDate, dateToHHMM } = require('../utils/dateUtils');

class VetController {
    #vetRepository;
    #scheduleRepository;
    #ratingRepository;
    #locationRepository;
    #speciesTypeRepository;
    #speciesRepository;

    constructor() {
        this.#scheduleRepository = new ScheduleRepository();
        this.#vetRepository = new VetRepository();
        this.#ratingRepository = new RatingRepository();
        this.#locationRepository = new LocationRepository();
        this.#speciesRepository = new SpeciesRepository();
        this.#speciesTypeRepository = new SpeciesTypeRepository();

        this.createSchedule = this.createSchedule.bind(this);
        this.getVetListConsultation = this.getVetListConsultation.bind(this);
        this.getVetDetailsById = this.getVetDetailsById.bind(this);
        this.getVetRatings = this.getVetRatings.bind(this);
        this.getVetSchedulesByDayAndId = this.getVetSchedulesByDayAndId.bind(this);
        this.getVetListEmergency = this.getVetListEmergency.bind(this);
        this.getVetByUserId = this.getVetByUserId.bind(this);
        this.putVetDetails = this.putVetDetails.bind(this);
        this.getAllSpeciesTypes = this.getAllSpeciesTypes.bind(this);
        this.addVetSpeciesType = this.addVetSpeciesType.bind(this);
        this.deleteSpecies = this.deleteSpecies.bind(this);
        this.getVetSchedulesUserIdDay = this.getVetSchedulesUserIdDay.bind(this);
        this.putSchedule = this.putSchedule.bind(this);
        this.deleteSchedule = this.deleteSchedule.bind(this);
        this.putVetHomecareEmergency = this.putVetHomecareEmergency.bind(this);
        this.getVetStats = this.getVetStats.bind(this);
    }


    async createSchedule(req, res) {
        try {
            const { userId, day, time} = req.body;
            const vetId = (await this.#vetRepository.findVetId(userId)).id;
            const invalidSchedule = await this.#scheduleRepository.findInvalidSchedule(vetId, day, time);
            console.log("Invalid Schedule", invalidSchedule);
            if (invalidSchedule) {
                return res.status(400).json({ok: false, message: 'Schedule conflict detected' });
            }
            const timeDate = hhmmToUTCDate(time);
            const schedule = await this.#scheduleRepository.create({vetId, dayNumber: Number(day),timeOfDay:timeDate});
            console.log(schedule);
            res.status(201).json({ok: true, data: {...schedule, timeDate: dateToHHMM(schedule.timeOfDay)}, message: 'Schedule created successfully'});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ok: false, message: 'Server Problem' });
        }
    }

    async putSchedule(req, res) {
        try {
            const { id, userId, day, time} = req.body;
            const vetId = (await this.#vetRepository.findVetId(userId)).id;
            const invalidSchedule = await this.#scheduleRepository.findInvalidSchedule(vetId, day, time);
            console.log("Invalid Schedule", invalidSchedule);
            if (invalidSchedule) {
                return res.status(400).json({ok: false, message: 'Schedule conflict detected' });
            }
            const timeDate = hhmmToUTCDate(time);
            const schedule = await this.#scheduleRepository.update(id, {dayNumber: Number(day),timeOfDay:timeDate});
            console.log(schedule);
            res.status(201).json({ok: true, data: {...schedule, timeDate: dateToHHMM(schedule.timeOfDay)}, message: 'Schedule created successfully'});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ok: false, message: 'Server Problem' });
        }
    }

    async deleteSchedule(req, res) {
        try {
            const { id } = req.params;
            const schedule = await this.#scheduleRepository.delete(id);
            console.log(schedule);
            res.status(201).json({ok: true, data: schedule, message: 'Schedule deleted successfully'});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ok: false, message: 'Server Problem' });
        }
    }

    async getVetStats(req, res) {
        try {
            const { userId } = req.params;
            const totalPatients = await this.#vetRepository.countTotalPatients(userId);
            const totalIncome = await this.#vetRepository.calculateTotalIncome(userId);
            const upcomingAppointment = await this.#vetRepository.countUpcomingAppointments(userId);
            const pendingAppointment = await this.#vetRepository.countPendingAppointments(userId);
            res.status(200).json({ok: true, data: { totalPatients, totalIncome, upcomingAppointment, pendingAppointment }, message: 'Vet stats fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching vet stats', error: error.message });
        }
    }

    async addVetSpeciesType(req, res) {
        try {
            const { vetId, speciesTypeId } = req.body;
            const species = await this.#speciesRepository.create({vetId, speciesTypeId});
            res.status(201).json({ok: true, data: species, message: 'Species type added to vet successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error adding species type to vet', error: error.message });
        }
    }

    async deleteSpecies(req, res) {
        try {
            const { speciesId } = req.query;
            const species = await this.#speciesRepository.delete(speciesId);
            res.status(201).json({ok: true, data: species, message: 'Species deleted successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error deleting species type to vet', error: error.message });
        }
    }

    async getAllSpeciesTypes(req, res){
        try {
            const speciesTypes = await this.#speciesTypeRepository.findAll();
            res.status(200).json({ok: true, data: speciesTypes, message: 'Species types fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching species types', error: error.message });
        }
    }

    async getVetListConsultation(req, res) {
        try {
            const { page, volume, query, filters} = req.body;
            const vets = await this.#vetRepository.findVetListConsultation(Number(page), Number(volume), query, filters);
            res.status(200).json({ok: true, data: vets, message: 'Vet list fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching vet list', error: error.message });
        }
    }

    async getVetListEmergency(req, res) {
        try {
            const { page, volume, query, filters, userId} = req.body;
            const location = await this.#locationRepository.findLocationByUserId(userId);
            console.log(location);
            const vets = await this.#vetRepository.findVetListEmergency(Number(page), Number(volume), query, filters, location);
            res.status(200).json({ok: true, data: vets, message: 'Vet list fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching vet list', error: error.message });
        }
    }
    
    async getVetDetailsById(req, res) {
        try {
            const {id} = req.params;
            const {userId} = req.query;
            console.log(userId);
            let location = null;
            if(userId){
                location = await this.#locationRepository.findLocationByUserId(userId);
            }
            console.log(location);
            const vet = await this.#vetRepository.findVetById(id, location);
            res.status(200).json({ok: true, data: vet, message: 'Vet details fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching vet', error: error.message });
        }
    }

    async getVetByUserId(req, res) {
        try {
            const {userId} = req.params;
            const vet = await this.#vetRepository.findVetByUserId(userId);
            res.status(200).json({ok: true, data: vet, message: 'Vet details fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching vet', error: error.message });
        }
    }

    async getVetRatings(req,res){
        try {
            const {id} = req.params;
            const vet = await this.#ratingRepository.findVetRatings(id);
            res.status(200).json({ok: true, data: vet, message: 'Vet ratings fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching vet', error: error.message });
        }
    }
    
    async getVetSchedulesByDayAndId(req, res) {
        try {
            const {id, day, bookingDate} = req.query;
            const schedules = await this.#scheduleRepository.findVetSchedulesByDayAndId(id, day, bookingDate);
            res.status(200).json({ok: true, message: "Success fetching vet schedule", data: schedules})
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching vet Schedules', error: error.message })
        }
    }

    async getVetSchedulesUserIdDay(req, res) {
        try {
            const {userId, day} = req.query;
            const schedules = await this.#scheduleRepository.findVetShcedulesUserIdDay(userId, day);
            res.status(200).json({ok: true, message: "Success fetching vet schedule", data: schedules})
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching vet Schedules', error: error.message })
        }
    }

    async putVetDetails(req, res) {
        try {
            const {vet} = req.body;
            console.log(vet);
            const updatedVet = await this.#vetRepository.updateVetDetails(vet);
            res.status(200).json({ok: true, data: updatedVet, message: 'Vet details updated successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error updating vet', error: error.message });
        }
    }

    async putVetHomecareEmergency(req, res) {
        try {
            const {isAvailableHomecare, isAvailableEmergency, userId} = req.body;
            const vetId = (await this.#vetRepository.findVetId(userId)).id;
            const updatedVet = await this.#vetRepository.update(vetId, {isAvailableHomecare, isAvailableEmergency});
            res.status(200).json({ok: true, data: updatedVet, message: 'Vet details updated successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error updating vet', error: error.message });
        }
    }

}


module.exports = VetController;