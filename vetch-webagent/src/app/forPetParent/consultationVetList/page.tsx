"use client";

import { useState } from "react";
import NavigationBar from "@/components/navigationbar";
import Footer2 from "@/components/footer2";
import { ScheduleButton, FilterButton, PetTypeButton } from "@/components/ui/buttonCustom";
import DoctorScheduleCard from "@/components/ui/doctorschedulecard";

export default function HomePage() {
  const [remember, setRemember] = useState("no");
  const doctors = [
    {
      name: "Dr. Seemore",
      experience: "15 years",
      fee: "IDR 120.000,00",
      pets: ["Chincilla", "Spider", "Cat", "Dog"],
    },
    {
      name: "Dr. Raydawn",
      experience: "75 years",
      fee: "IDR 1.200.000,00",
      pets: ["Shark", "Dolphin", "Whale", "Octopus"],
    },
    {
      name: "Dr. Taftian",
      experience: "10 years",
      fee: "IDR 100.000,00",
      pets: ["Monkey", "Human", "Apes", "Aryo"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <div className="flex flex-1">
        <div className="flex-1 bg-[#f6ffd8] p-8">
          <div className="flex gap-10 pb-10">
            <PetTypeButton />
            <ScheduleButton />
            <FilterButton />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center">
            {Array(6).fill(0).map((_, i) => (
              <DoctorScheduleCard
                key={i}
                name={doctors[0].name}
                fee={doctors[0].fee}
                rating="4.9"
                reviews="500"
                times={["12.00", "12.30", "13.00"]}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer2 />
    </div>
  );
}

