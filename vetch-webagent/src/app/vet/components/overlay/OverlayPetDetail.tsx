// components/OverlayPetDetail.tsx
"use client";
import { X } from "lucide-react";

// Tipe untuk item riwayat
interface HistoryItem {
  date: string;
  desc: string;
  type: string;
}

// Tipe untuk data hewan peliharaan
interface PetData {
  name: string;
  gender: string;
  species: string;
  neuter: string;
  age: string;
  weight: string;
  color: string;
  medicalHistory?: HistoryItem[]; // Dibuat optional karena bisa jadi undefined
  myHistory?: HistoryItem[]; // Dibuat optional karena bisa jadi undefined
}

// Tipe untuk props komponen
interface PetDetailProps {
  open: boolean;
  onClose: () => void;
  onStartAppointment: () => void;
  data: PetData | null;
}

export default function OverlayPetDetail({
  open,
  onClose,
  onStartAppointment,
  data,
}: PetDetailProps) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh]">
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
              {data.name} | {data.gender}
            </p>
            <p className="text-xs text-gray-500">Pet name</p>
          </div>

          <div>
            <p className="text-base text-gray-800 dark:text-white">
              {data.species} | {data.neuter}
            </p>
            <p className="text-xs text-gray-500">Species | Neuter Status</p>
          </div>

          <div>
            <p className="text-base text-gray-800 dark:text-white">
              {data.age} | {data.weight}
            </p>
            <p className="text-xs text-gray-500">Age | Weight</p>
          </div>

          <div>
            <p className="text-base text-gray-800 dark:text-white">
              {data.color}
            </p>
            <p className="text-xs text-gray-500">Primary Color</p>
          </div>
        </div>

        {/* Medical History */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            Medical History
          </h3>
          <ul className="list-disc list-inside text-sm space-y-2">
            {data.medicalHistory?.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="flex-1">
                  {item.date} {item.desc}
                </span>
                <span className="w-px h-4 bg-gray-300 mx-2" />
                <span className="text-gray-500 text-xs">{item.type}</span>
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
