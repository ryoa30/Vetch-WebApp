const midtransClient = require('midtrans-client');
const { randomUUID } = require('crypto');

class MidtransController {
    #snap;

    constructor() {
        this.#snap = new midtransClient.Snap({
            // Set to true if you want Production Environment (accept real transaction).
            isProduction : false,
            serverKey : process.env.MIDTRANS_SERVER_KEY,
            clientKey : process.env.MIDTRANS_CLIENT_KEY
        });;

        this.getTransactionToken = this.getTransactionToken.bind(this);
    }

    async getTransactionToken(req, res) {
        try {
            const {totalPrice, user} = req.body;
            const uuid = randomUUID();
            console.log(uuid);

            let parameter = {
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
                }
            };

            let transactionToken = await this.#snap.createTransactionToken(parameter);
            console.log('transactionToken:',transactionToken);

            res.status(200).json({ok: true, data: transactionToken, message: 'Midtrans Token successfully retrieved'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching pets types', error: error.message });
        }
    }

}


module.exports = MidtransController;