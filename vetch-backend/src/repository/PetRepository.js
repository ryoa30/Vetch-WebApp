const BaseRepository = require('./BaseRepository');

class PetRepository extends BaseRepository {
    constructor() {
        super('Pet');
    }

    async findPetsByUserId(userId) {
        return this._model.findMany({ where: { userId, isDeleted: false } });
    }

    async findPetsByVetId(userId) {
        return this._model.findMany({where: {bookings: {some: {vet: {userId}}}, isDeleted: false } });
    }

    async findPetConsultationScheduleByPeriod(period) {
        const startDate = new Date(`${new Date().toISOString().split("T")[0]}T00:00:00.000Z`);
        startDate.setDate(startDate.getDate() + period);
        const endDate = new Date(`${startDate.toISOString().split("T")[0]}T23:59:59.999Z`);
        console.log(startDate, endDate);
        const pets = await this._model.findMany({
            where: {
                reminderConsultationDate: {
                    gte: startDate,
                    lte: endDate,
                },
                isDeleted: false,
            }
        });
        return pets;
    }
    
    async findPetVaccinationScheduleByPeriod(period) {
        const startDate = new Date(`${new Date().toISOString().split("T")[0]}T00:00:00.000Z`);
        startDate.setDate(startDate.getDate() + period);
        const endDate = new Date(`${startDate.toISOString().split("T")[0]}T23:59:59.999Z`);
        console.log(startDate, endDate);
        const pets = await this._model.findMany({
            where: {
                reminderVaccineDate: {
                    gte: startDate,
                    lte: endDate,
                },
                isDeleted: false,
            }
        });
        return pets;
    }
}

module.exports = PetRepository;