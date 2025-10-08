"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Cat, Dog, Plus, ChevronRight } from "lucide-react";
import { PetDialog } from "./component/newPetDialog";
import { useSession } from "@/contexts/SessionContext";
import { PetService } from "@/lib/services/PetService";
import { snakeCase } from "lodash";
import { ageFromDob, formatAge } from "@/lib/utils/formatDate";
import OverlayPetDetail from "./component/OverlayPetDetail";
import { useLoading } from "@/contexts/LoadingContext";

export default function PetsPage() {
  const [showPetDialog, setShowPetDialog] = useState(false);
  const [showPetDetails, setShowPetDetails] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any | null>(null);

  // Store pets in local state
  // const [pets, setPets] = useState<PetDetailsData[]>([
  //   {
  //     name: "Lorensius",
  //     gender: "female",
  //     species: "Cat",
  //     neutered: false,
  //     age: "3 years old",
  //     weight: "3 Kg",
  //     color: "Black",
  //     medicalHistory: [
  //       { date: "23 Apr 2025 at 08:00", issue: "Flea and Tick, Ear Infection", type: "Online Consultation" },
  //       { date: "22 Apr 2025 at 10:00", issue: "Diarrhea", type: "Homecare" },
  //     ],
  //     schedule: [
  //       { description: "Constant Checkup", vet: "Dr. Seemore", interval: "Every 6 Month" },
  //     ],
  //   },
  //   {
  //     name: "Seemore",
  //     gender: "male",
  //     species: "Dog",
  //     neutered: true,
  //     age: "4 years old",
  //     weight: "10 Kg",
  //     color: "Brown",
  //     medicalHistory: [],
  //     schedule: [],
  //   },
  // ]);

  const [pets, setPets] = useState<any[]>([]);
  const { user } = useSession();
  const petService = new PetService();
  const {setIsLoading} = useLoading();

  const loadPets = async () => {
    setIsLoading(true);
    try {
      const results = await petService.fetchPetsByUserId(user?.id || "");
      console.log(results);
      setPets(results.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadPets();
  }, []);

  const handleShowDetails = (pet: any) => {
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
              <img
                src={`/img/pet-logo/${snakeCase(pet.speciesName)}.png`}
                alt="Pet"
                className="rounded-xl w-[60px] h-[60px] mr-2"
              />
              <div>
                <p className="font-semibold">
                  {pet.petName}{" "}
                  <span className="font-normal text-gray-600">
                    | {pet.speciesName}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  {formatAge(ageFromDob(pet.petDob))}
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-500" />
          </div>
        ))}

        {pets.length === 0 && (
          <p className="text-center text-gray-500">You have no pets added yet.</p>
        )}

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
        onSubmit={()=>window.location.reload()}
      />

      {/* Pet Details Dialog */}
      {selectedPet && (
        <OverlayPetDetail
          open={showPetDetails}
          data={selectedPet}
          onClose={() => setShowPetDetails(false)}
        />
      )}
    </div>
  );
}
