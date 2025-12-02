"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import ReviewCard from "@/components/ui/reviewCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { VetService } from "@/lib/services/VetService";
import { useEffect, useState } from "react";
import { ISchedules, IVet } from "../../consultationVetList/types";
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter, useSearchParams } from "next/navigation";
import { BookingValidator } from "@/lib/validators/BookingValidator";
import { useSession } from "@/contexts/SessionContext";
import ErrorDialog from "@/app/alert-dialog-box/ErrorDialogBox";
import { formatLocalDate } from "@/lib/utils/formatDate";

export default function DoctorProfile() {
  const sp = useSearchParams();
  const id = sp.get("id");
  const time = sp.get("time");
  const { setIsLoading } = useLoading();
  const [ratings, setRatings] = useState([]);
  const [showAllRating, setShowAllRating] = useState(false);
  const [seeMore, setSeeMore] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const {user} = useSession();
  const [selectedTime, setSelectedTime] = useState<string | null>(time);
  const [timeSlots, setTimeSlots] = useState<ISchedules[]>([]);

  const bookingValidator = new BookingValidator();

  const vetService = new VetService();
  const [showError, setShowError] = useState(false);
  const [vet, setVet] = useState<IVet>();
  const router = useRouter();

  const loadVetDetails = async () => {
    setIsLoading(true);
    if (id) {
      try {
        const result = await vetService.fetchVetDetails(id, user?.id || "");
        if (result.ok) {
          console.log(result);
          setVet(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    setIsLoading(false);
  };

  const loadRatings = async () => {
    if (id) {
      try {
        const result = await vetService.fetchVetRatings(id);
        if (result.ok) {
          console.log(result);
          setRatings(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    loadVetDetails();
    loadRatings();
  }, []);

  const handleContinueBooking = async () => {
    if (vet){

      router.push(
        `/forPetParent/emergencyVetList/emergencyBooking?${new URLSearchParams(
          {
            id: vet.id,
          }
        ).toString()}`
      );
    }
  } 


  return (
    <div className="min-h-screen bg-[#FBFFE4] dark:bg-[#2E4F4A] flex flex-col">
      <div className="p-[5vw]">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-20">
          {/* Profile Image */}
          <div className="w-64 h-64 bg-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
            <Image
              src={vet?.profilePicture || "/placeholder"}
              alt="Doctor profile"
              width={128}
              height={128}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Doctor Info */}
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <h2 className="text-2xl font-semibold text-[#0F5544] dark:text-white">
                Dr. {vet?.fullName}
              </h2>
              <h2 className="text-2xl text-[#0F5544] dark:text-white mb-3">
                {vet?.distance.text} (est. {vet?.duration.text})
              </h2>
            </div>

            <div className="flex items-center text-gray-700 dark:text-white text-sm mt-1">
              <Star className="w-4 h-4 fill-green-600 stroke-black mr-1 dark:stroke-white" />
              <span className="font-medium">{vet?.ratingAvg}</span>
              <span className="mx-1">|</span>
              <span>{vet?.ratingCount} Reviews</span>
            </div>

            {/* Species */}
            <div className="mt-4">
              <Label className="text-[#0F5544] dark:text-white font-semibold">
                Species
              </Label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {vet?.speciesHandled &&
                  vet?.speciesHandled.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white dark:bg-black border rounded-full text-sm font-medium text-gray-900 dark:text-white shadow-sm"
                    >
                      {s}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h3 className="text-4xl  text-[#0F5544] dark:text-white mb-2">
            Description
          </h3>
          <p className="text-black dark:text-white text-base text-justify leading-relaxed">
            {seeMore ? vet?.description : vet?.description?.slice(0, 400)}{" "}
            {vet?.description && vet?.description.length >= 400 && !seeMore && (
              <button
                className="text-blue-600 cursor-pointer"
                onClick={() => setSeeMore(true)}
              >
                ...see more
              </button>
            )}
            {seeMore && (
              <button
                className="text-blue-600 cursor-pointer"
                onClick={() => setSeeMore(false)}
              >
                see less
              </button>
            )}
          </p>
        </div>

        {/* Appointment Booking Section */}
        <div className="mt-8 w-full">
          <div className="flex sm:flex-row flex-col mx-auto justify-center max-w-[1300px]">
            {/* Appointment Details */}
            <div className="bg-white dark:bg-[#2D4236] shadow-lg rounded-2xl sm:w-[60vw] max-w-[1000px] flex flex-col py-3">

              <div className="px-3 py-2 mb-6">
                <h4 className="text-2xl font-semibold text-[#0F5544] dark:text-white mb-2">
                  Price
                </h4>
                <div className="flex justify-between items-center">
                  <span className="text-xl text-[#0F5544] dark:text-white">
                    Total Price
                  </span>
                  <span className="text-xl px-2 font-semibold text-[#0F5544] dark:text-white">
                    IDR{" "}
                    {new Intl.NumberFormat("id-ID").format(Number(vet?.price)*2)}
                  </span>
                </div>
              </div>

              <div className="px-3 flex justify-between items-center mt-auto">
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  You wont be charged yet
                </p>
                <Button
                  onClick={handleContinueBooking}
                  className="bg-white text-black border px-7 py-5 rounded-xl text-lg hover:bg-red-500 hover:text-white"
                >
                  Book Emergency Now!
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <h3 className="text-4xl text-[#0F5544] dark:text-white mb-4">
            Reviews
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!showAllRating &&
              ratings.slice(0, 6).map((rating, index) => {
                return <ReviewCard key={index} rating={rating} />;
              })}
            {showAllRating &&
              ratings.map((rating, index) => {
                return <ReviewCard key={index} rating={rating} />;
              })}
          </div>

          {ratings.length > 6 && (
            <div className="flex justify-left mt-6">
              <Button
                size="sm"
                onClick={() => setShowAllRating(!showAllRating)}
              >
                {showAllRating ? "Show Less" : "Show All Reviews"}
              </Button>
            </div>
          )}
        </div>
      </div>
      <ErrorDialog open={showError} onOpenChange={() => setShowError(false)} errors={["You already have a booking at this date and time"]}/>
    </div>
  );
}
