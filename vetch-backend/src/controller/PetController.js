const PetRepository = require("../repository/PetRepository");
const NotificationController = require('./NotificationController');

class PetController {
  #petRepository;
  #notificationController;

  constructor() {
    this.#petRepository = new PetRepository();
    this.#notificationController = new NotificationController();

    this.getPetsByUserId = this.getPetsByUserId.bind(this);
    this.getPetsByVetId = this.getPetsByVetId.bind(this);
    this.updatePetDetails = this.updatePetDetails.bind(this);
    this.softDeletePet = this.softDeletePet.bind(this);
    this.createPet = this.createPet.bind(this);
    this.dailyPetReminder = this.dailyPetReminder.bind(this);
  }

  async createPet(req, res) {
    try {
      const pet = req.body;
      console.log("Creating pet:", pet);
      const newPet = await this.#petRepository.create({...pet, petDob: new Date(pet.petDob)});
      res.status(201).json({
        ok: true,
        message: "Pet created successfully",
        data: newPet,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        message: "Error creating pet",
        error: error.message,
      });
    }
  }

  async softDeletePet(req, res) {
    try {
      const { petId } = req.params;

      console.log("Soft deleting pet with ID:", petId);

      const softDeletePet = await this.#petRepository.softDelete(petId);
      res.status(200).json({
        ok: true,
        message: "Pet soft deleted successfully",
        data: softDeletePet,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        message: "Error updating pet details",
        error: error.message,
      });
    }
  }

  async updatePetDetails(req, res) {
    try {
      const pet = req.body;

      console.log("Updating user:", pet);

      const updatedPet = await this.#petRepository.update(pet.id, pet);
      res.status(200).json({
        ok: true,
        message: "pet details updated successfully",
        data: updatedPet,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        message: "Error updating pet details",
        error: error.message,
      });
    }
  }

  async getPetsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const pets = await this.#petRepository.findPetsByUserId(userId);
      res
        .status(200)
        .json({ ok: true, data: pets, message: "Pets fetched successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        message: "Error fetching pets types",
        error: error.message,
      });
    }
  }

  async getPetsByVetId(req, res) {
    try {
      const { userId } = req.params;
      const vets = await this.#petRepository.findPetsByVetId(userId);
      res
        .status(200)
        .json({ ok: true, data: vets, message: "Pets fetched successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        message: "Error fetching pets based on vet",
        error: error.message,
      });
    }
  }

  async dailyPetReminder() {
    try {
      const reminderConsultationWeek = await this.#petRepository.findPetConsultationScheduleByPeriod(7);
      const reminderConsultation3Day = await this.#petRepository.findPetConsultationScheduleByPeriod(3);
      const reminderConsultationTomorrow = await this.#petRepository.findPetConsultationScheduleByPeriod(1);
      
      const reminderVaccinationWeek = await this.#petRepository.findPetVaccinationScheduleByPeriod(7);
      const reminderVaccination3Day = await this.#petRepository.findPetVaccinationScheduleByPeriod(3);
      const reminderVaccinationTomorrow = await this.#petRepository.findPetVaccinationScheduleByPeriod(1);

      if(reminderConsultationWeek.length > 0){
        await this.#notificationController.sendToPetOwners("DONE", reminderConsultationWeek.map(b => b.id), {title: "Your have a consultation schedule in 1 week", message: "Don't forget to prepare your pet's consultation"});
      }
      if(reminderConsultation3Day.length > 0){
        await this.#notificationController.sendToPetOwners("DONE", reminderConsultation3Day.map(b => b.id), {title: "Your have a consultation schedule in 3 Days", message: "Don't forget to prepare your pet's consultation"});
      }
      if(reminderConsultationTomorrow.length > 0){
        await this.#notificationController.sendToPetOwners("DONE", reminderConsultationTomorrow.map(b => b.id), {title: "Your have a consultation schedule Tomorrow", message: "Don't forget to prepare your pet's consultation"});
      }

      if(reminderVaccinationWeek.length > 0){
        await this.#notificationController.sendToPetOwners("DONE", reminderVaccinationWeek.map(b => b.id), {title: "Your have a vaccination schedule in 1 week", message: "Don't forget to prepare your pet's vaccination"});
      }
      if(reminderVaccination3Day.length > 0){
        await this.#notificationController.sendToPetOwners("DONE", reminderVaccination3Day.map(b => b.id), {title: "Your have a vaccination schedule in 3 Days", message: "Don't forget to prepare your pet's vaccination"});
      }
      if(reminderVaccinationTomorrow.length > 0){
        await this.#notificationController.sendToPetOwners("DONE", reminderVaccinationTomorrow.map(b => b.id), {title: "Your have a vaccination schedule Tomorrow", message: "Don't forget to prepare your pet's vaccination"});
      }

    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = PetController;
