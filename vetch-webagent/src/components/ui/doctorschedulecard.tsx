"use client";
import Image from "next/image"

import { Star } from "lucide-react";

export default function DoctorScheduleCard({name, fee, rating, reviews, times,}) {
  return (
    <div className="bg-white dark:bg-[#2D4236] rounded-2xl shadow-md overflow-hidden w-72 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      {/* Image placeholder */}
      <div className="w-full h-48 pb-2 flex items-center justify-center">
            <Image
            src="/placeholder.png" // replace with your actual image
            alt="Doctor"
            width={200}
            height={200}
            className="object-cover h-full w-full"
            />
        </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-gray-800 dark:text-white text-2xl font-semibold">{name}</h3>
          <span className="text-gray-800 dark:text-white font-medium">Fee</span>
        </div>

        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center text-sm text-gray-800 dark:text-white">
            <Star className="text-green-600 fill-green-600 mr-1 stroke-black mr-1" size={16} />
            {rating} <span className="ml-1">({reviews})</span>
          </div>
          <span className=" text-gray-800 dark:text-white text-sm">{fee}</span>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-[#f6ffd8] dark:bg-[#2D4236] px-4 py-3">
        <p className="text-sm  text-gray-800 dark:text-white font-medium mb-2">
          [Date Placeholder]
        </p>
        <div className="flex gap-2 mb-3">
          {times.map((time, index) => (
            <button
              key={index}
              className="bg-[#3D8D7A] dark:bg-[#000000] text-white px-4 py-1 rounded-full hover:bg-green-600 hover:dark:bg-[#3D8D7A] transition-colors"
            >
              {time}
            </button>
          ))}
        </div>
        <button className="text-center w-full font-medium text-gray-800 hover:underline">
          <a href="/forPetParent/consultationVetList/consultationDetails" className="block px-4 py-2 text-gray-800 dark:text-white">See Details</a>
        </button>
      </div>
    </div>
  );
}
