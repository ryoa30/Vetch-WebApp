"use client"

import { Star } from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import NavigationBar from "@/components/navigationbar"
import ReviewCard from "@/components/ui/reviewCard"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer2"


export default function DoctorProfile() {
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
