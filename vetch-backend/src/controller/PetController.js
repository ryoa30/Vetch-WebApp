const PetRepository = require("../repository/PetRepository");

class PetController {
  #petRepository;

  constructor() {
    this.#petRepository = new PetRepository();

    this.getPetsByUserId = this.getPetsByUserId.bind(this);
    this.getPetsByVetId = this.getPetsByVetId.bind(this);
    this.updatePetDetails = this.updatePetDetails.bind(this);
    this.softDeletePet = this.softDeletePet.bind(this);
    this.createPet = this.createPet.bind(this);
    
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
}

module.exports = PetController;
