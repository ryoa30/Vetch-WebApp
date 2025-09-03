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
import { useRegisterPeople } from "@/contexts/RegisterPeopleContext";
import DatePicker from "@/components/DatePicker";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PetValidator } from "@/lib/validators/PetValidator";


interface IErrors {
  petName?: string;
  species?: string;
  primaryColor?: string;
  gender?: string;
  neuterStatus?: string;
  weight?: string;
  dob?: string;
}

const speciesList = [
  "Cat",
  "Dog",
  "Bird",
  "Rabbit",
  "Hamster",
  "Fish",
  "Reptile",
  "Exotic Pet",
  "Other"
]

const RegisterPeoplePetPage = () => {
    const { 
      petName,
      petSpecies,
      petColor,
      petGender,
      petWeight,
      petNeutered,
      petDob,
      setPetColor,
      setPetGender,
      setPetNeutered,
      setPetWeight,
      setPetSpecies,
      setPetName,
      setPetDob,
      setIsPetInfoValid,
      isAccountInfoValid} = useRegisterPeople();

    const router = useRouter();
    const [errors, setErrors] = useState<IErrors>({
      petName: '',
      species: '',
      primaryColor: '',
      gender: '',
      neuterStatus: '',
      weight: '',
      dob: '',
    });

    const petValidator = new PetValidator();

  const handleNext = () =>{
    // Validate pet information
    const result = petValidator.validatePetInfo({
      petName,
      petSpecies,
      petColor,
      petGender,
      petWeight,
      petNeutered,
      petDob,
    })
    if (!result.ok) {
      setIsPetInfoValid(false);
      setErrors(result.errors);
      return;
    }
    setIsPetInfoValid(true);
    router.push('/register/people/location');
  }

  useEffect(()=> {
    if(!isAccountInfoValid) {
      router.push('/register/people/account');
    }
  }, [])

  return (
      <div className="relative w-full max-w-4xl h-fit -mt-4 bg-[#B3D8A8] rounded-xl p-6 md:p-10 flex flex-col items-start gap-8">
        <Image
          src="/img/register/paw.png"
          alt="Paw Icon"
          width={50}
          height={50}
          className="absolute top-4 right-4 opacity-80"
        />
        <div className="flex flex-col md:flex-row items-start gap-8 w-full">
          <div className="flex-1 w-full space-y-4">
            {/* Pet&apos; Name */}
            <div className="space-y-2">
              <Label htmlFor="petName">Pet&apos;s Name</Label>
              <Input
                id="petName"
                placeholder="Must at least be 3 characters"
                className="!bg-[#FBFFE4] mb-0"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
              />
              {errors.petName && <span className="text-red-500 text-xs">{errors.petName}</span>}

            </div>

            {/* Pet&apos; Species */}
            <div className="space-y-2">
              <Label> 
                Pet&apos; Species<span className="text-red-500">*</span>
              </Label>
              <Select
                value={petSpecies}
                onValueChange={setPetSpecies}>
                <SelectTrigger className="w-full !bg-[#FBFFE4] mb-0">
                  <SelectValue placeholder="- Must choose one -" />
                </SelectTrigger>
                <SelectContent>
                  {speciesList.map((species)=>{
                    return (
                      <SelectItem key={species} value={species}>{species}</SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {errors.species && <span className="text-red-500 text-xs">{errors.species}</span>}
            </div>

            {/* Primary Color */}
            <div className="space-y-2">
              <Label>
                Primary Color<span className="text-red-500">*</span>
              </Label>
              <Select
              value={petColor}
              onValueChange={setPetColor}>
                <SelectTrigger className="w-full !bg-[#FBFFE4] mb-0">
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
              {errors.primaryColor && <span className="text-red-500 text-xs">{errors.primaryColor}</span>}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>
                Gender<span className="text-red-500">*</span>
              </Label>
              <RadioGroup defaultValue="" className="flex gap-6" value={petGender} onValueChange={setPetGender}>
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
              {errors.gender && <span className="text-red-500 text-xs">{errors.gender}</span>}
            </div>

            {/* Is your pet neutered? */}
            <div className="space-y-2">
              <Label>
                Is your pet neutered?<span className="text-red-500">*</span>
              </Label>
              <RadioGroup defaultValue="" className="flex gap-6" value={petNeutered?"yes":"no"} onValueChange={(e) => setPetNeutered(e === "yes")}>
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
              {errors.neuterStatus && <span className="text-red-500 text-xs">{errors.neuterStatus}</span>}
            </div>

            {/* Pet&apos; Weight */}
            <div className="space-y-2">
              <Label htmlFor="petWeight">
                Pet&apos; Weight<span className="text-red-500">*</span>
              </Label>
              <div className="relative mb-0">
                <Input
                  type="number"
                  id="petWeight"
                  placeholder="Weight in KG, must at least be 1 gram"
                  className="!bg-[#FBFFE4] pr-12"
                  value={petWeight}
                  onChange={(e) => {if(Number(e.target.value) >=0)setPetWeight(Number(e.target.value))}}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                  KG
                </span>
              </div>
              {errors.weight && <span className="text-red-500 text-xs">{errors.weight}</span>}
            </div>

            {/* Pet&apos; DOB */}
            <div className="space-y-2">
              <Label htmlFor="petDob">
                Pet&apos; DOB<span className="text-red-500">*</span>
              </Label>
              <DatePicker className="h-fit w-full !bg-[#FBFFE4] cursor-pointer mb-0" date={petDob} setDate={setPetDob} />
            {errors.dob && <span className="text-red-500 text-xs">{errors.dob}</span>}
            </div>
          </div>

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
        </div>


        {/* Navigation Buttons */}
        <div className="w-full flex justify-between mt-6">
            <Button
              className="w-32 bg-white text-black hover:bg-[#356f61]"
              onClick={() => router.push("/register/people/account")}
            >
              Back
            </Button>

        {/* Next Button */}
            <Button className="w-32 bg-white text-black hover:bg-[#356f61]"
            onClick={handleNext}>
              Next
            </Button>
        </div>
      </div>
  );
};

export default RegisterPeoplePetPage;
