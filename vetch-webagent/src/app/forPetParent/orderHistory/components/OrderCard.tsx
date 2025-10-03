import { snakeCase } from "lodash";
import Image from "next/image";
import React from "react";
import { BanknoteArrowDown } from "lucide-react";
import { formatIsoJakarta } from "@/lib/utils/formatDate";
import { PaymentService } from "@/lib/services/PaymentService";
import { showPaymentSnap } from "@/lib/utils/snapPayment";

const OrderCard = ({booking, setReload, setIsChatOpen, setSelectedBooking}) => {
  console.log(booking);
  const paymentService = new PaymentService();
  const handlePaymentClick = async () => {
    try {
      const resultPayment = await paymentService.fetchTransactionToken(
        booking.id,
      );
      if(!resultPayment.ok){
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
  }

  return (
    <div className="flex gap-4 h-[120px]">
      {/* Avatar placeholder */}
      <img
        src={booking.vet.user.profilePicture || "https://res.cloudinary.com/daimddpvp/image/upload/v1758101764/default-profile-pic_lppjro.jpg"}
        alt="Avatar"
        className=" aspect-square rounded-md border"
      />

      {/* Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h4 className="font-semibold text-2xl text-gray-900">dr. {booking.vet.user.fullName}</h4>
            <p className="text-sm text-black font-semibold">
              <span className="font-bold text-[#3D8D7A]">Time:</span> {formatIsoJakarta(booking.bookingDate.split("T")[0] +"T"+ booking.bookingTime.split("T")[1])}
            </p>
            <div className="flex items-center mt-1">
              <Image
                className="dark:invert"
                src={`/img/pet-logo/${snakeCase(booking.pet.speciesName)}.png`}
                alt="pet icon"
                width={30}
                height={30}
              />
              <span className="text-base">{booking.pet.petName} | {booking.pet.speciesName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button className="text-[#3674B5] text-sm font-medium cursor-pointer hover:underline">
            Details
          </button>
          <Image
            src="/img/login/foot-step.png"
            alt="Pets Illustration"
            width={100}
            height={400}
            className="object-contain"
          />
        </div>
      </div>
      {booking.bookingStatus === "PAYMENT" && <button onClick={handlePaymentClick} className="bg-transparent self-center h-fit text-black px-3 py-2 rounded-lg text-sm font-medium border border-black hover:bg-gray-100 duration-200 flex items-center gap-2">
        <BanknoteArrowDown />
        Continue Pay
      </button>}
      {booking.bookingStatus === "PENDING" && <span className="text-center h-fit self-center text-yellow-600">Waiting For Vet Acceptance</span>}
      {booking.bookingStatus === "ONGOING" && <button onClick={()=>{setIsChatOpen(true); setSelectedBooking(booking)}} className="bg-transparent self-center h-fit text-black px-3 py-2 rounded-lg text-sm font-medium border border-black hover:bg-gray-100 duration-200 flex items-center gap-2">
        <Image src="/img/chat_bubble.png" alt="chat bubble icon" width={20} height={20}/>
        Chat With Vet
      </button>}
    </div>
  );
};

export default OrderCard;
