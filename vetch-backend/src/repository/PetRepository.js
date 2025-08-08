const BaseRepository = require('./BaseRepository');

class PetRepository extends BaseRepository {
    constructor() {
        super('Pet');
    }

}

module.exports = PetRepository;