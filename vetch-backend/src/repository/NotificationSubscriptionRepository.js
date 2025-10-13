const BaseRepository = require('./BaseRepository');

class NotificationSubscriptionRepository extends BaseRepository {
    constructor() {
        super('NotificationSubscription');
    }

    async findSubscriptionByEndpointId(endpoint) {
        return this._model.findFirst({ where: { endpoint } });
    }

    async findByUserIds(userIds) {
        return this._model.findMany({ where: { userId: { in: userIds } } });
    }

    async findByVetIds(vetIds) {
        return this._model.findMany({ where: { user: { vetProfile: { id: {in: vetIds}}} }});
    }

}

module.exports = NotificationSubscriptionRepository;