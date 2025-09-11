"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import AccountForm from "../../components/AccountForm";

const RegisterPeopleAccountPage = () => {

  const router = useRouter();

  const onClickNext = () => {
    router.push('/register/people/pet');
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
        
        <AccountForm onClickNext={onClickNext} role="user" />

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
