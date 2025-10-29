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

    async findByPetIds(petIds) {
        return this._model.findMany({ where: { user: { pets: { some: {id: {in: petIds}}}} }});
    }

    async findByBookingIds(bookingIds, role) {
        if(role === "vet"){
            return this._model.findMany({ where: { user: {pets: {some: {bookings: {some: {id:{in: bookingIds}}}}}} }});
        }else{
            return this._model.findMany({where: { user: {vetProfile: {bookings: {some: {id:{in: bookingIds}}}}}} });
        }
    }

}

module.exports = NotificationSubscriptionRepository;