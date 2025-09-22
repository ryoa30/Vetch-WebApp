const VetRepository = require("../repository/VetRepository");


class AdminController {
    #vetRepository;
    
    constructor() {
        this.#vetRepository = new VetRepository();

        this.getUncomfirmedVetCertificates = this.getUncomfirmedVetCertificates.bind(this);
        this.getComfirmedVetCertificates = this.getComfirmedVetCertificates.bind(this);
        this.changeVetCertificateStatus = this.changeVetCertificateStatus.bind(this);
    
    }

    async getUncomfirmedVetCertificates(req, res) {
        const {page, volume, query} = req.query;
        
        const vets = await this.#vetRepository.findVetsUnconfirmedCertificates(page, Number(volume), query);

        console.log(vets);

        res.status(200).json({ok: true, message: 'Success', data: vets});
    
    }
    
    async getComfirmedVetCertificates(req, res) {
        const {page, volume, query} = req.query;
        
        const vets = await this.#vetRepository.findVetsConfirmedCertificates(page, Number(volume), query);

        console.log(vets);

        res.status(200).json({ok: true, message: 'Success', data: vets});
    
    }

    async changeVetCertificateStatus(req, res) {
        const {vetId, status} = req.body;

        console.log(vetId, status);

        if (typeof vetId === 'undefined' || typeof status === 'undefined') {
            return res.status(400).json({ok: false, message: 'vetId and status are required'});
        }

        const result = await this.#vetRepository.updateVetCertificateStatus(vetId, status);
        console.log(result);
        res.status(200).json({ok: true, message: 'Success', data: result});
    }
}

module.exports = AdminController;