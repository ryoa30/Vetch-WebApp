"use client";

import Image from "next/image";
import OTPHeader from "@/components/OTPheader";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OTPPage() {
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
        <InputOTP maxLength={4}>
          <InputOTPGroup className="gap-4">
            {[0, 1, 2, 3].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="!bg-white !text-black rounded-md border border-gray-300 !focus:ring-gray-300"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {/* Submit Button */}
        <Button className="bg-white text-black hover:bg-gray-200">
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
