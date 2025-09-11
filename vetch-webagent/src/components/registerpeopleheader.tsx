"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

const RegisterPeopleHeader = () => {
  const pathname = usePathname();

  const isAccountPage = pathname === "/register/people/account";
  const isPetPage = pathname === "/register/people/pet";
  const isLocationPage = pathname === "/register/people/location";

  return (
    <div className="w-full bg-[#3D8D7A] flex flex-col items-center py-8">
      {/* Register title */}
      <div className="relative w-full max-w-4xl flex items-center justify-center mb-2">
        <Image
          src="/img/register/register-vetch.png"
          alt="Register to Vetch"
          width={260}
          height={60}
          priority
        />
      </div>

      {/* Bone and Tabs */}
      <div className="relative w-full max-w-4xl flex items-center justify-center">
        <Image
          src="/img/register/bone.png"
          alt="Bone"
          width={300}
          height={40}
          className="absolute top-0"
        />
        <div className="flex justify-between w-full max-w-[300px] z-10 text-white text-sm font-semibold mt-10">
            <span className={isAccountPage ? "border-b-2 border-white" : ""}>
              Account Info
            </span>
            <span className={isPetPage ? "border-b-2 border-white" : ""}>
              Pet
            </span>
            <span className={isLocationPage ? "border-b-2 border-white" : ""}>
              Location
            </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPeopleHeader;
