const BaseRepository = require('./BaseRepository');

class VetRepository extends BaseRepository {
    constructor() {
        super('Vet');
    }

}

module.exports = VetRepository;