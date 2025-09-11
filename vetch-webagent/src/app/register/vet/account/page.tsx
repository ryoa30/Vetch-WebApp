"use client";

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import RegisterHeader from "@/components/registervetheader";
import { useRouter } from "next/navigation";
import AccountForm from "../../components/AccountForm";

const RegisterVetPage = () => {
  const router = useRouter();
  
  const onClickNext = () => {
    router.push('/register/vet/location');
  }
  return (
      
      <div className="relative w-full max-w-4xl -mt-4 bg-[#B3D8A8] rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
        
        <Image
        src="/img/register/paw.png" 
        alt="Paw Icon"
        width={50}
        height={50}
        className="absolute top-4 right-4 opacity-80"
        />
        
        <AccountForm onClickNext={onClickNext} role="vet" />

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
  );
};

export default RegisterVetPage;
