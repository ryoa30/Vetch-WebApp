const BaseRepository = require('./BaseRepository');

class PaymentRepository extends BaseRepository {
    constructor() {
        super('Payment');
    }

    async findPaymentByBookingId(bookingId){
        return this._model.findUnique({
            where: { bookingId: bookingId },
        });
    }

    async findPaymentByOrderId(orderId){
        return this._model.findUnique({
            where: { orderId: orderId },
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