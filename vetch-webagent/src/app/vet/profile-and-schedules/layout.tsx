"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";

export default function ProfileAndSchedulesLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // ✅ Fix detection supaya tidak false positive
  const isProfile = pathname.endsWith("/profile");
  const isSchedule = pathname.endsWith("/schedules");

  return (
    <div className="p-6 bg-[#A3D1C6] dark:bg-[#71998F] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-white">
          Profiles and Schedules
        </h1>
        <Input
          placeholder="Search for Veterinarian"
          className="w-full md:w-[500px] mt-3 md:mt-0 rounded-full bg-white dark:bg-white"
        />
      </div>

      {/* Bone divider */}
      <div className="w-full flex justify-center mb-6">
        <Image
          src="/img/bone.png"
          alt="Bone Divider"
          width={1000}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-8 text-lg font-medium">
        <button
          onClick={() => router.push("/vet/profile-and-schedules/profile")}
          className={`pb-1 transition-all ${
            isProfile
              ? "border-b-2 border-black text-black"
              : "text-gray-700 hover:text-black"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => router.push("/vet/profile-and-schedules/schedules")}
          className={`pb-1 transition-all ${
            isSchedule
              ? "border-b-2 border-black text-black"
              : "text-gray-700 hover:text-black"
          }`}
        >
          Schedule
        </button>
      </div>

      {/* Dynamic Page Content */}
      <div>{children}</div>
    </div>
  );
}
