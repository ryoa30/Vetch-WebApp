"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Bell, CircleCheckBig, Menu, User, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToggleTheme from "@/components/ToggleTheme";
import { useSession } from "@/contexts/SessionContext";
import LogoutConfirmDialog from "@/app/alert-dialog-box/LogoutConfirmDialogBox";
import { NotificationService } from "@/lib/services/NotificationService";
import NotificationCard from "./components/notificationCard";

export function NavbarMobile() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useSession();
  const pathname = usePathname();
  const notificationService = useMemo(() => new NotificationService(), []);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const handleConfirmAll = async()=>{
    try {
        const res = await notificationService.confirmAllNotifications(user?.id || "");
        console.log(res);
        if(res.ok){
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
    if(isAuthenticated && user?.id){
      loadUncomfirmedNotifications();
    }
    setOpen(false);
    // Re-run when route changes so navbar effects can refresh on navigation
  }, [isAuthenticated, user?.id, pathname])

  return (
    <nav className="flex md:hidden w-full bg-[#3D8D7A] dark:bg-[#1F2D2A] text-white shadow-sm relative">
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

        <div className="flex items-center gap-3">
          {/* Right Section */}
          {isAuthenticated ? (
            <>
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
                <DropdownMenuContent align="end" className="bg-[#B3D8A8] dark:bg-[#357C72]">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile/myProfile"
                      className="w-full justify-start font-medium"
                    >
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile/pets"
                      className="w-full justify-start font-medium"
                    >
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
                <DropdownMenuContent align="end" className="bg-[#B3D8A8] dark:bg-[#357C72] max-h-[30vh] max-w-[90vw] overflow-y-auto custom-scrollbar">
                  {notifications.length>0 && 
                  <>
                    <div className="flex flex-row justify-between gap-3 p-3">
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
            </>
          ) : (
            <Link href="/login">
              <Button className="bg-white text-[#3D8D7A] font-semibold hover:bg-gray-100">
                Login
              </Button>
            </Link>
          )}

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
      {/* {open && ( */}
        <div className={`absolute ${open?"h-[200px]":"h-0"} top-16 left-0 w-full overflow-y-hidden bg-[#B3D8A8] dark:bg-[#1F2D2A] shadow-md z-50 text-[#2f2f2f] dark:text-white transition-all duration-300`}>
          <div className="flex flex-col gap-3 p-4">
            <span className="font-semibold">For Pet Parents</span>
            <Link href="/forPetParent/consultationVetList" className="hover:underline pl-3 ">
              Consultation
            </Link>
            <Link href="/forPetParent/emergencyVetList" className="hover:underline pl-3">
              Emergency
            </Link>
            {!isAuthenticated && (
              <Link href="/register/vet/account" className="hover:underline">
                Become a Vet
              </Link>
            )}
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
            <Link href="/about" className="hover:underline">
              About Us
            </Link>
          </div>
        </div>
      {/* )} */}
    </nav>
  );
}
