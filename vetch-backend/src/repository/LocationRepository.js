const BaseRepository = require('./BaseRepository');

class LocationRepository extends BaseRepository {
    constructor() {
        super('Location');
    }

}

module.exports = LocationRepository;