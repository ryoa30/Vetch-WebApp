"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import OrderCard from "./components/OrderCard";
import { Headset, House } from "lucide-react";
import { BookingService } from "@/lib/services/BookingService";
import { useSession } from "@/contexts/SessionContext";
import { useLoading } from "@/contexts/LoadingContext";
import ChatDialogBox from "@/app/alert-dialog-box/ChatDialogBox";
import OrderDetailOverlay from "./components/OrderDetailOverlay";
import { showPaymentSnap } from "@/lib/utils/snapPayment";
import { PaymentService } from "@/lib/services/PaymentService";
import { RatingDialog } from "./components/RatingDialog";
import ChatHistoryDialogBox from "@/app/alert-dialog-box/ChatHistoryDialog";

const tabList = [
  { id: "PAYMENT", label: "Payment" },
  { id: "PENDING", label: "Pending" },
  { id: "ACCEPTED", label: "Accepted" },
  { id: "ONGOING", label: "Ongoing" },
  { id: "DONE", label: "Done" },
  { id: "CANCELLED", label: "Cancelled" },
];

const OrderHistory: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("PENDING");
  const { user } = useSession();
  const { setIsLoading } = useLoading();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  // const [isChatOpen, setIsChatOpen] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [reload, setReload] = useState(false);

  const [onlineConsultations, setOnlineConsultations] = useState<any[]>([]);
  const [homecareConsultations, setHomecareConsultations] = useState<any[]>([]);

  const bookingService = new BookingService();
  const paymentService = new PaymentService();

  const loadBookings = async () => {
    setIsLoading(true);
    if (!user) return;
    const bookings = await bookingService.fetchBookingConsultationHomecare(
      user.id,
      selectedTab
    );
    if (bookings.online) setOnlineConsultations(bookings.online);
    else setOnlineConsultations([]);
    if (bookings.homecare) setHomecareConsultations(bookings.homecare);
    if (bookings.emergency) setHomecareConsultations(prev => [...prev, ...bookings.emergency]);
    else setHomecareConsultations([]);
    console.log(bookings);
    setIsLoading(false);
    setReload(false);
  };

  useEffect(() => {
    loadBookings();
  }, [selectedTab, reload]);

  const handlePaymentClick = async (booking) => {
    try {
      setIsDetailOpen(false);
      const resultPayment = await paymentService.fetchTransactionToken(
        booking.id
      );
      if (!resultPayment.ok) {
        throw new Error("Failed to get payment token");
      }
      showPaymentSnap(
        resultPayment.data,
        { bookingId: booking.id },
        {
          onSuccess: () => {
            console.log("masuk");
            setReload(true);
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelAppointment = async (booking) => {
    try {
      setIsDetailOpen(false);
      const resultCancel = await bookingService.changeBookingStatus(
        booking.id,
        "CANCELLED"
      );
      if (resultCancel.ok) {
        setReload(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" p-4 flex flex-col items-center overflow-x-hidden">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl text-[#3D8D7A] dark:text-white mb-6 dark:text-white">
          Order <span className="font-bold">History</span>
        </h1>

        {/* Bone-like connector line */}
        <div className="w-full flex justify-center mb-6">
          <img
            src="/img/bone.png"
            alt="Bone Divider"
            className="w-full"
          />
        </div>

        {/* Status labels */}
        <div className="flex pb-2 sm:justify-center md:gap-20 gap-10 text-sm w-[90vw] overflow-x-scroll md:overflow-x-hidden">
          {tabList.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`text-[#3D8D7A] dark:text-white font-medium ${
                tab.id === selectedTab ? "underline" : ""
              } hover:underline`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Consultation Card */}
      <div className="bg-white dark:bg-[#2D4236] w-full md:w-[70vw] rounded-2xl p-5 shadow-sm border mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex flex-col">
            <h3 className="text-2xl font-semibold text-[#3D8D7A] dark:text-white">
              Consultation
            </h3>
            <div className="h-[2px] bg-[#3D8D7A] w-1/2"></div>
          </div>
          <Headset className="w-6 h-6 text-[#3D8D7A] dark:text-white" />
        </div>
        {onlineConsultations.length === 0 && (
          <p className="text-gray-500 dark:text-gray-200 italic">No consultation orders found.</p>
        )}
        {onlineConsultations.map((consultation, index) => (
          <div key={consultation.id}>
            <OrderCard
              booking={consultation}
              setRatingOpen={setIsRatingOpen}
              setIsDetailOpen={setIsDetailOpen}
              setIsChatOpen={setIsChatOpen}
              setSelectedBooking={setSelectedBooking}
              handleAction={
                selectedTab === "PAYMENT"
                  ? handlePaymentClick 
                : selectedTab === "PENDING" 
                  ? handleCancelAppointment
                : () => console.log("click")
              }
            />
            {index != onlineConsultations.length - 1 && (
              <div className="w-full my-4 h-[1px] bg-gray-200"></div>
            )}
          </div>
        ))}
      </div>

      {/* Homecare Card */}
      <div className="bg-white dark:bg-[#2D4236] w-full md:w-[70vw] rounded-2xl p-5 shadow-sm border mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex flex-col">
            <h3 className="text-2xl font-semibold text-[#3D8D7A] dark:text-white">
              Homecare
            </h3>
            <div className="h-[2px] bg-[#3D8D7A] w-1/2"></div>
          </div>
          <House className="w-6 h-6 text-[#3D8D7A] dark:text-white" />
        </div>

        {homecareConsultations.length === 0 && (
          <p className="text-gray-500 dark:text-gray-200 italic">No homecare orders found.</p>
        )}
        
        {homecareConsultations.map((consultation, index) => (
          <div key={consultation.id}>
            <OrderCard
              booking={consultation}
              setRatingOpen={setIsRatingOpen}
              setIsDetailOpen={setIsDetailOpen}
              setIsChatOpen={setIsChatOpen}
              setSelectedBooking={setSelectedBooking}
              handleAction={
                selectedTab === "PAYMENT"
                  ? handlePaymentClick
                  :selectedTab === "PENDING" 
                  ? handleCancelAppointment
                  : () => console.log("click")
              }
            />
            {index != onlineConsultations.length - 1 && (
              <div className="w-full my-4 h-[1px] bg-gray-200"></div>
            )}
          </div>
        ))}
      </div>

      {isChatOpen && (
        <ChatDialogBox
          isOpen={isChatOpen}
          setIsOpen={setIsChatOpen}
          booking={selectedBooking}
        />
      )}
      {selectedBooking && isDetailOpen && (
        <OrderDetailOverlay
          open={selectedBooking != null}
          setIsOpen={setIsDetailOpen}
          booking={selectedBooking}
          handleAction={
            selectedTab === "PAYMENT"
              ? handlePaymentClick
              : () => console.log("click")
          }
        />
      )}
      {isRatingOpen && (
        <RatingDialog
          show={isRatingOpen}
          onClose={() => setIsRatingOpen(false)}
          onSubmit={() => setReload(true)}
          booking={selectedBooking}
        />
      )}
      {selectedTab === "DONE" && (
        <ChatHistoryDialogBox
          isOpen={isChatOpen}
          setIsOpen={setIsChatOpen}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default OrderHistory;
