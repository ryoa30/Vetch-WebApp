"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 w-full transition-colors duration-300">
      {/* Header bulan */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentMonth(11);
              setCurrentYear(currentYear - 1);
            } else {
              setCurrentMonth(currentMonth - 1);
            }
          }}
          className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-[#3D6F64] rounded transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-800 dark:text-white" />
        </button>

        <h2 className="text-base font-bold text-gray-800 dark:text-white">
          {monthNames[currentMonth]} {currentYear}
        </h2>

        <button
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentMonth(0);
              setCurrentYear(currentYear + 1);
            } else {
              setCurrentMonth(currentMonth + 1);
            }
          }}
          className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-[#3D6F64] rounded transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-800 dark:text-white" />
        </button>
      </div>

      {/* Hari */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      {/* Tanggal */}
      <div className="grid grid-cols-7 text-center gap-1">
        {calendarDays.map((day, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md text-sm transition-colors ${
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear()
                ? "bg-green-500 text-white font-bold"
                : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3D6F64]"
            }`}
          >
            {day || ""}
          </div>
        ))}
      </div>
    </div>
  );
}
