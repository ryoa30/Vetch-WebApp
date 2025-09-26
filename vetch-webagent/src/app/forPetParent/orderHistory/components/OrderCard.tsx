import { snakeCase } from "lodash";
import Image from "next/image";
import React from "react";
import { BanknoteArrowDown } from "lucide-react";

const OrderCard = () => {
  return (
    <div className="flex gap-4 h-[120px]">
      {/* Avatar placeholder */}
      <img
        src="https://res.cloudinary.com/daimddpvp/image/upload/v1758101764/default-profile-pic_lppjro.jpg"
        alt="Avatar"
        className=" aspect-square rounded-md"
      />

      {/* Content */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h4 className="font-semibold text-2xl text-gray-900">dr. Seemore</h4>
            <p className="text-sm text-black font-semibold">
              <span className="font-bold text-[#3D8D7A]">Time:</span> 22 Apr
              2025 at 22:00
            </p>
            <div className="flex items-center mt-1">
              <Image
                className="dark:invert"
                src={`/img/pet-logo/cat.png`}
                alt="pet icon"
                width={30}
                height={30}
              />
              <span className="text-base">Lorensius | Cat</span>
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
      <button className="bg-transparent self-center h-fit text-black px-3 py-2 rounded-lg text-sm font-medium border border-black hover:bg-gray-100 duration-200 flex items-center gap-2">
        <BanknoteArrowDown />
        Continue Pay
      </button>
    </div>
  );
};

export default OrderCard;
