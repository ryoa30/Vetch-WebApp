import { snakeCase } from "lodash";
import Image from "next/image";
import React from "react";
import { BanknoteArrowDown, History, MessageCircle, Star } from "lucide-react";
import { formatIsoJakarta } from "@/lib/utils/formatDate";
import { PaymentService } from "@/lib/services/PaymentService";
import { showPaymentSnap } from "@/lib/utils/snapPayment";

const OrderCard = ({
  booking,
  setIsChatOpen,
  setIsDetailOpen,
  setRatingOpen,
  setSelectedBooking,
  handleAction,
}) => {
  // console.log(booking);

  return (
    <div className="flex flex-col sm:flex-row gap-4 h-fit ">
      {/* Content */}
      <div className="flex-1 flex flex-row gap-3">
        <img
          src={
            booking.vet.user.profilePicture ||
            "https://res.cloudinary.com/daimddpvp/image/upload/v1758101764/default-profile-pic_lppjro.jpg"
          }
          alt="Avatar"
          className="sm:h-[150px] h-[80px] aspect-square rounded-md border"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h4 className="font-semibold text-2xl text-black dark:text-white">
                dr. {booking.vet.user.fullName}
              </h4>
              <p className="text-sm text-black font-semibold dark:text-white">
                <span className="font-bold text-[#3D8D7A] dark:text-white">Time:</span>{" "}
                {booking.bookingType!=="Emergency"?formatIsoJakarta(
                  booking.bookingDate.split("T")[0] +
                    "T" +
                    booking.bookingTime.split("T")[1]
                ):"EMERGENCY BOOKING"}
              </p>
              <div className="flex items-center mt-1">
                <Image
                  className="dark:invert"
                  src={`/img/pet-logo/${snakeCase(booking.pet.speciesName)}.png`}
                  alt="pet icon"
                  width={30}
                  height={30}
                />
                <span className="text-base">
                  {booking.pet.petName} | {booking.pet.speciesName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <button
              className="text-[#3674B5] dark:text-[#69B9FF] text-sm font-medium cursor-pointer hover:underline"
              onClick={() => {
                setSelectedBooking(booking);
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
      <div className="flex items-center">
        {booking.bookingStatus === "PAYMENT" && (
          <button
            onClick={() => handleAction(booking)}
            className="bg-transparent self-center w-full sm:w-fit h-fit text-black dark:text-white px-3 py-2 rounded-lg text-sm font-medium border border-black dark:border-white dark:hover:bg-gray-500 hover:bg-gray-100 duration-200 flex items-center gap-2"
          >
            <BanknoteArrowDown />
            Continue Pay
          </button>
        )}
        {booking.bookingStatus === "DONE" && !booking.rating && (
          <div className="flex flex-row sm:flex-col gap-2 w-full">
            <button
              onClick={() => {setSelectedBooking(booking);setRatingOpen(true)}}
              className="w-full bg-transparent self-center h-fit flex-1/2 text-black px-3 py-2 rounded-lg text-sm font-medium border border-black dark:hover:bg-gray-500 hover:bg-gray-100 dark:text-white dark:border-white duration-200 flex items-center gap-2"
            >
              <Star />
              Rate
            </button>
            <button
            onClick={() => {
              setIsChatOpen(true);
              setSelectedBooking(booking);
            }}
            className="bg-transparent self-center h-fit flex-1/2 text-black px-3 py-2 rounded-lg text-sm font-medium border border-black dark:hover:bg-gray-500 hover:bg-gray-100 dark:text-white dark:border-white duration-200 flex items-center gap-2"
          >
            <div className="w-6 h-6 relative">
              <History className="absolute w-3 h-3 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black dark:text-white" />
              <MessageCircle className="w-6 h-6 text-black dark:text-white" />
            </div>
            Chat History
          </button>
          </div>
        )}
        {booking.bookingStatus === "DONE" && booking.rating && (
          <div className="flex flex-row sm:flex-col gap-2 w-full">
            <span className="text-center text-xl flex-1/2 font-semibold h-fit self-center text-yellow-500">
              {"Rated " + booking.rating.rating + " ★"}
            </span>
            <button
            onClick={() => {
              setIsChatOpen(true);
              setSelectedBooking(booking);
            }}
            className="bg-transparent flex-1/2 self-center h-fit text-black px-3 py-2 rounded-lg text-sm font-medium border border-black dark:hover:bg-gray-500 hover:bg-gray-100 dark:text-white dark:border-white duration-200 flex items-center gap-2"
          >
            <div className="w-6 h-6 relative">
              <History className="absolute w-3 h-3 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black dark:text-white" />
              <MessageCircle className="w-6 h-6 text-black dark:text-white" />
            </div>
            Chat History
          </button>
          </div>
        )}
        {booking.bookingStatus === "PENDING" && (
          <span className="text-center h-fit self-center text-yellow-600">
            Waiting For Vet Acceptance
          </span>
        )}
        {booking.bookingStatus === "ONGOING" && (
          <button
            onClick={() => {
              setIsChatOpen(true);
              setSelectedBooking(booking);
            }}
            className="bg-transparent w-full justify-center self-center h-fit text-black px-3 py-2 rounded-lg text-sm font-medium border border-black dark:hover:bg-gray-500 hover:bg-gray-100 dark:text-white dark:border-white duration-200 flex items-center gap-2"
          >
            <Image
              src="/img/chat_bubble.png"
              alt="chat bubble icon"
              className="dark:invert"
              width={20}
              height={20}
            />
            Chat With Vet
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
