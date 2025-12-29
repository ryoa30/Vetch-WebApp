// components/OverlayPetDetail.tsx
"use client";
import { PetData } from "@/app/types";
import { BookingService } from "@/lib/services/BookingService";
import { ageFromDob, formatAge, formatIso, formatIsoJakarta } from "@/lib/utils/formatDate";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import OrderDetailOverlay from "@/app/forPetParent/orderHistory/components/OrderDetailOverlay";

// Tipe untuk item riwayat
interface HistoryItem {
  date: string;
  desc: string;
  type: string;
}

// Tipe untuk props komponen
interface PetDetailProps {
  open: boolean;
  onClose: () => void;
  data: PetData | null;
}

export default function OverlayPetDetail({
  open,
  onClose,
  data,
}: PetDetailProps) {
  const bookingService = new BookingService();

  const [isLoading, setIsLoading] = useState(false);

  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);

  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const openMedicalHistory = (booking?: any) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  }

  const loadMedicalHistory = async () => {
    setIsLoading(true);
    try {
      const result1 = await bookingService.fetchPetMedicalHistory(
        data?.id || ""
      );
      // const result2 = await bookingService.fetchPetMedicalHistory(data.id, data.vet.id);
      // console.log(result2);
      setMedicalHistory(result1.data || []);
      // setMedicalHistoryWithVet(result2.data || []);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (data) {
      loadMedicalHistory();
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}></div>
      <div className="bg-white dark:bg-[#1F2D2A] rounded-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh] z-100">
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
              {data?.petName} | {data?.gender}
            </p>
            <p className="text-xs text-gray-500">Pet name</p>
          </div>

          <div>
            <p className="text-base text-gray-800 dark:text-white">
              {data?.speciesName} |{" "}
              {data?.neuterStatus ? "Neutered" : "Not Neutered"}
            </p>
            <p className="text-xs text-gray-500">Species | Neuter Status</p>
          </div>

          <div>
            <p className="text-base text-gray-800 dark:text-white">
              {formatAge(ageFromDob(data?.petDob || ""))} | {data?.weight}Kg
            </p>
            <p className="text-xs text-gray-500">Age | Weight</p>
          </div>

          <div>
            <p className="text-base text-gray-800 dark:text-white">
              {data?.primaryColor}
            </p>
            <p className="text-xs text-gray-500">Primary Color</p>
          </div>
        </div>

        {/* Medical History */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            Medical History
          </h3>
          <ul className="list-disc list-inside text-sm space-y-2 text-black dark:text-white">
            {medicalHistory?.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between cursor-pointer hover:bg-gray-100/50 rounded-md p-2" onClick={()=>openMedicalHistory(item)}>
                <span className="flex-[30%]">
                  {formatIso(
                    item.bookingDate.split("T")[0] +
                      "T" +
                      item.bookingTime.split("T")[1]
                  )}
                </span>
                <span className="flex-[50%] px-2">
                  {item.concernDetails
                    .map((c: any) => c.concern.concernName)
                    .join(", ")}
                </span>
                <span className="flex-[20%]">{item.bookingType}</span>
              </li>
            ))}
            {medicalHistory.length === 0 && (
              <p className="text-gray-500">No medical history available.</p>
            )}
            {isLoading && (
              <div className="flex justify-center transition-all duration-300">
                <Loader className="animate-spin w-6 h-6 text-gray-600 dark:text-gray-200" />
              </div>
            )}
          </ul>
        </div>
        {isDetailOpen && selectedBooking &&
          <OrderDetailOverlay 
            booking={selectedBooking}
            handleAction={()=>{}}
            open={isDetailOpen}
            setIsOpen={setIsDetailOpen}
          />}
      </div>
    </div>
  );
}
