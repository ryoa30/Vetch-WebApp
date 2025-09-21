"use client"

import { Building, QrCode, Smartphone, Star } from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import NavigationBar from "@/components/navigationbar"
import ReviewCard from "@/components/ui/reviewCard"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer2"
import { useState } from "react"


export default function DoctorProfile() {
  const [selectedTime, setSelectedTime] = useState("12.00");
  const times = ["12.00", "12.30", "13.00", "13.30", "14.00", "14.30"];
  
  return (
    <div className="min-h-screen bg-[#FBFFE4] dark:bg-[#2E4F4A] flex flex-col">

      <div className="w-vw m-20">
        <div className="flex items-start gap-20">
          {/* Profile Image */}
          <div className="w-64 h-64 bg-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
            <Image
              src="/placeholder.png"
              alt="Doctor profile"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>

          {/* Doctor Info */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-semibold text-[#0F5544] dark:text-white">Dr. Seemore</h2>

            <div className="flex items-center text-gray-700 dark:text-white text-sm mt-1">
              <Star className="w-4 h-4 fill-green-600 stroke-black mr-1 dark:stroke-white" />
              <span className="font-medium">4.9</span>
              <span className="mx-1">|</span>
              <span>500 Reviews</span>
            </div>

            {/* Species */}
            <div className="mt-4">
              <Label className="text-[#0F5544] dark:text-white font-semibold">Species</Label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {["Dog", "Cat", "Reptiles", "Horse"].map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white dark:bg-black border rounded-full text-sm font-medium text-gray-900 dark:text-white shadow-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Specialty */}
            <div className="mt-4">
              <Label className="text-[#0F5544] dark:text-white font-semibold">Specialty</Label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {["Dermatology", "Nutrition", "Cardiology", "Immunology"].map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white dark:bg-black border rounded-full text-sm font-medium text-gray-900 dark:text-white shadow-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h3 className="text-4xl  text-[#0F5544] dark:text-white mb-2">Description</h3>
          <p className="text-black dark:text-white text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat...{" "}
            <span className="text-blue-600 cursor-pointer">see more</span>
          </p>
        </div>
        
        <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-[#2D4236] shadow h-full">
          {/* Left: Calendar */}
          <div className="w-1/3 pr-4 border-r border-gray-300 dark:border-gray-600">
            {/* Replace with your calendar component */}
            <div className="bg-[#2D4236] rounded-xl text-white flex flex-col items-center justify-center h-full">
              <p className="text-lg font-semibold">Calendar Placeholder</p>
              <p className="text-sm text-gray-300">Insert your calendar here</p>
            </div>
          </div>

          {/* Right: Appointment & Price */}
          <div className="w-2/3 pl-4 flex flex-col justify-between">
            {/* Appointment Times */}
            <div>
              <h3 className="text-white font-semibold mb-3">Appointment Time</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {times.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                      selectedTime === time
                        ? "bg-green-700 dark:bg-white dark:text-black dark:border-white"
                        : "border-black text-black dark:bg-black dark:border-white dark:text-white"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-400 dark:border-gray-500 my-4" />

            {/* Price + Button */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-semibold">Price</p>
                <p className="text-sm text-gray-300">Total Price</p>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-white font-semibold">IDR 125,333</p>
                <a href="/forPetParent/consultationVetList/consultationBooking">
                  <button className="px-4 py-2 bg-white text-black rounded-full shadow hover:bg-gray-100 border border-black">
                    Continue Booking
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <h3 className="text-4xl text-[#0F5544] dark:text-white mb-4">Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <ReviewCard key={index} />
            ))}
          </div>

          <div className="flex justify-left mt-6">
            <Button size="sm">Show All Reviews</Button>
          </div>
        </div>
      </div>

    </div>
  )
}
