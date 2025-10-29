const BaseRepository = require('./BaseRepository');

class SpeciesTypeRepository extends BaseRepository {
    constructor() {
        super('SpeciesType');
    }

}

module.exports = SpeciesTypeRepository;