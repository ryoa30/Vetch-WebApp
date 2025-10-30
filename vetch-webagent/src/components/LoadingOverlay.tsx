// components/LoadingOverlay.tsx
"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import loadingCat from "@/../public/lottie/Loading Cat.json"; 
import Lottie from "lottie-react";

type Props = {
  show: boolean;
  /** absolute => covers nearest relative parent; fixed => covers entire window */
  absolute?: boolean;
  message?: string;
  lockScroll?: boolean; // prevent body scroll while loading
};

export default function LoadingOverlay({
  show,
  absolute = false,
  message = "Loading...",
  lockScroll = true,
}: Props) {
  useEffect(() => {
    if (!lockScroll) return;
    if (show) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [show, lockScroll]);

  if (!show) return null;

  const position = absolute ? "absolute" : "fixed";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`${position} inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm`}
    >
      <div className="w-[200px] h-[50px] flex items-center gap-3 rounded-xl px-4 py-3">
        {/* <Loader2 className="h-5 w-5 animate-spin text-black dark:text-white" /> */}
        <Lottie animationData={loadingCat} loop={true} />
        {/* <span className="text-sm font-medium text-black dark:text-white">{message}</span> */}
      </div>
    </div>
  );
}
