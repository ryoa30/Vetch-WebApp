const BaseRepository = require('./BaseRepository');

class SpeciesRepository extends BaseRepository {
    constructor() {
        super('Species');
    }

}

module.exports = SpeciesRepository;