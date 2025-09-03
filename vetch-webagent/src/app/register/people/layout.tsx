// /app/register/layout.tsx
"use client";

import RegisterPeopleHeader from "@/components/registerpeopleheader";
import { RegisterPeopleContextProvider } from "@/contexts/RegisterPeopleContext";
import { getWithExpiry } from "@/lib/utils/localStorage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    useEffect(() => {
        const email = getWithExpiry('email');
        if (email) router.push('/OTP');
    }, [])
  return (
    <RegisterPeopleContextProvider>
        <div className="min-h-screen bg-[#A3D1C6] text-gray-800 flex flex-col items-center">
            <RegisterPeopleHeader />
            {children}
        </div>
    </RegisterPeopleContextProvider>
);
}
