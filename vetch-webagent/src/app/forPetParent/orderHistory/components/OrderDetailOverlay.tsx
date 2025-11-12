// components/OrderDetailOverlay.tsx
"use client";
import { BookingWithRelations } from "@/app/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookingService } from "@/lib/services/BookingService";
import {
  ageFromDob,
  formatAge,
  formatIsoJakarta,
} from "@/lib/utils/formatDate";
import { DialogTitle } from "@radix-ui/react-dialog";
import { capitalize, snakeCase } from "lodash";
import {
  ClipboardPlus,
  X,
  AlignLeft,
  ClockFading,
  BanknoteArrowDown,
  Ambulance,
  Star,
} from "lucide-react";
import Image from "next/image";

// Tipe untuk props komponen
interface PetDetailProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  booking?: BookingWithRelations | null;
  handleAction: (booking?: any) => void;
}

export default function OrderDetailOverlay({
  open,
  setIsOpen,
  booking,
  handleAction,
}: PetDetailProps) {

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent
        showCloseButton={false}
        className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]"
      >
        <DialogTitle className="flex items-start justify-between">
          <span className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Details
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 dark:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </DialogTitle>

        {/* Pet Info */}
        <div className="space-y-3">
          <div className="flex flex-row gap-2 items-center">
            <ClockFading className="w-10 h-10 text-black dark:text-white" />
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {booking?.bookingType!=="Emergency"?formatIsoJakarta(
                  booking?.bookingDate.split("T")[0] +
                    "T" +
                    booking?.bookingTime.split("T")[1]
                ):"EMERGENCY BOOKING"}
              </p>
              <p className="text-base text-gray-500">Consultation Time</p>
            </div>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <Image
              src={`/img/pet-logo/${snakeCase(booking?.pet?.speciesName)}.png`}
              alt="Pet Species"
              className="dark:invert"
              width={40}
              height={40}
            />
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                {booking?.pet?.petName}
              </p>
              <p className="text-base text-gray-500">
                {booking?.pet?.speciesName}
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <ClipboardPlus className="w-10 h-10 text-black dark:text-white" />
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                Concerns
              </p>
              <p className="text-base text-gray-500">
                {booking?.concernDetails &&  booking?.concernDetails
                  .map((c: any) => c.concern.concernName)
                  .join(", ")}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <AlignLeft className="w-10 h-10 text-black dark:text-white" />
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                Illness Description
              </p>
            </div>
            <textarea
              disabled
              value={booking?.illnessDescription}
              className="w-full p-2 border min-h-[100px] border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          {booking?.bookingStatus === "DONE" && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-center">
                <Ambulance className="w-10 h-10 text-black dark:text-white" />
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  Conclusion
                </p>
              </div>
              <textarea
                disabled
                value={booking?.bookingConclusion}
                className="w-full p-2 border min-h-[100px] border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
          )}
          {booking?.rating && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-center">
                <Star className="w-6 h-6 text-black dark:text-white" />
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  Rating
                </p>
              </div>
              <span className="text-xl px-2 font-semibold text-yellow-500 dark:text-yellow-400">
                {booking.rating.rating} <Star fill="yellow" className="inline-block w-5 h-5 text-yellow-400 mb-1" />
              </span>
              <textarea
                disabled
                value={booking?.rating?.context}
                className="w-full p-2 border min-h-[100px] border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* ... (Sisa JSX lain tidak berubah) ... */}

        {booking?.bookingStatus === "PAYMENT" && (
          <button
            onClick={() => handleAction(booking)}
            className="bg-transparent self-center h-fit text-black px-3 py-2 rounded-lg text-sm font-medium border border-black dark:hover:bg-gray-500 hover:bg-gray-100 dark:text-white dark:border-white ml-auto mt-5 duration-200 flex items-center gap-2"
          >
            <BanknoteArrowDown />
            Continue Pay
          </button>
        )}

        {booking?.bookingStatus === "ONGOING" && (
          <button
            onClick={() => {
              //   setIsChatOpen(true);
              //   setSelectedBooking(booking?);
            }}
            className="bg-transparent self-center h-fit text-black px-3 py-2 rounded-lg text-sm font-medium border border-black dark:hover:bg-gray-500 hover:bg-gray-100 dark:text-white dark:border-white ml-auto mt-5 duration-200 flex items-center gap-2"
          >
            <Image
              src="/img/chat_bubble.png"
              className="dark:invert"
              alt="chat bubble icon"
              width={20}
              height={20}
            />
            Chat With Vet
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
