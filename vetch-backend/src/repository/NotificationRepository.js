const BaseRepository = require('./BaseRepository');

class NotificationRepository extends BaseRepository {
    constructor() {
        super('Notification');
    }

    async findUnconfirmedByUserId(userId) {
        return this._model.findMany({
            where: {
                userId: userId,
                confirmed: false,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateAllNotifications(userId) {
        return this._model.updateMany({
            where: {
                userId: userId,
                confirmed: false,
            },
            data: { confirmed: true },
        });
    }
}

module.exports = NotificationRepository;