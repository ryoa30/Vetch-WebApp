"use client";

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import RegisterHeader from "@/components/registervetheader";

const RegisterVetPage = () => {
  return (
    <div className="min-h-screen bg-[#A3D1C6] text-gray-800 flex flex-col items-center">
      {/* Header */}
      <RegisterHeader />
      
      <div className="relative w-full max-w-4xl -mt-4 bg-[#B3D8A8] rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
        
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

          {/* Vet Name */}
          <div className="space-y-1">
            <Label>Vet’s Name<span className="text-red-500">*</span></Label>
            <div className="flex gap-2">
              <Input placeholder="First Name" required className="!bg-[#FBFFE4]" />
              <Input placeholder="Last Name" required className="!bg-[#FBFFE4]" />
            </div>
          </div>

          {/* Vet Phone */}
          <div className="space-y-1">
            <Label htmlFor="phone">Vet’s Phone<span className="text-red-500">*</span></Label>
            <Input id="phone" placeholder='Must start with "08"' required className="!bg-[#FBFFE4]" />
          </div>

          {/* Upload Certificate */}
          <div className="space-y-1">
            <Label htmlFor="certificate">Upload Certificate<span className="text-red-500">*</span></Label>
            <Input id="certificate" type="file" className="!bg-white" />
          </div>

          {/* Homecare */}
          <div className="space-y-1">
            <Label>Are you available for Homecare?</Label>
            <p className="text-xs text-muted-foreground">You can change this later in profile</p>
            <RadioGroup defaultValue="comfortable" className="flex items-center gap-4 mt-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="homecare-yes" />
                <Label htmlFor="homecare-yes">Yes!</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Emergency Homecare */}
          <div className="space-y-1">
            <Label>Are you available for emergency Homecare?</Label>
            <p className="text-xs text-muted-foreground">You must be available for homecare first</p>
            <RadioGroup defaultValue="default" className="flex items-center gap-4 mt-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="emergency-yes" />
                <Label htmlFor="emergency-yes">Yes!</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Next Button */}
          <div className="absolute bottom-4 right-16">
            <Link href="/register/vet/location">
              <Button className="w-32 bg-[#3D8D7A] text-white hover:bg-[#356f61]">
                Next
              </Button>
            </Link>
          </div>
        </div>

        {/* Vet Image */}
        <div className="hidden md:block">
          <Image
            src="/img/register/doctor.png"
            alt="Vet Illustration"
            width={200}
            height={200}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterVetPage;
