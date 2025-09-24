"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

export function LogoutConfirmDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include", cache: "no-store" });
    } catch {
      // ignore network error, still redirect
    } finally {
      // Hard redirect ensures state is reset
      window.location.href = "/login";
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="p-2">{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-10 w-10 text-black mt-1 dark:text-white" />
            <div>
              <AlertDialogTitle className="text-xl">Do you want to log out?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be logged out
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleLogout} className="px-4 py-2 rounded-md border border-black bg-white !text-black hover:bg-transparent">
            Yes
          </AlertDialogAction>
          <AlertDialogCancel className="bg-red-500 text-white hover:bg-red-600">
            No
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LogoutConfirmDialog;
