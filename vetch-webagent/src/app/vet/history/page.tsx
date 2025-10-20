"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Appointment {
  name: string;
  species: string;
  time: string;
  date: string;
  details: string;
}

const appointments: Appointment[] = [
  {
    name: "Lorensius",
    species: "Cat",
    date: "22 Apr 2025",
    time: "22:00",
    details: "Regular check-up for vaccination and grooming.",
  },
  {
    name: "Maurus",
    species: "Cat",
    date: "20 Apr 2025",
    time: "12:00",
    details: "Health check for seasonal allergy.",
  },
  {
    name: "Lorensius",
    species: "Reptile",
    date: "20 Apr 2025",
    time: "10:00",
    details: "Temperature regulation and nutrition review.",
  },
  {
    name: "Maurus",
    species: "Reptile",
    date: "19 Apr 2025",
    time: "8:00",
    details: "Routine check-up and habitat consultation.",
  },
];

export default function HistoryPage() {
  return (
    <div className="p-6 bg-[#A3D1C6] dark:bg-[#71998F] min-h-screen text-black font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-white">History</h1>
        <Input
          placeholder="Search for Veterinarian"
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

      {/* Appointment List */}
      <div className="space-y-4">
        {appointments.map((a, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center border-b border-black pb-3"
          >
            {/* Left Info */}
            <div className="flex items-start gap-3">
              <Image
                src={`/img/vet/${a.species.toLowerCase()}.png`}
                alt={a.species}
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <p className="font-semibold text-sm">
                  {a.name} <span className="font-normal">| {a.species}</span>
                </p>
                <p className="text-sm mt-1">
                  <span className="font-semibold">Time:</span> {a.date} at {a.time}
                </p>
                <a
                  href="#"
                  className="text-sm text-blue-700 hover:underline block mt-1"
                >
                  Details
                </a>
                <p className="text-sm mt-1">🐾 🐾 🐾 🐾 🐾</p>
              </div>
            </div>

            {/* Chat Button */}
            <Button
              variant="outline"
              className="rounded-full border border-black text-black bg-white hover:bg-gray-100 text-sm px-3 py-1"
            >
              💬 Chat History
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
