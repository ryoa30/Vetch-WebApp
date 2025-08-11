"use client";

import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import NavigationBar from "@/components/navigationbar";

export default function HomePage() {
  const [remember, setRemember] = useState("no");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation at the top */}
      <NavigationBar />

      {/* Page content */}
      <div className="flex flex-1">
        {/* Left Side - Form */}
        <div className="w-full bg-[#B3D8A8] flex flex-col justify-center px-8 md:px-16">
        </div>
      </div>
    </div>
  );
}
