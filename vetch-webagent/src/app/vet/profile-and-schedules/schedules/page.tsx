"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Data jadwal untuk contoh
const scheduleTimes = [
  { id: 1, label: "Time 1", hour: "10", minute: "00" },
  { id: 2, label: "Time 2", hour: "10", minute: "30" },
  { id: 3, label: "Time 3", hour: "11", minute: "00" },
  { id: 4, label: "Time 4", hour: "12", minute: "00" },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SchedulesPage() {
  // State untuk melacak hari yang aktif
  const [activeDay, setActiveDay] = useState("");

  return (
    <div className="p-8 flex flex-col items-center">
      {/* --- Daily Schedule Card --- */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl w-full">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Daily Schedule</h2>
        <div className="flex border border-gray-200 rounded-lg">
          
          {/* Bagian Kiri: Pilihan Hari */}
          <div className="w-1/2 p-4 border-r border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              {daysOfWeek.map((day) => (
                <Button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  variant="outline"
                  className={`
                    justify-center rounded-lg text-sm font-medium
                    ${activeDay === day 
                      ? "bg-gray-800 text-white hover:bg-gray-700" 
                      : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                    }
                  `}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          {/* Bagian Kanan: Pilihan Waktu */}
          <div className="w-1/2 p-4 pl-8">
            <div className="space-y-4">
              {scheduleTimes.map((time) => (
                <div key={time.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-600">
                    <span>•</span>
                    <span>{time.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-gray-100 rounded px-3 py-1 text-sm font-mono">{time.hour}</span>
                      <span>:</span>
                      <span className="bg-gray-100 rounded px-3 py-1 text-sm font-mono">{time.minute}</span>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 text-xl">
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- Service Cards --- */}
      <div className="flex gap-6 mt-6 max-w-3xl w-full">
        {/* Home Care Service Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex-1">
          <h3 className="font-semibold text-gray-800 mb-3">Home Care Service</h3>
          <RadioGroup defaultValue="available">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="available" id="homeCareAvailable" />
              <Label htmlFor="homeCareAvailable" className="text-gray-600">Available</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Emergency Service Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex-1">
          <h3 className="font-semibold text-gray-800 mb-3">Emergency Service</h3>
           <RadioGroup defaultValue="available">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="available" id="emergencyAvailable" />
              <Label htmlFor="emergencyAvailable" className="text-gray-600">Available</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}