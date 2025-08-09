"use client";

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RegisterPeopleHeader from "@/components/registerpeopleheader";

const RegisterPeoplePetPage = () => {
  return (
    <div className="min-h-screen bg-[#A3D1C6] text-gray-800 flex flex-col items-center">
      {/* Header */}
      <RegisterPeopleHeader />

      <div className="relative w-full max-w-4xl h-[600px] -mt-4 bg-[#B3D8A8] rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-start gap-8">
        <Image
          src="/img/register/paw.png"
          alt="Paw Icon"
          width={50}
          height={50}
          className="absolute top-4 right-4 opacity-80"
        />

        {/* Form Section */}
        <div className="flex-1 w-full space-y-4">
          {/* Pet's Name */}
          <div className="space-y-2">
            <Label htmlFor="petName">Pet's Name</Label>
            <Input
              id="petName"
              placeholder="Must at least be 3 characters"
              className="!bg-[#FBFFE4]"
            />
          </div>

          {/* Pet's Species */}
          <div className="space-y-2">
            <Label> 
              Pet's Species<span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger className="w-full !bg-[#FBFFE4]">
                <SelectValue placeholder="- Must choose one -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
                <SelectItem value="bird">Bird</SelectItem>
                <SelectItem value="rabbit">Rabbit</SelectItem>
                <SelectItem value="hamster">Hamster</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Primary Color */}
          <div className="space-y-2">
            <Label>
              Primary Color<span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger className="w-full !bg-[#FBFFE4]">
                <SelectValue placeholder="- Must choose one -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="brown">Brown</SelectItem>
                <SelectItem value="gray">Gray</SelectItem>
                <SelectItem value="golden">Golden</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>
              Gender<span className="text-red-500">*</span>
            </Label>
            <RadioGroup defaultValue="" className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="female"
                  id="female"
                  className="border-gray-400"
                />
                <Label htmlFor="female" className="cursor-pointer">
                  Female
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="male"
                  id="male"
                  className="border-gray-400"
                />
                <Label htmlFor="male" className="cursor-pointer">
                  Male
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Is your pet neutered? */}
          <div className="space-y-2">
            <Label>
              Is your pet neutered?<span className="text-red-500">*</span>
            </Label>
            <RadioGroup defaultValue="" className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="yes"
                  id="neutered-yes"
                  className="border-gray-400"
                />
                <Label htmlFor="neutered-yes" className="cursor-pointer">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="no"
                  id="neutered-no"
                  className="border-gray-400"
                />
                <Label htmlFor="neutered-no" className="cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Pet's Weight */}
          <div className="space-y-2">
            <Label htmlFor="petWeight">
              Pet's Weight<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="petWeight"
                placeholder="Weight in KG, must at least be 1 gram"
                className="!bg-[#FBFFE4] pr-12"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                KG
              </span>
            </div>
          </div>

          {/* Pet's DOB */}
          <div className="space-y-2">
            <Label htmlFor="petDob">
              Pet's DOB<span className="text-red-500">*</span>
            </Label>
            <Input
              id="petDob"
              type="date"
              placeholder="dd/mm/yyyy, cannot be in the future"
              className="!bg-[#FBFFE4]"
            />
          </div>
        </div>

        {/* Pet Illustrations */}
        <div className="hidden md:block">
          <div className="space-y-4">
            {/* Orange Cat */}
            <Image
              src="/img/register/cat.png"
              alt="Orange Cat"
              width={120}
              height={80}
              className="translate-y-4"
            />
            {/* Dog */}
            <Image
              src="/img/register/dog.png"
              alt="Dog"
              width={120}
              height={80}
              className=""
            />
            {/* Small Pet */}
            <Image
              src="/img/register/rabbit.png"
              alt="Small Pet"
              width={120}
              height={80}
              className=""
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute bottom-6 left-10">
          <Link href="/register/people/account">
            <Button
              className="w-32 bg-white text-black hover:bg-[#356f61]"
            >
              Back
            </Button>
          </Link>
        </div>

        {/* Next Button */}
        <div className="absolute bottom-6 right-16">
          <Link href="/register/people/location">
            <Button className="w-32 bg-white text-black hover:bg-[#356f61]">
              Next
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPeoplePetPage;
