"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import OverlayPetDetails from "@/app/vet/components/overlay/OverlayPetDetails"; // pakai overlay kamu

// --- Tipe Data ---
interface HistoryItem {
  date: string;
  desc: string;
  type: string;
}

interface PetData {
  name: string;
  gender: string;
  species: string;
  neuter: string;
  age: string;
  weight: string;
  color: string;
  medicalHistory?: HistoryItem[];
}

// --- Data Hewan ---
const petsData: PetData[] = [
  {
    name: "Lorensius",
    gender: "Male",
    species: "Cat",
    neuter: "Yes",
    age: "3 Y/O",
    weight: "4 kg",
    color: "Gray",
    medicalHistory: [
      { date: "12/01/2025", desc: "Vaccination", type: "Check-up" },
    ],
  },
  {
    name: "Seemore",
    gender: "Male",
    species: "Dog",
    neuter: "No",
    age: "4 Y/O",
    weight: "15 kg",
    color: "Brown",
    medicalHistory: [
      { date: "10/02/2025", desc: "Ear Infection", type: "Treatment" },
    ],
  },
  {
    name: "Seeless",
    gender: "Female",
    species: "Dog",
    neuter: "Yes",
    age: "2 Y/O",
    weight: "10 kg",
    color: "White",
    medicalHistory: [
      { date: "03/03/2025", desc: "Vaccination", type: "Check-up" },
    ],
  },
  {
    name: "Hoppy",
    gender: "Male",
    species: "Rabbit",
    neuter: "No",
    age: "1 Y/O",
    weight: "2 kg",
    color: "Gray",
    medicalHistory: [
      { date: "15/03/2025", desc: "Fever Treatment", type: "Check-up" },
    ],
  },
  {
    name: "Hippy",
    gender: "Female",
    species: "Rabbit",
    neuter: "Yes",
    age: "1 Y/O",
    weight: "2.1 kg",
    color: "White",
    medicalHistory: [
      { date: "20/03/2025", desc: "Nail Trim", type: "Care" },
    ],
  },
  {
    name: "Smiles",
    gender: "Male",
    species: "Reptile",
    neuter: "No",
    age: "1 Y/O",
    weight: "1 kg",
    color: "Green",
    medicalHistory: [
      { date: "11/03/2025", desc: "Skin Shedding", type: "Observation" },
    ],
  },
];

export default function PatientsPage() {
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔍 Filter pasien berdasarkan nama atau species
  const filteredPets = petsData.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Input
          placeholder="Search for Patients"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-[500px] mt-3 md:mt-0 rounded-full bg-white border-none text-black placeholder:text-gray-500"
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
            className="flex items-center justify-between bg-[#A3D1C6] rounded-lg px-2 py-3 cursor-pointer hover:bg-[#8EB9AD] transition"
          >
            <div className="flex items-center gap-3">
              <Image
                src={`/img/vet/${pet.species.toLowerCase()}.png`}
                alt={pet.species}
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <p className="font-semibold text-sm">
                  {pet.name} | {pet.species}
                </p>
                <p className="text-xs text-gray-800">{pet.age}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-black" />
          </div>
        ))}

        {filteredPets.length === 0 && (
          <p className="text-center text-sm text-gray-700 mt-4">
            No patients found
          </p>
        )}
      </div>

      {/* Overlay detail */}
      <OverlayPetDetails
        open={openDetail}
        onClose={handleClose}
        data={selectedPet}
      />
    </div>
  );
}
