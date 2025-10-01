"use client";

import {
  ChevronRight,
  Users,
  DollarSign,
  CalendarCheck,
  Clock,
} from "lucide-react";
import { useState } from "react";
import Calendar from "./components/Calendar"; 
import OverlayPetDetail from "../components/overlay/OverlayPetDetail";
import OverlayLiveChat from "../components/overlay/OverlayLiveChat";
import ChatDialogBox from "@/app/alert-dialog-box/ChatDialogBox";

// Definisikan tipe data untuk konsistensi
interface HistoryItem {
  date: string;
  desc: string;
  type: string;
}

interface PetData {
  name: string;
  gender: string;
  species: string;
  neuter: string; // Dipisah dari species
  age: string;
  weight: string;
  color: string;
  medicalHistory?: HistoryItem[];
  myHistory?: HistoryItem[]; // 'myHistory' seringkali juga opsional
}

interface Appointment {
  pet: string;
  time: string;
  type: string;
  details: PetData;
}

const stats = [
  { title: "Registered Patient", value: "25", icon: Users },
  { title: "Total Income", value: "$ 2,000", icon: DollarSign },
  { title: "Upcoming Appointment", value: "10", icon: CalendarCheck },
  { title: "Pending Appointment", value: "2", icon: Clock },
];

// Perbaiki struktur data agar sesuai dengan interface PetData
const appointments: Appointment[] = [
  {
    pet: "Dog - Aryo",
    time: "10:00 AM",
    type: "Online Consultation",
    details: {
      name: "Aryo",
      gender: "Male",
      species: "Dog", // Diperbaiki
      neuter: "Neutered", // Diperbaiki
      age: "5 years old",
      weight: "12 Kg",
      color: "Brown",
      medicalHistory: [
        { date: "23 Apr 2025 08:00", desc: "Skin Allergy", type: "Online Consultation" },
        { date: "20 Apr 2025 22:00", desc: "Injury", type: "Homecare" },
      ],
    },
  },
  {
    pet: "Cat - Lorensius",
    time: "12:00 PM",
    type: "Online Consultation",
    details: {
      name: "Lorensius",
      gender: "Female",
      species: "Cat", // Diperbaiki
      neuter: "Not Neutered", // Diperbaiki
      age: "3 years old",
      weight: "3 Kg",
      color: "Black",
      medicalHistory: [
        { date: "22 Apr 2025 10:00", desc: "Diarrhea", type: "Homecare" },
        { date: "20 Apr 2025 22:00", desc: "Trauma/Injury", type: "Online Consultation" },
        { date: "19 Apr 2025 16:00", desc: "Flea and Tick, Ear Infection", type: "Online Consultation" },
      ],
    },
  },
];

export default function DashboardPage() {
  // ✅ 1. State management diperbaiki
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  // ✅ 2. Gunakan tipe PetData, bukan 'any'
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null);

  // ✅ 3. Fungsi-fungsi handler ditambahkan
  const handleOpenDetail = (petData: PetData) => {
    setSelectedPet(petData);
    setIsDetailOpen(true);
  };

  const handleCloseAll = () => {
    setIsDetailOpen(false);
    setIsChatOpen(false);
  };

  const handleStartAppointment = () => {
    setIsDetailOpen(false); // Tutup detail
    setIsChatOpen(true); // Buka chat
  };

  return (
    <div className="w-full">
      {/* Header Welcome */}
      <div className="w-full bg-[#F7FBEF] dark:bg-[#2E4F4A] py-6 px-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Welcome Back Dr.Seemore
        </h1>
      </div>

      {/* Dashboard Title */}
      <h1 className="text-3xl font-bold text-white p-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-[#D1E7C2] dark:bg-[#3D8D7A] py-2 text-center">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  {item.title}
                </p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mb-3">
                  <Icon className="w-8 h-8 text-gray-600 dark:text-gray-200" />
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {item.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                  Delete if not needed
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today Appointment */}
      <div className="mt-6 mx-6 bg-white dark:bg-gray-800 rounded shadow">
        <div className="bg-[#3D8D7A] text-white px-4 py-2 rounded-t">
          <h2 className="font-bold">Today Appointment</h2>
        </div>
        <div className="divide-y">
          {appointments.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              // ✅ 4. Panggil handler yang benar
              onClick={() => handleOpenDetail(item.details)}
            >
              <div>
                <p className="font-semibold">{item.pet}</p>
                <p className="text-sm text-gray-500">{item.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm">{item.type}</p>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Schedule */}
      <div className="mt-6 mx-6 mb-6 bg-white dark:bg-gray-800 rounded shadow">
        <div className="bg-[#3D8D7A] text-white px-4 py-2 rounded-t">
          <h2 className="font-bold">My Schedule</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Calendar />
          <div className="divide-y">
            {appointments.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleOpenDetail(item.details)}
              >
                <div>
                  <p className="font-semibold">{item.pet}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm">{item.type}</p>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ 5. Props untuk Overlay diperbaiki */}
      <OverlayPetDetail
        open={isDetailOpen}
        onClose={handleCloseAll}
        data={selectedPet}
        onStartAppointment={handleStartAppointment}
      />

      {/* <OverlayLiveChat
        open={isChatOpen}
        onClose={handleCloseAll}
        vetName="Aryo"
      /> */}

      <ChatDialogBox booking={undefined} isOpen={isChatOpen} setIsOpen={setIsChatOpen}/>
    </div>
  );
}