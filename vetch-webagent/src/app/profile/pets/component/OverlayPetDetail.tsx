// components/OverlayPetDetail.tsx
"use client";
import { BookingService } from "@/lib/services/BookingService";
import { ageFromDob, formatAge, formatIso, formatIsoJakarta } from "@/lib/utils/formatDate";
import { capitalize, snakeCase } from "lodash";
import { ClipboardPlus, X, AlignLeft } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { EditPetDialog } from "./editPetDialog";

// Tipe untuk props komponen
interface PetDetailProps {
  open: boolean;
  onClose: () => void;
  // onStartAppointment: () => void;
  data: any | null;
}

export default function OverlayPetDetail({
  open,
  onClose,
  // onStartAppointment,
  data,
}: PetDetailProps) {
  
  const bookingService = new BookingService();

  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const loadMedicalHistory = async () => {
    try {
      const result1 = await bookingService.fetchPetMedicalHistory(data.id);
      setMedicalHistory(result1.data || []);
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
      <div className="bg-white dark:bg-[#1F2D2A] rounded-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-2xl text-[#0F5544] dark:text-white font-medium mb-4">Pet Details</div>

        {/* Pet Info */}
        <div className="space-y-3">
          <div>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {data.petName} | {data.gender}
            </p>
            <p className="text-base text-gray-500">Pet name | Gender</p>
          </div>

          <div className="h-[0.5px] w-full bg-[#D9D9D9]"></div>

          <div className="flex flex-row gap-2 items-center">
            <Image 
              src={`/img/pet-logo/${snakeCase(data.speciesName)}.png`}
              alt="Pet Species"
              className="dark:invert"
              width={40}
              height={40}
            />
            <div >
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {data.speciesName} | {data.neuterStatus?"Neutered":"Not Neutered"}
              </p>
              <p className="text-base text-gray-500">Species | Neuter Status</p>
            </div>
          </div>

          <div className="h-[0.5px] w-full bg-[#D9D9D9]"></div>

          <div>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {formatAge(ageFromDob(data.petDob))} | {data.weight} kg
            </p>
            <p className="text-base text-gray-500">Age | Weight</p>
          </div>

          <div className="h-[0.5px] w-full bg-[#D9D9D9]"></div>

          <div>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {capitalize(data.primaryColor)}
            </p>
            <p className="text-base text-gray-500">Primary Color</p>
          </div>

          <div className="h-[0.5px] w-full bg-[#D9D9D9]"></div>

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
                  {formatIso(item.bookingDate.split("T")[0] +"T"+ item.bookingTime.split("T")[1])}
                </span>
                <span className="flex-[50%] px-2">
                  {item.concernDetails.map((c: any) => c.concern.concernName).join(", ")}
                </span>
                <span className="flex-[20%]">
                  {item.bookingType}
                </span>
              </li>
            ))}
            {medicalHistory.length === 0 && (
              <li className="text-gray-500">No medical history available.</li>
            )}
          </ul>
        </div>

        <div className="h-[0.5px] mt-6 w-full bg-[#D9D9D9]"></div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            Schedule
          </h3>
          <ul className="list-disc list-inside text-sm space-y-2">
            {data.reminderVaccineDate && 
              <li className="flex items-center justify-between">
                <span className="flex-[50%]">
                  Vaccine Reminder
                </span>
                <span className="flex-[30%] px-2">
                  {formatIsoJakarta(data.reminderVaccineDate)}
                </span>
                <span className="flex-[20%]">
                  {/* {item.bookingType} */}
                </span>
              </li>
            }

            {data.reminderConsultationDate && 
              <li className="flex items-center justify-between">
                <span className="flex-[50%]">
                  Consultation Reminder
                </span>
                <span className="flex-[30%] px-2">
                  {formatIsoJakarta(data.reminderConsultationDate)}
                </span>
                <span className="flex-[20%]">
                  {/* {item.bookingType} */}
                </span>
              </li>
            }

            {!data.reminderConsultationDate && !data.reminderVaccineDate && (
              <li className="text-gray-500">No Schedule Available.</li>
            )}
          </ul>
        </div>

        {/* ... (Sisa JSX lain tidak berubah) ... */}

        {/* Button */}
        <div className="mt-6 text-right">
          <button
            onClick={() => setShowEditDialog(true)}
            className="bg-transparent text-xl hover:bg-gray-300/50 font-bold text-black dark:text-white border border-black dark:border-white px-4 py-2 rounded-lg"
          >
            Edit Details
          </button>
        </div>

        {/* Edit Pet Dialog */}
        <EditPetDialog
        show={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        initialData={{
          id: data.id,
          petName: data.petName,
          primaryColor: data.primaryColor,
          neuterStatus: data.neuterStatus,
          weight: data.weight,
        }}
      />

      </div>
    </div>
  );
}
