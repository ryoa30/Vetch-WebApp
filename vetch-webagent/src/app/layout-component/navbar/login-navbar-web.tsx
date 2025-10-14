"use client";

import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import ToggleTheme from "@/components/ToggleTheme";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginConfirmDialog from "@/app/alert-dialog-box/LoginConfirmDialogBox";

export function NavbarDesktop() {
  return (
    <nav className="hidden md:flex w-full bg-[#3D8D7A] dark:bg-[#1F2D2A] text-white shadow-sm">
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

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="space-x-6">
            {/* For Pet Parents */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-white font-bold text-base">
                For Pet Parents
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-[#B3D8A8] dark:bg-[#357C72]">
                <div className="p-4 w-48 flex flex-col gap-2">
                  <NavigationMenuLink asChild>
                    <Link href="/forPetParent/consultationVetList" className="text-base">
                      Consultation
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="#" className="text-base">
                      Emergency
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Other Links */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/register/vet/account"
                  className="bg-transparent text-white hover:underline font-bold text-base"
                >
                  Become a Vet
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/blog"
                  className="bg-transparent text-white hover:underline font-bold text-base"
                >
                  Blog
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/about"
                  className="bg-transparent text-white hover:underline font-bold text-base"
                >
                  About Us
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Profile & Theme Toggle */}
        <div className="flex items-center gap-4 relative">
          {/* Profile pakai DropdownMenu */}
          <Link href="/login">
              <Button className="bg-white text-[#3D8D7A] font-semibold hover:bg-gray-100">
                Login
              </Button>
            </Link>

          <ToggleTheme />
        </div>
      </div>
    </nav>
  );
}
export default NavbarDesktop;
