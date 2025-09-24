const BaseRepository = require('./BaseRepository');

class PetRepository extends BaseRepository {
    constructor() {
        super('Pet');
    }

    async getPetsByUserId(userId) {
        return this._model.findMany({ where: { userId, isDeleted: false } });
    }

}

module.exports = PetRepository;