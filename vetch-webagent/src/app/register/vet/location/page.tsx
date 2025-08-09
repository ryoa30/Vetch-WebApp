"use client";

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import RegisterHeader from "@/components/registervetheader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RegisterLocationPage = () => {
  return (
    <div className="min-h-screen bg-[#A3D1C6] text-gray-800 flex flex-col items-center">
      {/* Header */}
      <RegisterHeader />

      <div className="relative w-full max-w-4xl -mt-4 bg-[#B3D8A8] rounded-xl p-6 md:p-16 flex flex-col md:flex-row items-center gap-8">
        <Image
          src="/img/register/paw.png"
          alt="Paw Icon"
          width={50}
          height={50}
          className="absolute top-4 right-4 opacity-80"
        />

        {/* Form Section */}
        <div className="flex-1 w-full space-y-4">
          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">
              Address<span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              placeholder="Eg. (Jl. ABC Blok C No. 12, Kelurahan XYZ, Kecamatan PQR)"
              required
              className="!bg-[#FBFFE4]"
            />
          </div>
          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="email">Address Notes (Apt,suite,etc)</Label>
            <Input
              id="email"
              placeholder="Eg. (White Building, Room Number 12, etc)"
              required
              className="!bg-[#FBFFE4]"
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">
              City<span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger id="city" className=" w-full !bg-[#FBFFE4]">
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent side="bottom" avoidCollisions={false}>
                <SelectItem value="jakarta">Jakarta</SelectItem>
                <SelectItem value="bandung">Bandung</SelectItem>
                <SelectItem value="surabaya">Surabaya</SelectItem>
                <SelectItem value="medan">Medan</SelectItem>
                <SelectItem value="yogyakarta">Yogyakarta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Province */}
          <div className="space-y-2">
            <Label htmlFor="provinsi">
              Province<span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger id="provinsi" className=" w-full !bg-[#FBFFE4]">
                <SelectValue placeholder="Select your province" />
              </SelectTrigger>
              <SelectContent side="bottom" avoidCollisions={false}>
                <SelectItem value="dki jakarta">DKI Jakarta</SelectItem>
                <SelectItem value="jawabarat">Jawa Barat</SelectItem>
                <SelectItem value="jawatimur">Jawa Timur</SelectItem>
                <SelectItem value="sumaterautara">Sumatera Utara</SelectItem>
                <SelectItem value="diyogyakarta">DI Yogyakarta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <Label htmlFor="postal code">
              Postal Code<span className="text-red-500">*</span>
            </Label>
            <Input
              id="postal code"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={5}
              placeholder="Eg. 40123"
              required
              className="w-full !bg-[#FBFFE4]"
            />
          </div>

          {/* Register Button */}
          <div className="absolute bottom-0 right-[75px]">
            <Link href="/OTP">
              <Button className="w-32 bg-white text-black hover:bg-[#356f61]">
                Register
              </Button>
            </Link>
          </div>
          <div className="absolute bottom-4 left-[65px]">
            <Link href="/register/vet/account">
              <Button className="w-32 bg-white text-black hover:bg-[#356f61]">
                Back
              </Button>
            </Link>
          </div>
        </div>

        {/* Vet Image */}
        <div className="hidden md:block">
          <Image
            src="/img/register/location-vet.png"
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

export default RegisterLocationPage;
