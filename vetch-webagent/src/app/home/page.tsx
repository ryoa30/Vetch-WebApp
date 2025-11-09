"use client";

import { useState } from "react";
import NavigationBar from "@/components/navigationbar";
import Footer2 from "@/components/footer2";
import DoctorCard from "@/components/ui/doctorcard";

export default function HomePage() {

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
        <div className="flex-1 bg-[#f6ffd8] flex justify-center items-center p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctors.map((doc, index) => (
              <DoctorCard key={index} {...doc} />
            ))}
          </div>
        </div>
      </div>
      <Footer2 />
    </div>
  );
}

