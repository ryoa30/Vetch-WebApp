"use client";

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import RegisterPeopleHeader from "@/components/registerpeopleheader";

const RegisterPeopleAccountPage = () => {
  return (
    <div className="min-h-screen bg-[#A3D1C6] text-gray-800 flex flex-col items-center">
      {/* Header */}
      <RegisterPeopleHeader />

      <div className="relative w-full h-[450px] max-w-4xl -mt-4 bg-[#B3D8A8] rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-start gap-8">  
        <Image
        src="/img/register/paw.png" 
        alt="Paw Icon"
        width={50}
        height={50}
        className="absolute top-4 right-4 opacity-80"
        />
        
        {/* Form Section */}
        <div className="flex-1 w-full space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
            <Input id="email" placeholder="Email must contains @ and verified" required className="!bg-[#FBFFE4]" />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password">Password<span className="text-red-500">*</span></Label>
            <Input id="password" type="password" placeholder="At least 8 characters & numbers" required className="!bg-[#FBFFE4]" />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm Password<span className="text-red-500">*</span></Label>
            <Input id="confirmPassword" type="password" placeholder="Must match password" required className="!bg-[#FBFFE4]" />
          </div>

          {/* Owner Name */}
          <div className="space-y-1">
            <Label>Owner Name<span className="text-red-500">*</span></Label>
            <div className="flex gap-2">
              <Input placeholder="First Name" required className="!bg-[#FBFFE4]" />
              <Input placeholder="Last Name" required className="!bg-[#FBFFE4]" />
            </div>
          </div>

          {/* Owner Phone */}
          <div className="space-y-1">
            <Label htmlFor="phone">Owner Phone<span className="text-red-500">*</span></Label>
            <Input id="phone" placeholder='Must start with "08"' required className="!bg-[#FBFFE4]" />
          </div>

          {/* Next Button */}
          <div className="absolute bottom-4 right-16">
            <Link href="/register/people/pet">
              <Button className="w-32 bg-[#3D8D7A] text-white hover:bg-[#356f61]">
                Next
              </Button>
            </Link>
          </div>
        </div>

        {/* Vet Image */}
        <div className="hidden md:block">
          <Image
            src="/img/register/people.png"
            alt="Vet Illustration"
            width={200}
            height={200}
            priority
            className="mt-20"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPeopleAccountPage;
