const BaseRepository = require('./BaseRepository');

class BookingRepository extends BaseRepository {
    constructor() {
        super('Booking');
    }

}

module.exports = BookingRepository