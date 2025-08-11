"use client";

import Image from "next/image";

const OTPHeader = () => {

  return (
    <div className="w-full bg-[#3D8D7A] flex flex-col items-center py-10">
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

      {/* Bone*/}
      <div className="relative w-full max-w-4xl flex items-center justify-center mb-8">
        <Image
          src="/img/register/bone.png"
          alt="Bone"
          width={300}
          height={40}
          className="absolute top-0"
        />
      </div>
    </div>
  );
};

export default OTPHeader;
