const PetRepository = require('../repository/PetRepository');


class PetController {
    #petRepository;

    constructor() {
        this.#petRepository = new PetRepository();

        this.getPetsByUserId = this.getPetsByUserId.bind(this);
    }

    async getPetsByUserId(req, res) {
        try {
            const {userId} = req.params;
            const pets = await this.#petRepository.getPetsByUserId(userId);
            res.status(200).json({ok: true, data: pets, message: 'Pets fetched successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({ ok: false, message: 'Error fetching pets types', error: error.message });
        }
    }

}


module.exports = PetController;