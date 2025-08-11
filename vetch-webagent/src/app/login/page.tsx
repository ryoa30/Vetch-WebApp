"use client";

import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export default function LoginPage() {
  const [remember, setRemember] = useState("no");

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 bg-[#A3D1C6] flex flex-col justify-center px-8 md:px-16">
        {/* Logo */}
        <h1 className="text-white font-bold text-2xl mb-6">Vetch</h1>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white">Welcome Back! 🐾</h2>

        <div className="h-1 w-24 bg-white rounded-full mt-2 mb-6"></div>

        {/* User Login */}
        <h3 className="text-lg font-semibold mb-4">User Login</h3>

        {/* Email */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Email must contains @ and verified"
            className="bg-[#F4F9F4] border-none"
          />
        </div>

        {/* Password */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Password must be at least 8 characters and contains numbers"
            className="bg-[#F4F9F4] border-none"
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
            <Label htmlFor="remember" className="text-sm cursor-pointer">
              Remember me?
            </Label>
          </RadioGroup>

          <Link href="#" className="text-sm text-gray-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <Link href="/home">
          <Button className="w-full bg-white text-black hover:bg-gray-100 font-semibold">
            Login
          </Button>
        </Link>

        <div className="mt-4 text-sm text-center">
          <p>Don’t have an account?</p>
          <div className="flex justify-center gap-4 mt-1">
            <Link
              href="/register/vet/account"
              className="text-[#3D8D7A] font-medium hover:underline"
            >
              Sign Up as Vet
            </Link>
            <span>|</span>
            <Link
              href="/register/owner/account"
              className="text-[#3D8D7A] font-medium hover:underline"
            >
              Sign Up as Pet Owner
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex w-1/2 bg-[#3D8D7A] relative items-center justify-center">
        {/* Ganti ini nanti sesuai gambar */}
        <Image
          src="/img/vet/login-illustration.png"
          alt="Pets Illustration"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>
    </div>
  );
}
