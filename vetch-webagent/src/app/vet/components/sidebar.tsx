"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  History,
  User,
  Menu,
  X,
  Contact,
  LogOutIcon,
  Bell,
  CircleCheckBig,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ToggleTheme from "@/components/ToggleTheme";
import LogoutConfirmDialog from "@/app/alert-dialog-box/LogoutConfirmDialogBox";
import DraggableSnapFab from "@/components/DraggableFAB";
import { useSession } from "@/contexts/SessionContext";
import { NotificationService } from "@/lib/services/NotificationService";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import NotificationCard from "@/app/layout-component/navbar/components/notificationCard";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const notificationService = new NotificationService();
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useSession();

  const handleConfirmAll = async () => {
    try {
      const res = await notificationService.confirmAllNotifications(
        user?.id || ""
      );
      console.log(res);
      if (res.ok) {
        // remove notification from list
        loadUncomfirmedNotifications();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadUncomfirmedNotifications = async () => {
    try {
      const notifications =
        await notificationService.getUncomfirmedNotifications(user?.id || "");
      console.log("uncomfirmed notifications", notifications);
      if (notifications.ok) {
        setNotifications(notifications.data || []);
      }
    } catch (error) {
      console.log("error fetching uncomfirmed notifications", error);
    }
  };

  useEffect(() => {
    loadUncomfirmedNotifications();
  }, []);

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
      <div
        className={`bg-black/50 backdrop-blur-sm w-full min-h-screen fixed z-[20] ${
          isOpen ? "md:hidden" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <aside
        className={cn(
          "bg-[#3D8D7A] dark:bg-[#1F2D2A] text-white flex flex-col justify-between min-h-screen transition-all duration-300 fixed md:relative z-20",
          isOpen ? "w-64" : "w-0 md:w-16"
        )}
      >
        {/* Header */}
        <DraggableSnapFab
          className={`bg-gray-500/50 hover:bg-gray-500/70 ${
            isOpen ? "hidden" : "md:hidden"
          }`}
          size={40}
          onClick={() => setIsOpen(true)}
        >
          <Menu />
        </DraggableSnapFab>
        <div
          className={`${
            isOpen ? "w-64" : "md:fixed md:w-16 max-[768px]:hidden"
          } flex flex-col h-full transition-all duration-300`}
        >
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
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-full py-2 px-3 justify-start gap-2 text-white dark:hover:bg-white dark:hover:text-black hover:bg-white/20",
                      ""
                    )}
                  >
                    <div className="relative">
                      <Bell className="h-5 w-5" />
                      {notifications.length > 0 && (
                        <div className="w-1 h-1 rounded full absolute top-0 right-0 bg-red-500"></div>
                      )}
                    </div>
                    {isOpen && "Notifications"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[#B3D8A8] dark:bg-[#357C72] max-h-[30vh] overflow-y-auto custom-scrollbar"
                >
                  {notifications.length > 0 && (
                    <>
                      <div className="min-w-[200px] flex flex-row justify-between gap-3 p-3">
                        <span className="font-semibold text-lg">
                          Confirm All Notification
                        </span>
                        <div>
                          <button
                            className="text-green-500 hover:text-white duration-200 transition-all"
                            onClick={handleConfirmAll}
                            title="Mark all as read"
                          >
                            <CircleCheckBig className="w-6 h-6 " />
                          </button>
                        </div>
                      </div>
                      <div className="w-full h-[1px] bg-gray-500/50"></div>
                    </>
                  )}
                  {notifications.map((notification) => (
                    <DropdownMenuItem asChild key={notification.id}>
                      <NotificationCard
                        notification={notification}
                        onAction={loadUncomfirmedNotifications}
                      />
                    </DropdownMenuItem>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-4 font-semibold text-sm">
                      No New Notifications
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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
