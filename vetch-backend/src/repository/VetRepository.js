const BaseRepository = require('./BaseRepository');

class VetRepository extends BaseRepository {
    constructor() {
        super('Vet');
    }

    async findVetsCards(options = {}) {
        return this._model.findMany(options);
    }

}

module.exports = VetRepository;