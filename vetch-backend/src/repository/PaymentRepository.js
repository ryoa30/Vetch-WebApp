const BaseRepository = require('./BaseRepository');

class PaymentRepository extends BaseRepository {
    constructor() {
        super('Payment');
    }

     async findaymentByBookingId(bookingId){
        return this._model.findUnique({
            where: { bookingId: bookingId },
        });
    }
    async updatePaymentByBookingId(bookingId, data){
        return this._model.update({
            where: { bookingId: bookingId },
            data,
        });
    }

}

module.exports = PaymentRepository