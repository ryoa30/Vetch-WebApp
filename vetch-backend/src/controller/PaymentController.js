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
        this.updatePaymentDetails = this.updatePaymentDetails.bind(this);
    }

    async updatePaymentDetails (req, res) { 
        try {
            const {bookingId, status, paymentMethod} = req.body;
            const updatedBooking = await this.#paymentRepository.updatePaymentByBookingId(bookingId, {paymentStatus: status, paymentMethod: paymentMethod});
            res.status(200).json({ok: true, data: updatedBooking, message: 'Booking status updated successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ok: false, message: 'Error updating booking status', error: error.message });
        }
    }
    

    async getTransactionToken(req, res) {
        try {
            const { bookingId } = req.body;
            
            const paymentData = await this.#paymentRepository.getPaymentByBookingId(bookingId);
            
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