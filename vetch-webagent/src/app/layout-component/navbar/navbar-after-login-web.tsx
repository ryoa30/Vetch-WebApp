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
import { User , Bell, CircleCheckBig} from "lucide-react";
import ToggleTheme from "@/components/ToggleTheme";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutConfirmDialog from "@/app/alert-dialog-box/LogoutConfirmDialogBox";
import { useEffect, useState } from "react";
import { NotificationService } from "@/lib/services/NotificationService";
import { useSession } from "@/contexts/SessionContext";
import NotificationCard from "./components/notificationCard";

export function NavbarDesktop() {
  const notificationService = new NotificationService();
  const [notifications, setNotifications] = useState<any[]>([]);
  const {user} = useSession();

  const handleConfirmAll = async()=>{
    try {
        const res = await notificationService.confirmAllNotifications(user?.id || "");
        console.log(res);
        if(res.ok){
            // remove notification from list
            loadUncomfirmedNotifications();
        }
    } catch (error) {
        console.log(error);
    }
  }
  
  const loadUncomfirmedNotifications = async()=>{
    try {
      const notifications = await notificationService.getUncomfirmedNotifications(user?.id || "");
      console.log("uncomfirmed notifications",notifications);
      if(notifications.ok){
        setNotifications(notifications.data || []);
      }
    } catch (error) {
      console.log("error fetching uncomfirmed notifications",error);
    }
  }

  useEffect(()=>{
    loadUncomfirmedNotifications();
  }, [])

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
                    <Link href="/forPetParent/emergencyVetList" className="text-base">
                      Emergency
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:bg-[#2f6c5f]"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 bg-[#B3D8A8] dark:bg-[#357C72]">
              
              <DropdownMenuItem asChild>
                  <Link href="/profile/myProfile"
                      className="w-full justify-start font-medium">
                      Edit Profile
                  </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                  <Link href="/profile/pets"
                      className="w-full justify-start font-medium">
                      Pets
                  </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                  <Link
                  href="/forPetParent/orderHistory"
                  className="w-full justify-start font-medium"
                >
                  Order History
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <LogoutConfirmDialog>
                  <Button variant="ghost" className="w-full justify-start">
                    Logout
                  </Button>
                </LogoutConfirmDialog>
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:bg-[#2f6c5f]"
              >
                <div className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications.length>0 && <div className="w-1 h-1 rounded full absolute top-0 right-0 bg-red-500"></div>}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#B3D8A8] dark:bg-[#357C72] max-h-[30vh] overflow-y-auto custom-scrollbar">
              {notifications.length>0 && 
              <>
                <div className="min-w-[200px] flex flex-row justify-between gap-3 p-3">
                    <span className="font-semibold text-lg">Confirm All Notification</span>
                  <div>
                    <button className="text-green-500 hover:text-white duration-200 transition-all" onClick={handleConfirmAll} title="Mark all as read">
                      <CircleCheckBig className="w-6 h-6 " />
                    </button>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-gray-500/50"></div>
              </>
              }
              {notifications.map((notification)=>(
                <DropdownMenuItem asChild key={notification.id}>
                  <NotificationCard notification={notification} onAction={loadUncomfirmedNotifications}/>
                </DropdownMenuItem>
              ))}
              {notifications.length === 0 && <div className="p-4 font-semibold text-sm">
                  No New Notifications
              </div>}
            </DropdownMenuContent>
          </DropdownMenu>

          <ToggleTheme />
        </div>
      </div>
    </nav>
  );
}
export default NavbarDesktop;
