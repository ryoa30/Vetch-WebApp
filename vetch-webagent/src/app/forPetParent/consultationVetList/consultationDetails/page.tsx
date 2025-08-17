"use client"

import { Star } from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"

export default function DoctorProfile() {
  return (
    <div className="max-w-2xl mx-auto bg-[#f9fce6] rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-6 p-6">
        {/* Profile Image */}
        <div className="w-32 h-32 bg-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
          {/* Example placeholder image */}
          <Image
            src="/placeholder.png"
            alt="Doctor profile"
            width={128}
            height={128}
            className="object-cover"
          />
        </div>

        {/* Doctor Info */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-green-900">dr. Seemore</h2>
          <div className="flex items-center text-gray-700 text-sm mt-1">
            <Star className="w-4 h-4 fill-green-600 stroke-black mr-1" />
            <span className="font-medium">4.9</span>
            <span className="mx-1">|</span>
            <span>500 Reviews</span>
          </div>

          {/* Species */}
          <div className="mt-4">
            <Label className="text-green-800 font-semibold">Species</Label>
            <div className="flex gap-2 mt-1 flex-wrap">
              {["Dog", "Cat", "Reptiles", "Horse"].map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white border rounded-full text-sm font-medium text-gray-900 shadow-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Specialty */}
          <div className="mt-4">
            <Label className="text-green-800 font-semibold">Specialty</Label>
            <div className="flex gap-2 mt-1 flex-wrap">
              {["Dermatology", "Nutrition", "Cardiology", "Immunology"].map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white border rounded-full text-sm font-medium text-gray-900 shadow-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 pb-6">
        <h3 className="text-lg font-bold text-green-900 mb-2">Description</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat... 
          <span className="text-blue-600 cursor-pointer"> see more</span>
        </p>
      </div>
    </div>
  )
}
