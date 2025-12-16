"use client";
import Image from "next/image";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { IVet } from "@/app/forPetParent/consultationVetList/types";
import { useSession } from "@/contexts/SessionContext";
import LoginConfirmDialog from "@/app/alert-dialog-box/LoginConfirmDialogBox";

export default function DoctorScheduleCard({ doctor }: { doctor: IVet }) {
  const router = useRouter();
  const { isAuthenticated } = useSession();

  return (
    
    <div onClick={() =>{
            if(isAuthenticated){
              router.push(
                `/forPetParent/consultationVetList/consultationDetails?${new URLSearchParams(
                  { id: doctor.id }
                ).toString()}`
              )
            }}
          } 
      className="bg-white dark:bg-[#2D4236] rounded-2xl shadow-md overflow-hidden w-[45vw] sm:w-72 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      {/* Image placeholder */}
      {!isAuthenticated ? (
        <LoginConfirmDialog>
          <button className="w-full h-[40vw] sm:h-48 pb-2 flex items-center justify-center">
            <Image
              src={doctor.profilePicture} // replace with your actual image
              alt="Doctor"
              width={200}
              height={200}
              className="hidden sm:block object-cover h-full w-full"
            />

            <Image
              src={doctor.profilePicture} // replace with your actual image
              alt="Doctor"
              width={100}
              height={100}
              className="block sm:hidden object-cover h-full w-full"
            />
          </button>
        </LoginConfirmDialog>
      ) : (
        <button
          onClick={() =>
            router.push(
              `/forPetParent/consultationVetList/consultationDetails?${new URLSearchParams(
                { id: doctor.id }
              ).toString()}`
            )
          }
          className="w-full h-[40vw] sm:h-48 pb-2 flex items-center justify-center"
        >
          <Image
            src={doctor.profilePicture} // replace with your actual image
            alt="Doctor"
            width={200}
            height={200}
            className="hidden sm:block object-cover h-full w-full"
          />

          <Image
            src={doctor.profilePicture} // replace with your actual image
            alt="Doctor"
            width={100}
            height={100}
            className="block sm:hidden object-cover h-full w-full"
          />
          
        </button>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-gray-800 dark:text-white text-base sm:text-2xl font-semibold">
            {doctor.fullName}
          </h3>
          <span className="text-gray-800 dark:text-white text-sm sm:text-base font-medium">Fee</span>
        </div>

        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center text-sm text-gray-800 dark:text-white">
            <Star
              className="text-green-600 fill-green-600 mr-1 stroke-black"
              size={16}
            />
            {/* {rating} <span className="ml-1">({reviews})</span> */}
            {doctor.ratingAvg}{" "}
            <span className="ml-1">({doctor.ratingCount})</span>
          </div>
          <span className=" text-gray-800 dark:text-white text-sm">
            Rp {new Intl.NumberFormat("id-ID").format(doctor.price)}
          </span>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-[#f6ffd8] dark:bg-[#2D4236] px-2 sm:px-4 py-3">
        <p className="text-xs sm:text-sm text-gray-800 dark:text-white font-medium mb-2">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="flex justify-center gap-2 mb-3">
          {doctor.schedules.map((schedule, index) => {
            if (isAuthenticated) {
              return (
                <button
                  key={index}
                  className="bg-[#3D8D7A] dark:bg-[#000000] text-xs sm:text-base text-white px-2 sm:px-2 py-1 rounded-full hover:bg-green-600 hover:dark:bg-[#3D8D7A] transition-colors"
                  onClick={() => {
                    router.push(
                      `/forPetParent/consultationVetList/consultationDetails?${new URLSearchParams(
                        { id: doctor.id, time: schedule.timeOfDay }
                      ).toString()}`
                    );
                  }}
                >
                  {schedule.timeOfDay}
                </button>
              );
            } else {
              return (
                <LoginConfirmDialog key={index}>
                  <button
                    className="bg-[#3D8D7A] dark:bg-[#000000] text-xs sm:text-base text-white px-2 sm:px-4 py-1 rounded-full hover:bg-green-600 hover:dark:bg-[#3D8D7A] transition-colors"
                  >
                    {schedule.timeOfDay}
                  </button>
                </LoginConfirmDialog>
              );
            }
          })}
        </div>
        {isAuthenticated && 
        (<button className="text-center w-full font-medium text-xs sm:text-base text-gray-800 hover:underline">
          <a
            href={`/forPetParent/consultationVetList/consultationDetails?${new URLSearchParams(
              { id: doctor.id }
            ).toString()}`}
            className="block px-4 py-2 text-gray-800 dark:text-white"
          >
            See Details
          </a>
        </button>)
        }
        {!isAuthenticated && 
        (
        <LoginConfirmDialog>
          <button className="text-center w-full font-medium text-xs sm:text-base text-gray-800 hover:underline">
            <a
              className="block px-4 py-2 text-gray-800 dark:text-white"
            >
              See Details
            </a>
          </button>
        </LoginConfirmDialog>
        )
        }
      </div>
    </div>
  );
}
