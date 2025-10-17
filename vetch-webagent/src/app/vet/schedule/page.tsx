"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import OverlayPetDetails from "@/app/vet/components/overlay/OverlayPetDetails";

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

interface Appointment {
  time: string;
  type: string;
  pet: PetData;
  section: "today" | "upcoming";
}

// --- Data Dipisah ---
const appointmentsData: Appointment[] = [
  {
    section: "today",
    time: "10:00 AM",
    type: "Online Consultation",
    pet: {
      name: "Aryo",
      gender: "Male",
      species: "Dog",
      neuter: "Yes",
      age: "3 years",
      weight: "15 kg",
      color: "Brown",
      medicalHistory: [
        { date: "12/03/2025", desc: "Vaccination", type: "Check-up" },
      ],
    },
  },
  {
    section: "today",
    time: "10:30 AM",
    type: "Homecare",
    pet: {
      name: "Aryo",
      gender: "Female",
      species: "Cat",
      neuter: "No",
      age: "2 years",
      weight: "4 kg",
      color: "White",
      medicalHistory: [
        { date: "10/03/2025", desc: "Fever Treatment", type: "Homecare" },
      ],
    },
  },
  {
    section: "upcoming",
    time: "13/05/2025, 1:00 PM",
    type: "Online Consultation",
    pet: {
      name: "Aryo",
      gender: "Female",
      species: "Cat",
      neuter: "No",
      age: "2 years",
      weight: "4 kg",
      color: "White",
      medicalHistory: [
        { date: "09/03/2025", desc: "Diarrhea", type: "Online Consultation" },
      ],
    },
  },
  {
    section: "upcoming",
    time: "13/05/2025, 3:00 PM",
    type: "Online Consultation",
    pet: {
      name: "Aryo",
      gender: "Male",
      species: "Rabbit",
      neuter: "Yes",
      age: "1 year",
      weight: "2 kg",
      color: "Gray",
      medicalHistory: [
        { date: "01/03/2025", desc: "Vaccination", type: "Check-up" },
      ],
    },
  },
  {
    section: "upcoming",
    time: "14/05/2025, 9:00 AM",
    type: "Homecare",
    pet: {
      name: "Aryo",
      gender: "Male",
      species: "Reptile",
      neuter: "No",
      age: "4 years",
      weight: "1.5 kg",
      color: "Green",
      medicalHistory: [
        { date: "10/02/2025", desc: "Skin Issue", type: "Homecare" },
      ],
    },
  },
  {
    section: "upcoming",
    time: "15/05/2025, 9:00 AM",
    type: "Online Consultation",
    pet: {
      name: "Aryo",
      gender: "Male",
      species: "Hamster",
      neuter: "No",
      age: "1 year",
      weight: "0.1 kg",
      color: "Golden",
      medicalHistory: [
        { date: "15/03/2025", desc: "Allergy Check", type: "Online Consultation" },
      ],
    },
  },
];

export default function HistoryPage() {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null);

  const handleOpenDetail = (pet: PetData) => {
    setSelectedPet(pet);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedPet(null);
  };

  // 🔍 Filter berdasarkan section
  const todayAppointments = appointmentsData.filter(a => a.section === "today");
  const upcomingAppointments = appointmentsData.filter(a => a.section === "upcoming");

  return (
    <div className="p-6 bg-[#A3D1C6] min-h-screen text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Vet Schedules</h1>
        <Input
          placeholder="Search for Appointments"
          className="w-full md:w-[500px] mt-3 md:mt-0 rounded-full bg-white border-none text-black placeholder:text-gray-500"
        />
      </div>

      {/* Bone divider */}
      <div className="w-full flex justify-center mb-10">
        <Image
          src="/img/bone.png"
          alt="Bone Divider"
          width={800}
          height={30}
          className="object-contain"
        />
      </div>

      {/* Today’s Appointments */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-5">Today’s Appointments</h2>

        {todayAppointments.map((item, i) => (
          <div
            key={i}
            onClick={() => handleOpenDetail(item.pet)}
            className={`flex justify-between items-center cursor-pointer hover:opacity-90 ${
              i > 0 ? "mt-4" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Image
                src={`/img/vet/${item.pet.species.toLowerCase()}.png`}
                alt={item.pet.species}
                width={40}
                height={40}
              />
              <div>
                <p className="font-semibold">
                  {item.pet.species} - {item.pet.name}
                </p>
                <p className="text-sm text-gray-700">{item.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{item.type}</p>
              <ChevronRight size={18} className="text-black" />
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-b border-black my-8" />

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold mb-5">Upcoming Appointments</h2>

        {upcomingAppointments.map((item, i) => (
          <div
            key={i}
            onClick={() => handleOpenDetail(item.pet)}
            className={`flex justify-between items-center hover:opacity-90 cursor-pointer ${
              i > 0 ? "mt-4" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Image
                src={`/img/vet/${item.pet.species.toLowerCase()}.png`}
                alt={item.pet.species}
                width={40}
                height={40}
              />
              <div>
                <p className="font-semibold">
                  {item.pet.species} - {item.pet.name}
                </p>
                <p className="text-sm text-gray-700">{item.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{item.type}</p>
              <ChevronRight size={18} className="text-black" />
            </div>
          </div>
        ))}
      </div>

      {/* Overlay Pet Detail */}
      <OverlayPetDetails
        open={openDetail}
        onClose={handleCloseDetail}  
        data={selectedPet}
      />
    </div>
  );
}
