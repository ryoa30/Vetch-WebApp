"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRegister } from "@/contexts/RegisterContext";
import { useRouter } from "next/navigation";
import LocationForm from "../../components/LocationForm";

const RegisterLocationPage = () => {
  const router = useRouter();
  const {
    isAccountInfoValid,
    isPetInfoValid,
  } = useRegister();
  
  useEffect(()=> {
    
    if(!isAccountInfoValid) {
      router.push('/register/people/account');
    }else if(!isPetInfoValid) {
      router.push('/register/people/pet');
    }
  }, [])

  return (
    <div className="relative w-full max-w-4xl -mt-4 bg-[#B3D8A8] rounded-xl p-6 md:p-16 flex flex-col md:flex-row items-center gap-8">
      <Image
        src="/img/register/paw.png"
        alt="Paw Icon"
        width={50}
        height={50}
        className="absolute top-4 right-4 opacity-80"
      />

      <LocationForm role="user"/>

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
  );
};

export default RegisterLocationPage;
