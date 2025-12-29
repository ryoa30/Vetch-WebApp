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
import { formatIso, formatIsoJakarta, formatLocalDate } from "@/lib/utils/formatDate";
import { useLoading } from "@/contexts/LoadingContext";
import { VetService } from "@/lib/services/VetService";
import { VetStats } from "@/app/types";
import Lottie from "lottie-react";
import loaderCat from "@/../public/lottie/Loader cat.json"; 
import { ToastPopup } from "@/components/NotificationToast";
import { NotificationService } from "@/lib/services/NotificationService";
import { capitalize } from "lodash";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";



const stats = [
  { title: "Registered Patient", value: "totalPatients", icon: Users },
  { title: "Total Income", value: "totalIncome", icon: DollarSign },
  { title: "Upcoming Appointment", value: "upcomingAppointment", icon: CalendarCheck },
  { title: "Pending Appointment", value: "pendingAppointment", icon: Clock },
];


export default function DashboardPage() {
  // ✅ 1. State management diperbaiki

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [vetStats, setVetStats] = useState<VetStats|null>(null);
  const [verified, setVerified] = useState<string>("");
  const {setIsLoading} = useLoading();

  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // ✅ 2. Gunakan tipe PetData, bukan 'any'

  const [appointments, setAppointments] = useState<any[]>([]);
  const [dateAppointments, setDateAppointments] = useState<any[]>([]);

  const {isAuthenticated, user, isNotificationPrompted, setIsNotificationPrompted} = useSession();

  const bookingService = new BookingService();
  const vetService = new VetService();

  const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
  const nc = new NotificationService("/sw.js");

  const loadAppointmentByDate = async () => {
    setIsLoading(true);
    try {
      if(user){
        const result = await bookingService.fetchVetBookings(user?.id, ["PENDING","ACCEPTED", "ONGOING", "OTW", "ARRIVED", "DONE"], formatLocalDate(selectedDate));
        console.log(result.data);
        if(result.ok){
          setDateAppointments(result.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  const loadTodayAppointments = async () =>{
    setIsLoading(true);
    try {
      if(user){
        const result = await bookingService.fetchVetBookings(user?.id, ["ACCEPTED", "ONGOING", "OTW", "ARRIVED"], formatLocalDate(new Date()));
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

  const handleNotification = async () => {
    console.log("Handling notification subscription...");
    setIsNotificationPrompted(false);
    await nc.init();
    await nc.ensurePermission();
    await nc.subscribe(VAPID_PUBLIC_KEY, user?.id || "");
  }
  // ✅ 3. Fungsi-fungsi handler ditambahkan
  const handleOpenDetail = (data: any) => {
    setSelectedBooking(data);
    setIsDetailOpen(true);
  };

  const handleCloseAll = () => {
    setIsDetailOpen(false);
    setIsChatOpen(false);
  };

  const handleChatOpen = async (isUpdateHomecare: boolean) => {
    if(isUpdateHomecare){
      const result = await bookingService.changeBookingStatus(selectedBooking.id, ("ARRIVED"));
      if(result.ok){
        handleCloseAll();
        loadAppointmentByDate();
        loadTodayAppointments();
      }
    }else{
      setIsDetailOpen(false); // Tutup detail
      setIsChatOpen(true); // Buka chat
    }
  };

  const handlePendingBooking = async (status: string) => {
    console.log("reject booking");
    const result = await bookingService.changeBookingStatus(selectedBooking.id, (status === "REJECTED"?"CANCELLED": selectedBooking.bookingType === "Emergency" ? "ONGOING" :"ACCEPTED"));
    if(result.ok){
      handleCloseAll();
      loadAppointmentByDate();
      loadTodayAppointments();
    }
  }

  const handleStartAppointment = async () => {
    const result = await bookingService.changeBookingStatus(selectedBooking.id, (selectedBooking.bookingType === "Homecare" ? "OTW" :"ONGOING"));
    if(result.ok){
      loadTodayAppointments();
      loadAppointmentByDate();
      setIsDetailOpen(false); // Tutup detail
      setIsChatOpen(true); // Buka chat
    }
  }

  const loadVetStats = async () =>{
    setIsLoading(true);

    try {
      if(user){
        const result = await vetService.fetchVetStats(user?.id);
        console.log("Vet Stats: ",result.data);
        if(result.ok){
          setVetStats(result.data);
          setVerified(result.data.verified);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  useEffect(()=>{
    loadVetStats();
    loadTodayAppointments();
  }, [])

  useEffect(() => {
    loadAppointmentByDate();
  }, [selectedDate]);

  return (
    <div className="w-full">
      {/* Header Welcome */}
      <div className="w-full bg-[#F7FBEF] dark:bg-[#2E4F4A] py-6 px-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Welcome Back Dr.{user?.fullName} {verified !== "verified" && 
          <Tooltip >
            <TooltipTrigger asChild>
              <span className={verified === "unverified"?"text-yellow-500":"text-red-500"}>({capitalize(verified)})</span>
            </TooltipTrigger>
            <TooltipContent align="start">
              {verified === "unverified" && <p>Your certificate is waiting verification. While waiting for verification, you cannot accept any bookings.</p>}
              {verified === "denied" && <p>Your certificate is denied by the admin. <br></br> Please reupload your certificate in profile menu or click <Link href="/vet/profile-and-schedules/profile" className="text-blue-500 underline">here</Link></p>}
            </TooltipContent>
          </Tooltip>
          }
        </h1>
      </div>

      {/* Dashboard Title */}
      <h1 className="text-4xl font-bold text-white p-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-[#1F2D2A] rounded-lg shadow-md overflow-hidden"
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
                  {vetStats ? new Intl.NumberFormat("id-ID").format(vetStats[item.value as keyof VetStats]) : 0}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today Appointment */}
      <div className="mt-6 mx-6 bg-white dark:bg-[#1F2D2A] rounded shadow">
        <div className="bg-[#3D8D7A] text-white px-4 py-2 rounded-t">
          <h2 className="font-bold">Today&apos;s Upcoming Appointment</h2>
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
                <p className="text-sm text-gray-500">{formatIso(item.bookingDate.split("T")[0] +"T"+ item.bookingTime.split("T")[1])}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm">{item.bookingType}</p>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
          {
            appointments.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-white">
                No appointments for today yet.
              </div>
            )
          }
        </div>
      </div>

      {/* My Schedule */}
      <div className="mt-6 mx-6 mb-6 bg-white dark:bg-[#1F2D2A] rounded shadow">
        <div className="bg-[#3D8D7A] text-white px-4 py-2 rounded-t">
          <h2 className="font-bold">My Schedule</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Calendar onDateSelect={setSelectedDate} selectedDate={selectedDate}/>
          <div className="divide-y">
            {dateAppointments.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleOpenDetail(item)}
            >
              <div>
                <p className="font-semibold">{item.pet.petName}</p>
                <p className="text-sm text-gray-500 dark:text-white font-semibold">{`Status: ${item.bookingStatus}`}</p>
                <p className="text-sm text-gray-500 dark:text-white">{formatIso(item.bookingDate.split("T")[0] +"T"+ item.bookingTime.split("T")[1])}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm">{item.bookingType}</p>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
          {
            dateAppointments.length === 0 && (
              <div className="h-[100%] flex flex-col justify-center items-center p-4 text-center text-gray-500 dark:text-white">
                <div className="w-[200px] h-fit bg-white rounded-full">
                  <Lottie animationData={loaderCat} loop={true}/>
                </div>
                <div className="p-4 text-center self-center text-gray-500 dark:text-white">
                  No appointments for this date.
                </div>
              </div>
            )
          }
          </div>
        </div>
      </div>

      {
        isAuthenticated &&
      <ToastPopup 
        open={isNotificationPrompted || false}
        onClose={() => {setIsNotificationPrompted(false)}}
        onConfirm={() => handleNotification()}
        title="Turn on notifications?"
        description="We'll only send important ones."
      />}

      {/* ✅ 5. Props untuk Overlay diperbaiki */}
      {/* {isDetailOpen && <OverlayPetDetail
        open={isDetailOpen}
        onClose={handleCloseAll}
        data={selectedBooking}
        onAction={handleChatOpen}
      />} */}
      {isDetailOpen && 
        <OverlayPetDetail
          open={isDetailOpen}
          onClose={handleCloseAll}
          onAction={
            selectedBooking.bookingStatus === "PENDING" ? handlePendingBooking : 
            selectedBooking.bookingStatus === "ONGOING" || selectedBooking.bookingStatus === "OTW" || selectedBooking.bookingStatus === "ARRIVED" ? handleChatOpen :
            selectedBooking.bookingStatus === "ACCEPTED" ? handleStartAppointment :
            () => console.log("Action")
          }  
          data={selectedBooking}
        />
      }

      { isChatOpen && <ChatDialogBox bookingId={selectedBooking ? selectedBooking.id : null} isOpen={isChatOpen} setIsOpen={setIsChatOpen}/>}
    </div>
  );
}