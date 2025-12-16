// Client-side helper for invoking Midtrans Snap payment popup
// Usage: import { showPaymentSnap } from "@/lib/utils/snapPayment";

import { BookingService } from "../services/BookingService";
import { PaymentService } from "../services/PaymentService";

export type SnapCallbacks = {
  onSuccess?: (result: unknown) => void;
  onPending?: (result: unknown) => void;
  onError?: (error: unknown) => void;
  onClose?: () => void;
};

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        opts?: SnapCallbacks
      ) => void;
    };
  }
}

// const bookingService = new BookingService()
// const paymentService = new PaymentService()

export function showPaymentSnap(token: string, data: {bookingId: string}, callbacks?: SnapCallbacks) {
  if (typeof window === "undefined") return; // SSR guard
  if (!window.snap?.pay) {
    console.warn("Snap is not loaded on window. Ensure the Snap script is included.");
    return;
  }
  window.snap.pay(token, {
    onSuccess: async (result: any) => {
      console.log("Success:", result);
      callbacks?.onSuccess?.(result);
    },
    onPending: async (result: any) => {
      console.log("Pending:", result)
    },
    onError: (error) => console.error("Error:", error),
    onClose: () => console.warn("Buyer closed the popup without finishing the payment"),
  });
}
