const BaseRepository = require('./BaseRepository');

class LocationRepository extends BaseRepository {
    constructor() {
        super('Location');
    }

    async findLocationByUserId(userId) {
        return this._model.findFirst({ where: { userId, isDeleted: false } });
    }

}

module.exports = LocationRepository;