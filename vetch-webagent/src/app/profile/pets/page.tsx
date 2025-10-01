"use client";

import Image from "next/image";
import { useState } from "react";
import { Cat, Dog, Plus, ChevronRight } from "lucide-react";
import { PetDialog, PetFormData } from "./component/newPetDialog";
import { PetDetailsDialog, PetDetailsData } from "./component/petDetailDialog";

export default function PetsPage() {
  const [showPetDialog, setShowPetDialog] = useState(false);
  const [showPetDetails, setShowPetDetails] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetDetailsData | null>(null);

  // Store pets in local state
  const [pets, setPets] = useState<PetDetailsData[]>([
    {
      name: "Lorensius",
      gender: "female",
      species: "Cat",
      neutered: false,
      age: "3 years old",
      weight: "3 Kg",
      color: "Black",
      medicalHistory: [
        { date: "23 Apr 2025 at 08:00", issue: "Flea and Tick, Ear Infection", type: "Online Consultation" },
        { date: "22 Apr 2025 at 10:00", issue: "Diarrhea", type: "Homecare" },
      ],
      schedule: [
        { description: "Constant Checkup", vet: "Dr. Seemore", interval: "Every 6 Month" },
      ],
    },
    {
      name: "Seemore",
      gender: "male",
      species: "Dog",
      neutered: true,
      age: "4 years old",
      weight: "10 Kg",
      color: "Brown",
      medicalHistory: [],
      schedule: [],
    },
  ]);

  const handleAddPet = (data: PetFormData) => {
    const newPet: PetDetailsData = {
      ...data,
      age: "0 years old", // TODO: calculate from dob if needed
      weight: `${data.weight} Kg`,
      medicalHistory: [],
      schedule: [],
    };

    setPets((prev) => [...prev, newPet]);
    setShowPetDialog(false);
  };

  const handleShowDetails = (pet: PetDetailsData) => {
    setSelectedPet(pet);
    setShowPetDetails(true);
  };

  return (
    <div className="min-h-screen bg-[#fcffe5] w-full flex flex-col items-center py-10">
      {/* Title */}
      <h1 className="text-3xl font-bold text-green-900 mb-4">Pets</h1>

      {/* Bone divider */}
      <div className="w-full flex justify-center mb-8">
        <Image
          src="/img/bone.png"
          alt="Bone Divider"
          width={600}
          height={200}
          className="object-contain"
        />
      </div>

      {/* Pets List Card */}
      <div className="w-4/5 bg-white rounded-xl shadow-lg p-6">
        {pets.map((pet, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-4 border-b hover:bg-gray-100 rounded-md mt-2 cursor-pointer"
            onClick={() => handleShowDetails(pet)}
          >
            <div className="flex items-center gap-3">
              {pet.species.toLowerCase() === "cat" ? (
                <Cat className="w-8 h-8 text-gray-700" />
              ) : (
                <Dog className="w-8 h-8 text-gray-700" />
              )}
              <div>
                <p className="font-semibold">
                  {pet.name}{" "}
                  <span className="font-normal text-gray-600">| {pet.species}</span>
                </p>
                <p className="text-sm text-gray-500">{pet.age}</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-500" />
          </div>
        ))}

        {/* Add Pet */}
        <button
          className="flex items-center justify-center gap-2 py-4 w-full text-lg font-semibold text-gray-700 hover:bg-gray-100 rounded-md mt-2"
          onClick={() => setShowPetDialog(true)}
        >
          <Plus className="w-6 h-6" />
          Add a Pet
        </button>
      </div>

      {/* Add Pet Dialog */}
      <PetDialog
        show={showPetDialog}
        onClose={() => setShowPetDialog(false)}
        onSubmit={handleAddPet}
      />

      {/* Pet Details Dialog */}
      {selectedPet && (
        <PetDetailsDialog
          show={showPetDetails}
          onClose={() => setShowPetDetails(false)}
          onSave={() => alert("Edit feature coming soon")}
          onDelete={() => alert("Delete feature coming soon")}
          data={selectedPet}
        />
      )}
    </div>
  );
}
