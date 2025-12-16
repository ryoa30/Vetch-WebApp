"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/contexts/LoadingContext";
import { useEffect, useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { BookingService } from "@/lib/services/BookingService";
import { BookingData, BookingWithRelations } from "@/app/types";
import { snakeCase } from "lodash";
import { formatIso, formatIsoJakarta } from "@/lib/utils/formatDate";
import { History, MessageCircle, Star } from "lucide-react";
import ChatHistoryDialogBox from "@/app/alert-dialog-box/ChatHistoryDialog";
import OrderDetailOverlay from "@/app/forPetParent/orderHistory/components/OrderDetailOverlay";

export default function HistoryPage() {
  const { setIsLoading } = useLoading();
  const [appointments, setAppointments] = useState<BookingWithRelations[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingWithRelations[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSession();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithRelations | null>(null);
  const bookingService = new BookingService();
  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const result = await bookingService.fetchVetBookings(user?.id, [
          "DONE",
          "CANCELLED",
        ]);
        console.log(result.data);
        if (result.ok) {
          setAppointments(result.data);
          setFilteredBookings(result.data);
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

   useEffect(() => {
      if (searchTerm) {
        setFilteredBookings(
          appointments.filter(
            (p) =>
              p.pet?.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.pet?.speciesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.bookingType.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }else{
        setFilteredBookings(appointments);
      }
    }, [searchTerm]);

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <div className="p-6 bg-[#A3D1C6] dark:bg-[#71998F] min-h-screen text-black font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-white">History</h1>
        <input
          placeholder="Search for Veterinarian"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-[500px] mt-3 md:mt-0 rounded-full px-4 py-2 bg-white border-none text-black placeholder:text-gray-500"
        />
      </div>

      {/* Bone divider */}
      <div className="w-full flex justify-center mb-6">
        <Image
          src="/img/bone.png"
          alt="Bone Divider"
          width={1000}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Appointment List */}
      <div className="space-y-4">
        {filteredBookings.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center border-b dark:text-white border-black pb-3"
          >
            {/* Left Info */}
            <div className="flex items-start gap-3">
              <Image
                src={`/img/pet-logo/${snakeCase(item.pet?.speciesName)}.png`}
                alt={item.pet?.speciesName || "Vet"}
                width={60}
                height={60}
                className="object-contain dark:invert"
              />
              <div>
                <p className="font-semibold text-sm">
                  {item.pet?.petName}{" "}
                  <span className="font-normal">| {item.pet?.speciesName}</span>
                </p>
                <div className="flex flex-row items-end">
                  <p className="text-sm mt-1">
                    <span className="font-semibold">Time:</span>{" "}
                    {item.bookingType === "Emergency"
                      ? "EMERGENCY"
                      : `${formatIso(
                          item.bookingDate.split("T")[0] +
                            "T" +
                            item.bookingTime.split("T")[1]
                        )} (${item.bookingType})`} 
                  </p>
                  {item.rating && (
                    <span className="ml-4 text-sm px-2 font-semibold text-yellow-500 dark:text-yellow-400">
                      {item.rating.rating} <Star fill="yellow" className="inline-block w-4 h-4 text-yellow-400 mb-1" />
                    </span>
                  )}
                </div>
                <div className="flex flex-row gap-3 mt-3">
                  <button
                    className="text-[#3674B5] dark:text-[#a1bef1] text-sm font-medium cursor-pointer hover:underline"
                    onClick={() => {
                      setSelectedBooking(item);
                      setIsDetailOpen(true);
                    }}
                  >
                    Details
                  </button>
                  <Image
                    src="/img/login/foot-step.png"
                    alt="Pets Illustration"
                    width={100}
                    height={400}
                    className="object-contain dark:invert"
                  />
                </div>
              </div>
            </div>

            {/* Chat Button */}
            <div>
              {
                item.bookingStatus === "DONE" &&
                <button
                  onClick={() => {
                    setIsChatOpen(true);
                    setSelectedBooking(item);
                  }}
                  className="bg-transparent w-fit flex-1/2 self-center h-fit text-black px-3 py-2 rounded-lg text-sm font-medium border border-black dark:hover:bg-gray-500 hover:bg-gray-100 dark:text-white dark:border-white duration-200 flex items-center gap-2"
                >
                  <div className="w-6 h-6 relative">
                    <History className="absolute w-3 h-3 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black dark:text-white" />
                    <MessageCircle className="w-6 h-6 text-black dark:text-white" />
                  </div>
                  Chat History
                </button>
              }
              { item.bookingStatus === "CANCELLED" &&
                <p className="text-red-500 font-semibold">Cancelled</p>
              }
            </div>
          </div>
        ))}
      </div>
      {isChatOpen && (
        <ChatHistoryDialogBox
          isOpen={isChatOpen}
          setIsOpen={setIsChatOpen}
          booking={selectedBooking}
        />
      )}
      {isDetailOpen && selectedBooking &&
      <OrderDetailOverlay 
        booking={selectedBooking}
        handleAction={()=>{}}
        open={isDetailOpen}
        setIsOpen={setIsDetailOpen}
      />}
    </div>
  );
}
