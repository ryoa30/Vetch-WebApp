const VetRepository = require('../repository/VetRepository');
const ScheduleRepository = require('../repository/ScheduleRepository');
const { hhmmToUTCDate, dateToHHMM } = require('../utils/dateUtils');

class VetController {
    #vetRepository;
    #scheduleRepository;

    constructor() {
        this.#scheduleRepository = new ScheduleRepository();
        this.#vetRepository = new VetRepository();

        this.createSchedule = this.createSchedule.bind(this);
        this.getVetListConsultation = this.getVetListConsultation.bind(this);
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
            const schedule = await this.#scheduleRepository.create({vetId, dayOfWeek: day,timeOfDay:timeDate});
            console.log(schedule);
            res.status(201).json({ok: true, data: {...schedule, timeDate: dateToHHMM(schedule.timeOfDay)}, message: 'Schedule created successfully'});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ok: false, message: 'Server Problem' });
        }
    }

    async getVetListConsultation(req, res) {
        try {
            const { page, volume, query} = req.query;
            const vets = await this.#vetRepository.findVetListConsultation(page, volume, query);
            res.status(200).json({ok: true, data: vets, message: 'Vet list fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching vet list', error: error.message });
        }
    }

    

    
}


module.exports = VetController;