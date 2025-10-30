"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Home, Calendar, History, User, Menu, X, Contact, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ToggleTheme from "@/components/ToggleTheme";
import LogoutConfirmDialog from "@/app/alert-dialog-box/LogoutConfirmDialogBox";
import DraggableSnapFab from "@/components/DraggableFAB";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/vet/dashboard", label: "Dashboard", icon: Home },
    { href: "/vet/schedule", label: "Schedules", icon: Calendar },
    {
      href: "/vet/patients",
      label: "Patients",
      icon: User,
    },
    { href: "/vet/history", label: "History", icon: History },
    {
      href: "/vet/profile-and-schedules/profile",
      label: "Profile & Schedules",
      icon: Contact,
    },
  ];

  return (
    <>
      <div className={`bg-black/50 backdrop-blur-sm w-full min-h-screen fixed z-[20] ${isOpen?"md:hidden":"hidden"}`} onClick={() => setIsOpen(false)}></div>
      <aside
        className={cn(
          "bg-[#3D8D7A] dark:bg-[#1F2D2A] text-white flex flex-col justify-between min-h-screen transition-all duration-300 absolute md:relative z-20",
          isOpen ? "w-64" : "w-0 md:w-16"
        )}
      >
        {/* Header */}
        <DraggableSnapFab 
          className={`bg-gray-500/50 hover:bg-gray-500/70 ${isOpen?"hidden":"md:hidden"}`}
          size={40}
          onClick={() => setIsOpen(true)}
        >
          <Menu />
        </DraggableSnapFab>
        <div className={`${isOpen ? "block" : "hidden md:block"} flex flex-col h-full`}>
          <div className="flex items-center justify-between px-4 py-4">
            {isOpen && (
              <div className="flex items-center gap-2">
                <Image
                  src="/img/logo/logo-white.png"
                  alt="Logo"
                  width={40}
                  height={40}
                />
                <h1 className="font-bold text-xl">Vetch</h1>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-white dark:hover:bg-white dark:hover:text-black hover:bg-white/20"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>

          <Separator className="bg-white/30" />

          {/* Menu */}
          <nav className="space-y-3 mt-4 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className="block">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 text-white dark:hover:bg-white dark:hover:text-black hover:bg-white/20",
                      active && "bg-white/30"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {isOpen && item.label}
                  </Button>
                </Link>
              );
            })}
            <div>
              <LogoutConfirmDialog>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 text-white dark:hover:bg-white dark:hover:text-black hover:bg-white/20",
                    ""
                  )}
                >
                  <LogOutIcon className="h-4 w-4" />
                  {isOpen && "Logout"}
                </Button>
              </LogoutConfirmDialog>
            </div>
            <div className="p-4 flex justify-center">
              {/* ToggleTheme akan berubah berdasarkan state isOpen */}
              <ToggleTheme variant={isOpen ? "full" : "icon"} />
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
