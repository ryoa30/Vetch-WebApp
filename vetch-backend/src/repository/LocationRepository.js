const BaseRepository = require('./BaseRepository');

class LocationRepository extends BaseRepository {
    constructor() {
        super('Location');
    }

    async findLocationByUserId(userId) {
        return this._model.findFirst({ where: { userId, isDeleted: false } });
    }

    async updateLocationByUserId(userId, location) {
        return this._model.update({
            where: { userId },
            data: location,
        });
    }

}

module.exports = LocationRepository;