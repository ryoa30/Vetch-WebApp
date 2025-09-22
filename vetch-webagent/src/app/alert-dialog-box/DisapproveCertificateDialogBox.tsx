import Link from "next/link";
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

interface IProps {
  open: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function DisapproveCertificateDialogBox({ open, onConfirm, onCancel }: IProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            {/* Icon kiri */}
            <AlertCircle className="h-10 w-10 text-black mt-1 dark:text-white" />
            <div>
              <AlertDialogTitle className="text-lg font-semibold">
                Are you sure you want to disapprove the certificate?
              </AlertDialogTitle>
              <AlertDialogDescription>
                The certificate will be disapproved
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-end gap-3">
          {/* Yes button */}
          <AlertDialogAction onClick={onConfirm} className="cursor-pointer px-6 py-2 rounded-md border border-black bg-white !text-black hover:bg-gray-100">
              Yes
          </AlertDialogAction>

          {/* No button */}
          <AlertDialogCancel onClick={onCancel} className="cursor-pointer px-6 py-2 rounded-md bg-red-500 text-white hover:bg-red-600">
            No
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DisapproveCertificateDialogBox;
