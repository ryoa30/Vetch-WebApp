"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// 1. Impor komponen modal yang baru dibuat
import AddSpeciesModal from "@/app/vet/components/overlay/OverlayPetAddSpecies"; 
import EditLocation from "@/app/vet/components/overlay/OverlayEditLocation"; 

export default function ProfilePage() {
  return (
    <div className="p-6 bg-[#A3D1C6] min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <Image
              src="/img/vet/profile-placeholder.png"
              alt="Profile Picture"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>
          <Input
            value="doctor.seemore@email.com"
            readOnly
            className="bg-gray-200 text-gray-700 cursor-not-allowed"
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Nama</label>
          <Input defaultValue="Dr. Seemore" />
        </div>

        {/* Price and Location */}
        <div className="mb-4 flex gap-2">
          <div className="flex-1">
            <label className="block font-medium mb-1">Price</label>
            <Input defaultValue="Rp. 100.000,00" />
          </div>
          <div className="flex items-end">
            <EditLocation/>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Description</label>
          <Textarea
            defaultValue="I am a doctor, a good doctor."
            className="min-h-[100px]"
          />
        </div>

        {/* Species */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Species</label>
          <div className="flex flex-wrap gap-2 items-center">
            {["Dog", "Cat", "Reptiles", "Horse"].map((species) => (
              <Button
                key={species}
                variant="outline"
                className="bg-white border border-gray-400 text-black hover:bg-gray-100"
              >
                {species}
              </Button>
            ))}
            {/* 2. Gunakan komponen modal di sini */}
            <AddSpeciesModal />
          </div>
        </div>
      </div>
    </div>
  );
}