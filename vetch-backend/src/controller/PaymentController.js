const midtransClient = require('midtrans-client');
const PaymentRepository = require('../repository/PaymentRepository');
const { randomUUID } = require('crypto');

class PaymentController {
    #snap;
    #paymentRepository;

    constructor() {
        this.#snap = new midtransClient.Snap({
            // Set to true if you want Production Environment (accept real transaction).
            isProduction : false,
            serverKey : process.env.MIDTRANS_SERVER_KEY,
            clientKey : process.env.MIDTRANS_CLIENT_KEY
        });;

        this.#paymentRepository = new PaymentRepository();

        this.getTransactionToken = this.getTransactionToken.bind(this);
        this.putPaymentDetails = this.putPaymentDetails.bind(this);
        this.refundTransaction = this.refundTransaction.bind(this);
    }

    async putPaymentDetails (req, res) { 
        try {
            const {bookingId, status, paymentMethod, transactionId} = req.body;
            const updatedBooking = await this.#paymentRepository.updatePaymentByBookingId(bookingId, {paymentStatus: status, paymentMethod: paymentMethod, transactionId: transactionId});
            res.status(200).json({ok: true, data: updatedBooking, message: 'Booking status updated successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ok: false, message: 'Error updating booking status', error: error.message });
        }
    }

    async refundTransaction (req, res) {
        try {
            const { bookingId, reason } = req.body;
            const paymentData = await this.#paymentRepository.findPaymentByBookingId(bookingId);

            if(!paymentData) {
                return res.status(404).json({ok: false, message: 'Payment data not found for the given bookingId'});
            }
            const url = `https://api.sandbox.midtrans.com/v2/${paymentData.transactionId}/refund`;
            const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: 'Basic TWlkLXNlcnZlci1tX2pKZ0Z0eWZlMUlXemkzMDJ6bmFuWi06TWlkLWNsaWVudC1BSXdnOTQ1dDRlS081QVRP'
            },
            body: JSON.stringify({refund_key: paymentData.id, amount: paymentData.grossAmount, reason: reason})
            };

            const result = await fetch(url, options);
            await this.#paymentRepository.updatePaymentByBookingId(bookingId, {paymentStatus: "REFUNDED"});
            console.log(result);
            res.status(200).json({ok: true, data: result, message: 'Refund processed successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ok: false, message: 'Error processing refund', error: error.message });
        }
    }
    


    async getTransactionToken(req, res) {
        try {
            const { bookingId } = req.body;
            
            const paymentData = await this.#paymentRepository.findPaymentByBookingId(bookingId);
            
            if(paymentData) {
                return res.status(200).json({ok: true, data: paymentData.paymentToken, message: 'Midtrans Token successfully retrieved'});
            }

            const {totalPrice, serviceType, basePrice, user} = req.body;
            
            const uuid = randomUUID();
            console.log(uuid);

            const parameter = {
                "transaction_details": {
                    "order_id": uuid,
                    "gross_amount": totalPrice
                },
                "credit_card":{
                    "secure" : true
                },
                "customer_details": {
                    "first_name": user.fullName.split(" ")[0],
                    "last_name": user.fullName.split(" ")[1],
                    "email": user.email,
                },
                "item_details": 
                [
                    {
                        "id": serviceType + "Consultation",
                        "price": basePrice,
                        "name": serviceType + " Consultation",
                        "quantity": 1
                    },
                    {
                        "id": "Tax",
                        "price": basePrice * 0.1,
                        "name": "Tax",
                        "quantity": 1
                    },
                    {
                        "id": "Service Fee",
                        "price": basePrice * 0.05,
                        "name": "Service Fee",
                        "quantity": 1
                    },
                ]
            };

            let transactionToken = await this.#snap.createTransactionToken(parameter);

            await this.#paymentRepository.create({
                bookingId: bookingId,
                grossAmount: totalPrice,
                orderId: uuid,
                paymentToken: transactionToken,
                paymentMethod: "",
                paymentStatus: "PENDING",
                paymentDate: new Date(),
            })

            console.log('transactionToken:',transactionToken);

            res.status(200).json({ok: true, data: transactionToken, message: 'Midtrans Token successfully retrieved'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching pets types', error: error.message });
        }
    }

}


module.exports = PaymentController;