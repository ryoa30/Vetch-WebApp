"use client";

import Image from "next/image";
import React, { useState } from "react";
import OrderCard from "./components/OrderCard";
import { Headset, House } from "lucide-react";

const tabList = [
    { id: "payment", label: "Payment" },
    { id: "pending", label: "Pending" },
    { id: "accepted", label: "Accepted" },
    { id: "ongoing", label: "Ongoing" },
    { id: "done", label: "Done" },
]

const OrderHistory: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState("payment");
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

          <OrderCard />
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

          <OrderCard />
        </div>
    </div>
  );
};

export default OrderHistory;
