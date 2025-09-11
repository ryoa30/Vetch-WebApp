"use client";

import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { IoLockClosedOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import SuccessDialog from "@/app/alert-dialog-box/SuccessLogin";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [remember, setRemember] = useState("no");
  const [openSuccess, setOpenSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    // 👉 nanti diganti sama validasi login
    setOpenSuccess(true);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 bg-[#B3D8A8] flex flex-col justify-center px-8 md:px-16">
        {/* Logo */}
        <div className="flex space-x-2">
          <Image
            src="/img/logo/logo-white.png"
            alt="Vetch Logo"
            width={40}
            height={40}
            className="mb-4"
          />
          <h1 className="text-white font-bold text-2xl mb-6">Vetch</h1>
        </div>

        {/* Title */}
        <div className="flex items-center justify-center">
          <h2 className="text-4xl font-bold text-white text-center">
            Welcome Back!
          </h2>
          <Image
            src="/img/register/paw.png"
            alt="Paw"
            width={100}
            height={100}
          />
        </div>

        <img src="/img/register/bone.png" alt="" />

        {/* User Login */}
        <h3 className="text-2xl font-bold mt-2 text-white">User Login</h3>

        {/* Email */}
        <div className="relative space-y-3 mb-4 mt-2">
          <CiMail className="absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            id="email"
            placeholder="Email must contains @ and verified"
            className="bg-[#F4F9F4] border-none pl-10"
          />
        </div>

        {/* Password */}
        <div className="relative space-y-3 mb-4">
          <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="password"
            id="password"
            placeholder="Password must be at least 8 characters and contains numbers"
            className="bg-[#F4F9F4] border-none pl-10"
          />
        </div>

        {/* Remember me */}
        <div className="flex items-center justify-between mb-6">
          <RadioGroup
            value={remember}
            onValueChange={(val) =>
              setRemember(val === "yes" && remember === "yes" ? "" : val)
            }
            className="flex items-center gap-2"
          >
            <RadioGroupItem value="yes" id="remember" />
            <Label htmlFor="remember" className="text-sm cursor-pointer text-white">
              Remember me?
            </Label>
          </RadioGroup>

          <Link href="#" className="text-sm text-white hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <div className="flex justify-center items-center">
          <Button
            onClick={handleLogin}
            className="w-full bg-white text-black hover:bg-gray-100 font-semibold cursor-pointer"
          >
            Login
          </Button>
        </div>

        {/* Success Dialog */}
        <SuccessDialog open={openSuccess} 
        onOpenChange={(val) => {
            setOpenSuccess(val);
            if (!val) {
              // Kalau dialog ditutup → redirect ke homepage
              router.push("/");
            }
          }}
        />

        {/* Sign Up Links */}
        <div className="mt-4 text-sm text-center">
          <p>Don’t have an account?</p>
          <div className="flex justify-center gap-4 mt-1">
            <Link
              href="/register/vet/account"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign Up as Vet
            </Link>
            <span>|</span>
            <Link
              href="/register/owner/account"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign Up as Pet Owner
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex w-1/2 bg-[#3D8D7A] relative flex-col items-center justify-center">
        <Image
          src="/img/login/foot-step.png"
          alt="Pets Illustration"
          width={400}
          height={400}
          className="object-contain"
        />
        <h1 className="mt-24 text-white text-4xl font-semibold text-center">
          Caring for Your Pets, <br />Anytime, Anywhere
        </h1>
        <Image
          src="/img/login/girl-walking.png"
          alt="Pets Illustration"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>
    </div>
  );
}
