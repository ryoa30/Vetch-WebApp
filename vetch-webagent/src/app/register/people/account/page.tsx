"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserValidator } from "@/lib/validators/UserValidator";
import { useRegisterPeople } from "@/contexts/RegisterPeopleContext";

interface IErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

const RegisterPeopleAccountPage = () => {
  const {email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, firstName, setFirstName, lastName, setLastName, phone, setPhone} = useRegisterPeople();

  const [errors, setErrors] = useState<IErrors>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const userValidator = new UserValidator();

  const router = useRouter();

  const handleNext = async () =>{
    const result = userValidator.validateAccountInfo({email, password, confirmPassword, firstName, lastName, phone});
    if(!result.ok){
      setErrors(result.errors);
    }else{
      const result = await userValidator.validateEmail(email);
      if(!result.ok){
        setErrors(result.errors);
      }else{
        router.push('/register/people/pet');
      }
    }
  }

  return (

      <div className="relative w-full h-fit max-w-4xl -mt-4 bg-[#B3D8A8] rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-start gap-8">  
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
            <Input id="email" placeholder="Email must contains @ and verified" required className="!bg-[#FBFFE4] mb-0" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password">Password<span className="text-red-500">*</span></Label>
            <Input id="password" type="password" placeholder="At least 8 characters & numbers" required className="!bg-[#FBFFE4]" value={password} onChange={(e) => setPassword(e.target.value)}/>
            {errors.password &&<span className="text-red-500 text-xs">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm Password<span className="text-red-500">*</span></Label>
            <Input id="confirmPassword" type="password" placeholder="Must match password" required className="!bg-[#FBFFE4]" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            {errors.confirmPassword &&<span className="text-red-500 text-xs">{errors.confirmPassword}</span>}
          </div>

          {/* Owner Name */}
          <div className="space-y-1">
            <Label>Owner Name<span className="text-red-500">*</span></Label>
            <div className="flex gap-2">
              <div className="flex-col">
                <Input placeholder="First Name" required className="!bg-[#FBFFE4]" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                {errors.firstName &&<span className="text-red-500 text-xs">{errors.firstName}</span>}
              </div>
              <div className="flex-col">
                <Input placeholder="Last Name" required className="!bg-[#FBFFE4]" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                {errors.lastName &&<span className="text-red-500 text-xs">{errors.lastName}</span>}
              </div>
            </div>
          </div>

          {/* Owner Phone */}
          <div className="space-y-1">
            <Label htmlFor="phone">Owner Phone<span className="text-red-500">*</span></Label>
            <Input id="phone" placeholder='Must start with "08"' required className="!bg-[#FBFFE4]" value={phone} onChange={(e) => setPhone(e.target.value)} />
            {errors.phone &&<span className="text-red-500 text-xs">{errors.phone}</span>}
          </div>

          {/* Next Button */}
          <div className="absolute bottom-4 right-16">
            {/* <Link href="/register/people/pet"> */}
              <Button className="w-32 bg-[#3D8D7A] text-white hover:bg-[#356f61]" onClick={handleNext}>
                Next
              </Button>
            {/* </Link> */}
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
  );
};

export default RegisterPeopleAccountPage;
