"use client";

import { useState } from "react";
import NavigationBar from "@/components/navigationbar";
import DoctorCard from "@/components/ui/doctorcard"
import DoctorScheduleCard from "@/components/ui/doctorschedulecard";

export default function HomePage() {
  const [remember, setRemember] = useState("no");
  const doctors = [
    {
      name: "Dr. Seemore",
      experience: "15 years",
      fee: "IDR 120.000,00",
      pets: "Chincilla, Spider, Cat, Dog",
    },
    {
      name: "Dr. Raydawn",
      experience: "75 years",
      fee: "IDR 1.200.000,00",
      pets: "Shark, Dolphin, Whale, Octopus",
    },
    {
      name: "Dr. Taftian",
      experience: "10 years",
      fee: "IDR 100.000,00",
      pets: "Monkey, Human, Apes, Aryo",
    },
  ];


  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation at the top */}
      <NavigationBar />

      {/* Page content */}
      <div className="flex flex-1">
        {/* Left Side - Form */}
       <div className="flex-1 bg-[#f6ffd8] flex justify-center items-center p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* {doctors.map((doc, index) => (
            <DoctorCard key={index} {...doc} />
          ))} */}
          <DoctorCard 
            name= "Dr. Seemore"
            experience= "15 years"
            fee= "IDR 120.000,00"
            pets= {["Chincilla", "Spider", "Cat", "Dog"]}/>
        </div>

        <DoctorScheduleCard
            name="Dr. Seemore"
            fee="IDR 120.000,00"
            rating="4.9"
            reviews="500"
            times={["12.00", "12.30", "13.00"]}
            />
       </div>
      </div>
    </div>
  );
}
