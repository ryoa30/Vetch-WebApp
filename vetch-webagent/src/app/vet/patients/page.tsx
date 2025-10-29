"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import OverlayPetDetails from "@/app/vet/components/overlay/OverlayPetDetails"; // pakai overlay kamu
import { useLoading } from "@/contexts/LoadingContext";
import { PetService } from "@/lib/services/PetService";
import { useSession } from "@/contexts/SessionContext";
import { capitalize, snakeCase } from "lodash";
import { ageFromDob, formatAge } from "@/lib/utils/formatDate";
import { PetData } from "@/app/types";


export default function PatientsPage() {
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null);
  const [pets, setPets] = useState<PetData[]>([]);
  const [filteredPets, setFilteredPets] = useState<PetData[]>([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { setIsLoading } = useLoading();
  const petService = new PetService();
  const { user } = useSession();

  // 🔍 Filter pasien berdasarkan nama atau species

  const loadPets = async () => {
    setIsLoading(true);
    try {
      const result = await petService.fetchPetsByVetId(user?.id);
      console.log(result);
      if (result.ok) {
        setPets(result.data);
        setFilteredPets(result.data);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadPets();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredPets(
        pets.filter(
          (p) =>
            p.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.speciesName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }else{
      setFilteredPets(pets);
    }
  }, [searchTerm]);

  const handleOpenDetail = (pet: PetData) => {
    setSelectedPet(pet);
    setOpenDetail(true);
  };

  const handleClose = () => {
    setOpenDetail(false);
    setSelectedPet(null);
  };

  return (
    <div className="p-6 bg-[#A3D1C6] dark:bg-[#71998F] min-h-screen text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-white">Patients</h1>
        <input
          placeholder="Search for Patients"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-[500px] mt-3 md:mt-0 rounded-full bg-white border-none py-2 px-4 text-black placeholder:text-gray-500"
        />
      </div>

      {/* Bone divider */}
      <div className="w-full flex justify-center mb-6">
        <Image
          src="/img/bone.png"
          alt="Bone Divider"
          width={1000}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Pet List */}
      <div className="space-y-3">
        {filteredPets.map((pet, idx) => (
          <div
            key={idx}
            onClick={() => handleOpenDetail(pet)}
            className="flex items-center justify-between dark:text-white rounded-lg px-2 py-3 cursor-pointer hover:bg-[#8EB9AD] transition"
          >
            <div className="flex items-center gap-3">
              <Image
                src={`/img/pet-logo/${snakeCase(pet.speciesName)}.png`}
                alt={pet.speciesName}
                width={60}
                height={60}
                className="object-contain dark:invert"
              />
              <div>
                <p className="font-semibold text-base">
                  {capitalize(pet.petName)} | {pet.speciesName}
                </p>
                <p className="text-sm">{formatAge(ageFromDob(pet.petDob))}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-black dark:text-white" />
          </div>
        ))}

        {filteredPets.length === 0 && (
          <p className="text-center text-sm text-gray-700 mt-4">
            No patients found
          </p>
        )}
      </div>

      {/* Overlay detail */}
      {openDetail && selectedPet && 
        <OverlayPetDetails
          open={openDetail}
          onClose={handleClose}
          data={selectedPet}
        />
      }
    </div>
  );
}
