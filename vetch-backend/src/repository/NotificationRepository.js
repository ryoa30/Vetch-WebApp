const BaseRepository = require('./BaseRepository');

class NotificationRepository extends BaseRepository {
    constructor() {
        super('Notification');
    }

}

module.exports = NotificationRepository;