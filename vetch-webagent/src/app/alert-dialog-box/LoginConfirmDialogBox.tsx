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

export function LoginConfirmDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-10 w-10 text-black mt-1 dark:text-white" />
            <div>
              <AlertDialogTitle className="text-xl">Do you want to log in?</AlertDialogTitle>
              <AlertDialogDescription>
                You have to login to use this service.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Link
              href="/login"
              className="px-4 py-2 rounded-md border border-black bg-white !text-black hover:bg-transparent"
            >
              Yes
            </Link>
          </AlertDialogAction>
          <AlertDialogCancel className="bg-red-500 text-white hover:bg-red-600">
            No
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LoginConfirmDialog;
