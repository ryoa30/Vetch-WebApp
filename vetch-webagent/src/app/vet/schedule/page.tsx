"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useLoading } from "@/contexts/LoadingContext";
import { BookingService } from "@/lib/services/BookingService";
import OverlayPetDetail from "../components/overlay/OverlayPetDetail";
import { lowerCase, snakeCase } from "lodash";
import { formatIsoJakarta } from "@/lib/utils/formatDate";
import ChatDialogBox from "@/app/alert-dialog-box/ChatDialogBox";

export default function HistoryPage() {
  const [openDetail, setOpenDetail] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const {setIsLoading} = useLoading();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const {user} = useSession();

  const bookingService = new BookingService();

  const loadAppointments = async () =>{
      setIsLoading(true);
      try {
        if(user){
          const result = await bookingService.fetchVetBookings(user?.id, ["PENDING","ACCEPTED", "ONGOING"]);
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
      loadAppointments();
    }, [])

  const handleOpenDetail = (booking) => {
    setSelectedBooking(booking);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedBooking(null);
    setOpenDetail(false);
  };

  const handlePendingBooking = async (status: string) => {
    console.log("reject booking");
    const result = await bookingService.changeBookingStatus(selectedBooking.id, (status === "REJECTED"?"CANCELLED": selectedBooking.bookingType === "Emergency" ? "ONGOING" :"ACCEPTED"));
    if(result.ok){
      handleCloseDetail();
      loadAppointments();
    }
  }
  
  const handleChatOpen = () => {
    setOpenDetail(false); // Tutup detail
    setIsChatOpen(true); // Buka chat
  };

  const handleStartAppointment = async () => {
    const result = await bookingService.changeBookingStatus(selectedBooking.id, ("ONGOING"));
    if(result.ok){
      loadAppointments();
      setOpenDetail(false); // Tutup detail
      setIsChatOpen(true); // Buka chat
    }
  }

  // 🔍 Filter berdasarkan section
  const pendingAppointments = appointments.filter(a => lowerCase(a.bookingStatus) === "pending");
  const acceptedAppointments = appointments.filter(a => lowerCase(a.bookingStatus) === "accepted");
  const ongoingAppointments = appointments.filter(a => lowerCase(a.bookingStatus) === "ongoing");

  return (
    <div className="p-6 min-h-screen text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Vet Schedules</h1>
      </div>

      {/* Bone divider */}
      <div className="w-full flex justify-center mb-10">
        <Image
          src="/img/bone.png"
          alt="Bone Divider"
          width={800}
          height={30}
          className="object-contain"
        />
      </div>

      {/* Today’s Appointments */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-5">Ongoing Appointments</h2>

        {ongoingAppointments.map((item, i) => (
          <div
            key={i}
            onClick={() => handleOpenDetail(item)}
            className={`flex justify-between items-center cursor-pointer hover:opacity-90 ${
              i > 0 ? "mt-4" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Image
                src={`/img/pet-logo/${snakeCase(item.pet.speciesName)}.png`}
                alt={item.pet.speciesName}
                width={40}
                height={40}
              />
              <div>
                <p className="font-semibold">
                  {item.pet.speciesName} - {item.pet.petName}
                </p>
                <p className={`text-sm text-gray-700 ${item.bookingType === "Emergency"? "animate-bounce text-red-500 font-bold" : ""}`}>{item.bookingType === "Emergency" ? "EMERGENCY" :formatIsoJakarta(item.bookingDate.split("T")[0] +"T"+ item.bookingTime.split("T")[1])}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{item.bookingType}</p>
              <ChevronRight size={18} className="text-black" />
            </div>
          </div>
        ))}
        { ongoingAppointments.length === 0 && (
          <p className="text-gray-700">No ongoing appointments.</p>
        ) }
      </div>

      {/* Divider */}
      <div className="border-b border-black my-8" />

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold mb-5">Accepted Appointments</h2>

        {acceptedAppointments.map((item, i) => (
          <div
            key={i}
            onClick={() => handleOpenDetail(item)}
            className={`flex justify-between items-center hover:opacity-90 cursor-pointer ${
              i > 0 ? "mt-4" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Image
                src={`/img/pet-logo/${snakeCase(item.pet.speciesName)}.png`}
                alt={item.pet.speciesName}
                width={40}
                height={40}
              />
              <div>
                <p className="font-semibold">
                  {item.pet.speciesName} - {item.pet.petName}
                </p>
                <p className={`text-sm text-gray-700 ${item.bookingType === "Emergency"? "animate-bounce text-red-500 font-bold" : ""}`}>{item.bookingType === "Emergency" ? "EMERGENCY" :formatIsoJakarta(item.bookingDate.split("T")[0] +"T"+ item.bookingTime.split("T")[1])}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{item.bookingType}</p>
              <ChevronRight size={18} className="text-black" />
            </div>
          </div>
        ))}
        { acceptedAppointments.length === 0 && (
          <p className="text-gray-700">No accepted appointments.</p>
        ) }
      </div>

      <div className="border-b border-black my-8" />

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold mb-5">Pending Appointments</h2>

        {pendingAppointments.map((item, i) => (
          <div
            key={i}
            onClick={() => handleOpenDetail(item)}
            className={`flex justify-between items-center hover:opacity-90 cursor-pointer ${
              i > 0 ? "mt-4" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Image
                src={`/img/pet-logo/${snakeCase(item.pet.speciesName)}.png`}
                alt={item.pet.speciesName}
                width={40}
                height={40}
              />
              <div>
                <p className="font-semibold">
                  {item.pet.speciesName} - {item.pet.petName}
                </p>
                <p className={`text-sm text-gray-700 ${item.bookingType === "Emergency"? "animate-bounce text-red-500 font-bold" : ""}`}>{item.bookingType === "Emergency" ? "EMERGENCY" :formatIsoJakarta(item.bookingDate.split("T")[0] +"T"+ item.bookingTime.split("T")[1])}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{item.bookingType}</p>
              <ChevronRight size={18} className="text-black" />
            </div>
          </div>
        ))}
        { pendingAppointments.length === 0 && (
          <p className="text-gray-700">No pending appointments.</p>
        ) }
      </div>

      {/* Overlay Pet Detail */}
      {openDetail && 
        <OverlayPetDetail
          open={openDetail}
          onClose={handleCloseDetail}
          onAction={
            selectedBooking.bookingStatus === "PENDING" ? handlePendingBooking : 
            selectedBooking.bookingStatus === "ONGOING" ? handleChatOpen :
            selectedBooking.bookingStatus === "ACCEPTED" ? handleStartAppointment :
            () => console.log("Action")
          }  
          data={selectedBooking}
        />
      }

      {isChatOpen && <ChatDialogBox booking={selectedBooking} isOpen={isChatOpen} setIsOpen={setIsChatOpen}/>}
    </div>
  );
}
