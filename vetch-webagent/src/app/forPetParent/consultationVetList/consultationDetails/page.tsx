"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import ReviewCard from "@/components/ui/reviewCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { VetService } from "@/lib/services/VetService";
import { useEffect, useState } from "react";
import { ISchedules, IVet } from "../types";
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function DoctorProfile() {
  const sp = useSearchParams();
  const id = sp.get("id");
  const time = sp.get("time");
  const { setIsLoading } = useLoading();
  const [ratings, setRatings] = useState([]);
  const [showAllRating, setShowAllRating] = useState(false);
  const [seeMore, setSeeMore] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(time);
  const [timeSlots, setTimeSlots] = useState<ISchedules[]>([]);
  
  const vetService = new VetService();
  const [vet, setVet] = useState<IVet>();
  const router = useRouter();

  const loadVetDetails = async () => {
    setIsLoading(true);
    if (id) {
      try {
        const result = await vetService.getVetDetails(id);
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
        const result = await vetService.getVetRatings(id);
        if (result.ok) {
          console.log(result);
          setRatings(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  
  const loadTimeSlots = async () => {
    if (id && selectedDate) {
      const day = selectedDate.getDay() === 0 ? 7: selectedDate.getDay();
      console.log(day);
      try {
        const result = await vetService.getVetSchedules(id, day);
        if (result.ok) {
          console.log(result);
          setTimeSlots(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    loadVetDetails();
    loadRatings();
  }, []);

  useEffect(() => {
    loadTimeSlots();
  }, [selectedDate])

  const formattedDate = (() => {
    if(selectedDate){
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const year = selectedDate.getFullYear();
      return `${day} ${
        months[selectedDate.getMonth()]
      } ${year}`;
    }else{
      return "";
    }
    })();

  // console.log(selectedTime);

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
            <h2 className="text-2xl font-semibold text-[#0F5544] dark:text-white">
              Dr. {vet?.fullName}
            </h2>

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
            {/* Calendar */}
            <div className="bg-white dark:bg-[#2D4236] rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl sm:w-[300px] sm:p-6 shadow-lg">
              <Calendar
                mode="single"
                disabled={(date) => {
                  const currentDate = new Date();
                  currentDate.setDate(currentDate.getDate() - 1);
                  return (
                    date.toISOString().substring(0, 10) <
                    currentDate.toISOString().substring(0, 10)
                  );
                }}
                selected={selectedDate}
                onSelect={(date)=>{setSelectedDate(date); setSelectedTime("")}}
                className="rounded-md bg-white dark:bg-[#2D4236] mx-auto w-[300px] sm:w-auto"
              />
            </div>

            {/* Appointment Details */}
            <div className="bg-white dark:bg-[#2D4236] shadow-lg rounded-b-2xl rounded-t-none sm:rounded-b-none sm:!rounded-r-2xl sm:w-[60vw] max-w-[1000px] flex flex-col py-3">
              <div className=" sm:w-[60vw] max-w-[1000px] shadow-lg">
                <h4 className="px-3 text-2xl font-semibold text-[#0F5544] dark:text-white mb-4">
                  Appointment Time
                </h4>
                <div className="flex overflow-x-scroll custom-scrollbar max-w-[1000px]">
                  { timeSlots.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(time.timeOfDay)}
                      className={`
                        py-2 px-5 mx-3 mb-5 rounded-lg border text-lg font-medium transition-colors
                        ${
                          selectedTime === time.timeOfDay
                            ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
                        }
                      `}
                    >
                      {time.timeOfDay}
                    </button>
                  ))}
                  {timeSlots.length === 0 && (
                    <span className="p-3 text-lg font-bold mb-[14px] text-gray-500 dark:text-gray-400">
                      No available time slots for the selected date.
                    </span>
                  )}
                </div>
              </div>

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
                    {new Intl.NumberFormat("id-ID").format(Number(vet?.price))}
                  </span>
                </div>
              </div>

              <div className="px-3 flex justify-between items-center mt-auto">
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  You wont be charged yet
                </p>
                <Button
                    onClick={() => {if(vet)router.push(`/forPetParent/consultationVetList/consultationBooking?${new URLSearchParams({ id: vet.id, time: selectedTime || "", date: formattedDate}).toString()}`)}} 
                  className="bg-white text-black border px-7 py-5 rounded-xl text-lg hover:bg-red-500 hover:text-white"
                  disabled={!selectedDate || !selectedTime}
                >
                  Continue Booking
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
              ratings.slice(0, 6).map((rating, index) => {
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
    </div>
  );
}
