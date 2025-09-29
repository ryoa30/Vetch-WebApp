"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import OrderCard from "./components/OrderCard";
import { Headset, House } from "lucide-react";
import { BookingService } from "@/lib/services/BookingService";
import { useSession } from "@/contexts/SessionContext";
import { useLoading } from "@/contexts/LoadingContext";
import ChatDialogBox from "@/app/alert-dialog-box/ChatDialogBox";

const tabList = [
    { id: "PAYMENT", label: "Payment" },
    { id: "PENDING", label: "Pending" },
    { id: "ACCEPTED", label: "Accepted" },
    { id: "ONGOING", label: "Ongoing" },
    { id: "DONE", label: "Done" },
    { id: "CANCELLED", label: "Cancelled" },
]

const OrderHistory: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState("PAYMENT");
    const {user} = useSession();
    const {setIsLoading} = useLoading();

    const [isChatOpen, setIsChatOpen] = useState(false);
    // const [isChatOpen, setIsChatOpen] = useState(true);

    const [selectedBooking, setSelectedBooking] = useState(null);

    const [reload, setReload] = useState(false);

    const [onlineConsultations, setOnlineConsultations] = useState<any[]>([]);
    const [homecareConsultations, setHomecareConsultations] = useState<any[]>([]);

    const bookingService = new BookingService();

    const loadBookings = async () => {
      setIsLoading(true);
      if(!user) return;
      const bookings = await bookingService.getBookingConsultationHomecare(user.id, selectedTab);
      if(bookings.online) setOnlineConsultations(bookings.online);
      else setOnlineConsultations([]);
      if(bookings.homecare) setHomecareConsultations(bookings.homecare);
      else setHomecareConsultations([]);
      console.log(bookings);
      setIsLoading(false);
      setReload(false);
    }

    useEffect(()=>{
      loadBookings();
    }, [selectedTab, reload])

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-green-50 p-4 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl text-[#3D8D7A] mb-6">
            Order <span className="font-bold">History</span>
          </h1>

          {/* Bone-like connector line */}
          <div className="w-full flex justify-center mb-6">
            <Image
              src="/img/bone.png"
              alt="Bone Divider"
              width={600}
              height={100}
              className="object-contain"
            />
          </div>

          {/* Status labels */}
          <div className="flex justify-center gap-20 text-sm">
            {tabList.map((tab) => (
                <button key={tab.id} onClick={()=>setSelectedTab(tab.id)} className={`text-[#3D8D7A] font-medium ${tab.id === selectedTab? "underline": ""} hover:underline`}>{tab.label}</button>
            ))}
          </div>
        </div>

        {/* Consultation Card */}
        <div className="bg-white w-full md:w-[70vw] rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex flex-col">
                <h3 className="text-2xl font-semibold text-[#3D8D7A]">
                Consultation
                </h3>
                <div className="h-[2px] bg-[#3D8D7A] w-1/2"></div>
            </div>
            <Headset className="w-6 h-6 text-[#3D8D7A]" />
          </div>
            {
              onlineConsultations.length === 0 && (
                <p className="text-gray-500 italic">No consultation orders found.</p>
              )
            }
            {
              onlineConsultations.map((consultation, index) => (
                <div key={consultation.id}>
                  <OrderCard booking={consultation} setReload={setReload} setIsChatOpen={setIsChatOpen} setSelectedBooking={setSelectedBooking}/>
                  {index != onlineConsultations.length-1 && <div className="w-full my-4 h-[1px] bg-gray-200"></div>}
                </div>
              ))
            }
        </div>

        {/* Homecare Card */}
        <div className="bg-white w-full md:w-[70vw] rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex flex-col">
                <h3 className="text-2xl font-semibold text-[#3D8D7A]">
                Homecare
                </h3>
                <div className="h-[2px] bg-[#3D8D7A] w-1/2"></div>
            </div>
            <House className="w-6 h-6 text-[#3D8D7A]" />
          </div>

          {/* <OrderCard /> */}
        </div>

        <ChatDialogBox isOpen={isChatOpen} setIsOpen={setIsChatOpen} booking={selectedBooking} />
        {/* <ChatDialogBox isOpen={isChatOpen} setIsOpen={setIsChatOpen} booking={{id:"default", vet:{user:{profilePicture:null, fullName: "testing"}}}} /> */}
    </div>
  );
};

export default OrderHistory;
