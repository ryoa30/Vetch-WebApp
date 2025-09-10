"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, User, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToggleTheme from "@/components/ToggleTheme";

export function NavbarMobile() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex md:hidden w-full bg-[#3D8D7A] text-white shadow-sm relative">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/img/logo/logo-white.png"
            alt="Logo"
            width={32}
            height={32}
          />
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white rounded-full hover:bg-[#2f6c5f]"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/login" className="w-full">
                  Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/register" className="w-full">
                  Register
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Toggle Theme */}
          <ToggleTheme />

          {/* Hamburger Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-[#2f6c5f]"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-[#B3D8A8] shadow-md z-50 p-4 flex flex-col gap-3 text-[#2f2f2f]">
          <span className="font-semibold">For Pet Parents</span>
          <Link href="#" className="hover:underline pl-3">
            Consultation
          </Link>
          <Link href="#" className="hover:underline pl-3">
            Homecare
          </Link>
          <Link href="#" className="hover:underline pl-3">
            Emergency
          </Link>
          <Link href="#" className="hover:underline">
            Become a Vet
          </Link>
          <Link href="#" className="hover:underline">
            Blog
          </Link>
          <Link href="/about" className="hover:underline">
            About Us
          </Link>
        </div>
      )}
    </nav>
  );
}
