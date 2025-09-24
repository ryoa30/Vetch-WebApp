const ConcernTypeRepository = require('../repository/ConcernTypeRepository');


class BookingController {
    #concernTypeRepository;

    constructor() {
        this.#concernTypeRepository = new ConcernTypeRepository();

        this.getConcernTypes = this.getConcernTypes.bind(this);
    }

    async getConcernTypes(req, res) {
        try {
            const concernTypes = await this.#concernTypeRepository.findAll();
            res.status(200).json({ok: true, data: concernTypes, message: 'Concern types fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching concern types', error: error.message });
        }
    }

}


module.exports = BookingController;