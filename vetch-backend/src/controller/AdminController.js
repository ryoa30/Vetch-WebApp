const VetRepository = require("../repository/VetRepository");
const NotificationController = require("./NotificationController");

class AdminController {
    #vetRepository;
    #notificationController;
    
    constructor() {
        this.#vetRepository = new VetRepository();
        this.#notificationController = new NotificationController();

        this.getUncomfirmedVetCertificates = this.getUncomfirmedVetCertificates.bind(this);
        this.getComfirmedVetCertificates = this.getComfirmedVetCertificates.bind(this);
        this.putVetCertificateStatus = this.putVetCertificateStatus.bind(this);
        
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

    async putVetCertificateStatus(req, res) {
        const {vetId, status} = req.body;

        console.log(vetId, status);

        if (typeof vetId === 'undefined' || typeof status === 'undefined') {
            return res.status(400).json({ok: false, message: 'vetId and status are required'});
        }

        const result = await this.#vetRepository.updateVetCertificateStatus(vetId, status);
        console.log(result);
        this.#notificationController.sendToVets([vetId], {title: `Your vet certificate has been ${status ? 'approved' : 'rejected'}`});
        res.status(200).json({ok: true, message: 'Success', data: result});
    }
}

module.exports = AdminController;