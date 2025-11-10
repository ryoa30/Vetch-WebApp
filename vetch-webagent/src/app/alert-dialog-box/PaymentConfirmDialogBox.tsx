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

export function PaymentDialog({
  children,
  handleConfirmBooking
}: {
  children: React.ReactNode;
  handleConfirmBooking: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            {/* Icon kiri */}
            <AlertCircle className="h-10 w-10 text-black mt-1 dark:text-white" />
            <div>
              <AlertDialogTitle className="text-lg font-semibold">
                Are you sure the details are correct?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You’ll now continue to payment
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-end gap-3">
          {/* Yes button */}
          <AlertDialogAction 
              className="px-6 py-2 rounded-md border !text-black hover:!text-white dark:hover:!text-black hover:bg-black dark:hover:bg-gray-400 border-black dark:border-white "
          onClick={handleConfirmBooking}>
              Yes
          </AlertDialogAction>

          {/* No button */}
          <AlertDialogCancel 
          className="px-6 py-2 rounded-md !bg-red-500 text-white hover:!bg-red-600"
          >
            No
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PaymentDialog;
