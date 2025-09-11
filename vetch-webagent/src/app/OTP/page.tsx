"use client";

import Image from "next/image";
import OTPHeader from "@/components/OTPheader";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getWithExpiry } from "@/lib/utils/localStorage";
import { useRouter } from "next/navigation";
import { UserService } from "@/lib/services/UserService";
import { HttpClient } from "@/lib/http/HttpClient";
import { API_URL } from "@/constant/apiConstant";

export default function OTPPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const userService = new UserService(new HttpClient({ baseUrl: API_URL.USER }));
  const router = useRouter();

  const checkEmail = () => {
    const email = getWithExpiry('email');
    if (email) setEmail(email);
    else router.push('/login');
  }

  console.log(email, otp)

  useEffect(() => {
      checkEmail();
    }, [])

    const handleEnterOTP = async () =>{
      checkEmail();
      if(otp.length === 6) {
        const result = await userService.validateOtp(email, otp);
        console.log(result);
        if(result.ok) {
          router.push('/login');
        }else{
          alert('Invalid OTP');
        }
      }
    }

  return (
    <div className="min-h-screen bg-[#A3D1C6] text-gray-800 flex flex-col items-center">
      {/* Header */}
      <OTPHeader />

      <div className="relative w-full h-[350px] max-w-4xl -mt-4 bg-[#B3D8A8] rounded-xl p-6 md:p-10 flex flex-col items-center justify-center gap-4">
        <h1 className="text-black text-2xl font-bold">Verification</h1>
        <p className="text-base font-semibold text-black">
          Enter the OTP code from sent to your email
        </p>

        {/* OTP Input */}
        <InputOTP maxLength={6} onChange={(otp) => setOtp(otp)}>
          <InputOTPGroup className="gap-4">
            <InputOTPSlot className="!bg-white !text-black rounded-md border border-gray-300 !focus:ring-gray-300" index={0} />
            <InputOTPSlot className="!bg-white !text-black rounded-md border border-gray-300 !focus:ring-gray-300" index={1} />
            <InputOTPSlot className="!bg-white !text-black rounded-md border border-gray-300 !focus:ring-gray-300" index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup className="gap-4">
            <InputOTPSlot className="!bg-white !text-black rounded-md border border-gray-300 !focus:ring-gray-300" index={3} />
            <InputOTPSlot className="!bg-white !text-black rounded-md border border-gray-300 !focus:ring-gray-300" index={4} />
            <InputOTPSlot className="!bg-white !text-black rounded-md border border-gray-300 !focus:ring-gray-300" index={5} />
          </InputOTPGroup>
        </InputOTP>

        {/* Submit Button */}
        <Button className="bg-white text-black hover:bg-gray-200" onClick={handleEnterOTP}>
          Enter OTP
        </Button>

        {/* Resend Link */}
        <p className="text-sm">
          Haven’t received it?{" "}
          <Link href="#" className="text-blue-600 hover:underline">
            Resend OTP
          </Link>
        </p>
      </div>
    </div>
  );
}
