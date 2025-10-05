// components/OverlayPetDetail.tsx
"use client";
import { BookingService } from "@/lib/services/BookingService";
import { ageFromDob, formatAge, formatIsoJakarta } from "@/lib/utils/formatDate";
import { capitalize, toLower } from "lodash";
import { ClipboardPlus, X, AlignLeft } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

// Tipe untuk props komponen
interface PetDetailProps {
  open: boolean;
  onClose: () => void;
  onStartAppointment: () => void;
  data: any | null;
}

export default function OverlayPetDetail({
  open,
  onClose,
  onStartAppointment,
  data,
}: PetDetailProps) {
  
  const bookingService = new BookingService();

  console.log(data);

  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [medicalHistoryWithVet, setMedicalHistoryWithVet] = useState<any[]>([]);
  
  const loadMedicalHistory = async () => {
    try {
      const result1 = await bookingService.fetchPetMedicalHistory(data.petId);
      const result2 = await bookingService.fetchPetMedicalHistory(data.petId, data.vet.id);
      console.log(result2);
      setMedicalHistory(result1.data || []);
      setMedicalHistoryWithVet(result2.data || []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    loadMedicalHistory();
  }, [data])

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Pet Info */}
        <div className="space-y-3">
          <div>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {data.pet.petName} | {data.pet.gender}
            </p>
            <p className="text-base text-gray-500">Pet name | Gender</p>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <Image 
              src={`/img/pet-logo/${toLower(data.pet.speciesName)}.png`}
              alt="Pet Species"
              className="dark:invert"
              width={40}
              height={40}
            />
            <div >
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {data.pet.speciesName} | {data.pet.neuterStatus?"Neutered":"Not Neutered"}
              </p>
              <p className="text-base text-gray-500">Species | Neuter Status</p>
            </div>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {formatAge(ageFromDob(data.pet.petDob))} | {data.pet.weight} kg
            </p>
            <p className="text-base text-gray-500">Age | Weight</p>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {capitalize(data.pet.primaryColor)}
            </p>
            <p className="text-base text-gray-500">Primary Color</p>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <ClipboardPlus className="w-10 h-10 text-black dark:text-white" />
            <div >
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                Concerns
              </p>
              <p className="text-base text-gray-500">{data.concernDetails.map((c: any) => c.concern.concernName).join(", ")}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2"> 
            <div className="flex flex-row gap-2 items-center">
              <AlignLeft className="w-10 h-10 text-black dark:text-white" />
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  Illness Description
                </p>
            </div>
            <textarea 
              disabled
              value={data.illnessDescription}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Medical History */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            Medical History
          </h3>
          <ul className="list-disc list-inside text-sm space-y-2">
            {medicalHistory?.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="flex-[30%]">
                  {formatIsoJakarta(item.bookingDate.split("T")[0] +"T"+ item.bookingTime.split("T")[1])}
                </span>
                <span className="flex-[50%] px-2">
                  {item.concernDetails.map((c: any) => c.concern.concernName).join(", ")}
                </span>
                <span className="flex-[20%]">
                  {item.bookingType}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            Medical History With Me
          </h3>
          <ul className="list-disc list-inside text-sm space-y-2">
            {medicalHistoryWithVet?.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="flex-[30%]">
                  {formatIsoJakarta(item.bookingDate.split("T")[0] +"T"+ item.bookingTime.split("T")[1])}
                </span>
                <span className="flex-[50%] px-2">
                  {item.concernDetails.map((c: any) => c.concern.concernName).join(", ")}
                </span>
                <span className="flex-[20%]">
                  {item.bookingType}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ... (Sisa JSX lain tidak berubah) ... */}

        {/* Button */}
        <div className="mt-6 text-right">
          <button
            onClick={onStartAppointment}
            className="bg-[#3D8D7A] hover:bg-[#327566] text-white px-4 py-2 rounded-lg font-semibold"
          >
            Start Appointment
          </button>
          <p className="text-[10px] text-gray-500 mt-1">
            Appointment can only start 10 mins before scheduled time
          </p>
        </div>
      </div>
    </div>
  );
}
