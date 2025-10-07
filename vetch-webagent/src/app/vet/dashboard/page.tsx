"use client";

import {
  ChevronRight,
  Users,
  DollarSign,
  CalendarCheck,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import Calendar from "./components/Calendar"; 
import OverlayPetDetail from "../components/overlay/OverlayPetDetail";
import ChatDialogBox from "@/app/alert-dialog-box/ChatDialogBox";
import { BookingService } from "@/lib/services/BookingService";
import { useSession } from "@/contexts/SessionContext";
import { formatIsoJakarta, formatLocalDate } from "@/lib/utils/formatDate";
import { useLoading } from "@/contexts/LoadingContext";
import { set } from "lodash";


const stats = [
  { title: "Registered Patient", value: "25", icon: Users },
  { title: "Total Income", value: "$ 2,000", icon: DollarSign },
  { title: "Upcoming Appointment", value: "10", icon: CalendarCheck },
  { title: "Pending Appointment", value: "2", icon: Clock },
];


export default function DashboardPage() {
  // ✅ 1. State management diperbaiki
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const {setIsLoading} = useLoading();;

  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  // ✅ 2. Gunakan tipe PetData, bukan 'any'

  const [appointments, setAppointments] = useState<any[]>([]);

  const {user} = useSession();

  const bookingService = new BookingService();
  // ✅ 3. Fungsi-fungsi handler ditambahkan
  const handleOpenDetail = (data: any) => {
    setSelectedBooking(data);
    setIsDetailOpen(true);
  };

  const handleCloseAll = () => {
    setIsDetailOpen(false);
    setIsChatOpen(false);
  };

  const handleStartAppointment = () => {
    setIsDetailOpen(false); // Tutup detail
    setIsChatOpen(true); // Buka chat
  };

  const loadTodayAppointments = async () =>{
    setIsLoading(true);
    try {
      if(user){
        const result = await bookingService.fetchVetBookings(user?.id, ["ACCEPTED", "ONGOING"], formatLocalDate(new Date()));
        console.log(result.data);
        if(result.ok){
          setAppointments(result.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  useEffect(()=>{
    loadTodayAppointments();
  }, [])

  return (
    <div className="w-full">
      {/* Header Welcome */}
      <div className="w-full bg-[#F7FBEF] dark:bg-[#2E4F4A] py-6 px-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Welcome Back Dr.{user?.fullName}
        </h1>
      </div>

      {/* Dashboard Title */}
      <h1 className="text-3xl font-bold text-white p-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-[#D1E7C2] dark:bg-[#3D8D7A] py-2 text-center">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  {item.title}
                </p>
              </div>
              <div className="flex flex-col items-center p-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mb-3">
                  <Icon className="w-8 h-8 text-gray-600 dark:text-gray-200" />
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {item.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                  Delete if not needed
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today Appointment */}
      <div className="mt-6 mx-6 bg-white dark:bg-gray-800 rounded shadow">
        <div className="bg-[#3D8D7A] text-white px-4 py-2 rounded-t">
          <h2 className="font-bold">Today Appointment</h2>
        </div>
        <div className="divide-y">
          {appointments.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleOpenDetail(item)}
            >
              <div>
                <p className="font-semibold">{item.pet.petName}</p>
                <p className="text-sm text-gray-500">{formatIsoJakarta(item.bookingDate.split("T")[0] +"T"+ item.bookingTime.split("T")[1])}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm">{item.bookingType}</p>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
          {
            appointments.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No appointments for today yet.
              </div>
            )
          }
        </div>
      </div>

      {/* My Schedule */}
      <div className="mt-6 mx-6 mb-6 bg-white dark:bg-gray-800 rounded shadow">
        <div className="bg-[#3D8D7A] text-white px-4 py-2 rounded-t">
          <h2 className="font-bold">My Schedule</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Calendar />
          <div className="divide-y">
            {/* {appointments.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleOpenDetail(item.details)}
              >
                <div>
                  <p className="font-semibold">{item.pet}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm">{item.type}</p>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>

      {/* ✅ 5. Props untuk Overlay diperbaiki */}
      <OverlayPetDetail
        open={isDetailOpen}
        onClose={handleCloseAll}
        data={selectedBooking}
        onStartAppointment={handleStartAppointment}
      />

      <ChatDialogBox booking={selectedBooking} isOpen={isChatOpen} setIsOpen={setIsChatOpen}/>
    </div>
  );
}