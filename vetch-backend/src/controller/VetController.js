const VetRepository = require('../repository/VetRepository');
const ScheduleRepository = require('../repository/ScheduleRepository');
const RatingRepository = require('../repository/RatingRepository');
const { hhmmToUTCDate, dateToHHMM } = require('../utils/dateUtils');

class VetController {
    #vetRepository;
    #scheduleRepository;
    #ratingRepository;

    constructor() {
        this.#scheduleRepository = new ScheduleRepository();
        this.#vetRepository = new VetRepository();
        this.#ratingRepository = new RatingRepository();

        this.createSchedule = this.createSchedule.bind(this);
        this.getVetListConsultation = this.getVetListConsultation.bind(this);
        this.getVetDetailsById = this.getVetDetailsById.bind(this);
        this.getVetRatings = this.getVetRatings.bind(this);
        this.getVetSchedulesByDayAndId = this.getVetSchedulesByDayAndId.bind(this);
        this.getVetListEmergency = this.getVetListEmergency.bind(this);
    }


    async createSchedule(req, res) {
        try {
            const { vetId, day, time} = req.body;
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
            const { page, volume, query, filters} = req.body;
            const vets = await this.#vetRepository.findVetListEmergency(Number(page), Number(volume), query, filters);
            res.status(200).json({ok: true, data: vets, message: 'Vet list fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching vet list', error: error.message });
        }
    }
    
    async getVetDetailsById(req, res) {
        try {
            const {id} = req.params;
            const vet = await this.#vetRepository.findVetById(id);
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
}


module.exports = VetController;