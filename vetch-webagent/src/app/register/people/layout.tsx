// /app/register/layout.tsx
"use client";

import RegisterPeopleHeader from "@/components/registerpeopleheader";
import { RegisterPeopleContextProvider } from "@/contexts/RegisterPeopleContext";

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <RegisterPeopleContextProvider>
        <div className="min-h-screen bg-[#A3D1C6] text-gray-800 flex flex-col items-center">
            <RegisterPeopleHeader />
            {children}
        </div>
    </RegisterPeopleContextProvider>
);
}
