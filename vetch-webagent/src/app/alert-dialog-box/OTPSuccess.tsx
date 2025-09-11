"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Lottie from "lottie-react";
import successAnimation from "@/../public/lottie/Success.json"; 

interface SuccessLoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OTPSuccess({ open, onOpenChange }: SuccessLoginProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="flex flex-col items-center text-center">
        {/* Animasi Lottie */}
        <div className="w-32 h-32">
          <Lottie animationData={successAnimation} loop={false} />
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-green-600">
            OTP Successfully Verified
          </AlertDialogTitle>
          <AlertDialogDescription>
            You’ll now continue to Login
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction className="bg-green-600 text-white hover:bg-green-700">
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


