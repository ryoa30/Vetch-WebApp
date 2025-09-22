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
import errorAnimation from "@/../public/lottie/red cross.json"; 

interface errorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errors: string[];
}

export default function ErrorDialog({ open, onOpenChange, errors }: errorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="flex flex-col items-center text-center">
        {/* Animasi Lottie */}
        <div className="w-32 h-32">
          <Lottie animationData={errorAnimation} loop={false} />
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-red-600">
            Validation Error
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            {errors.map((error, index) => {
                if(index === errors.length - 1){
                    return error;
                }
                return error + ", ";
            })}
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
