import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionContext";
import { VetValidator } from "@/lib/validators/VetValidator";
import { VetService } from "@/lib/services/VetService";

interface IErrors {
  sipNumber?: string;
  certificate?: string;
}

export function ReuploadCertificate({
  vetId,
  show,
  onAction,
  onClose,
}: {
  vetId: string;
  show: boolean;
  onAction: (input?: any) => void;
  onClose: (input?: any) => void;
}) {
  const { user } = useSession();
  const [sipNumber, setSipNumber] = useState("");
  const [certificate, setCertificate] = useState<File | null>(null);
  const [errors, setErrors] = useState<IErrors>({});

  const vetValidator = new VetValidator();
  const vetService = new VetService();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      // Check MIME type
      if (!selected.type.startsWith("image/")) {
        setErrors({
          ...errors,
          certificate: "Only image files are allowed (jpg, png, etc.)",
        });
        setCertificate(null);
      } else {
        setErrors({ ...errors, certificate: "" });
        setCertificate(selected);
      }
    }
  };

  const handleFinish = async () => {
    try {
        const validate = vetValidator.validateCertificateInfo({sipNumber, certificate});
        if(validate.ok) {
            const res = await vetService.updateVetCertificate(
                vetId,
                sipNumber,
                certificate
            );
            console.log(res);
            onAction();
        }else{
            setErrors(validate.errors);
            return;
        }
    } catch (error) {
        console.log(error);
    }
  };

  useEffect(() => {
    if (!show) return;
    const { style } = document.body;
    const prev = { overflow: style.overflow };
    style.overflow = "hidden";
    return () => {
      style.overflow = prev.overflow;
    };
  }, [show]);

  return (
    <>
      <div
        className={`${show ? "" : "hidden"} fixed inset-0 bg-black/50 z-50`}
      ></div>

      <Dialog
        open={show}
        onOpenChange={(open) => !open && onClose()}
        modal={false}
      >
        <DialogContent
          onInteractOutside={(e) => {
            const t = e.target as HTMLElement | null;
            if (t && t.closest(".pac-container")) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            const t = e.target as HTMLElement | null;
            if (t && t.closest(".pac-container")) e.preventDefault();
          }}
          className="sm:max-w-lg lg:max-w-2xl bg-white overflow-y-auto dark:bg-[#1F2D2A] text-black rounded-xl shadow-lg"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0F5544] font-semibold dark:text-white">
              Reupload Certificate
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full space-y-4 dark:text-white">
            <div className="space-y-2">
              <Label htmlFor="city">
                Certificate<span className="text-red-500">*</span>
              </Label>
              <Input id="certificate" type="file" className="bg-transparent border-2" accept="image/*" onChange={handleChange}/>
              {errors.certificate && (
                <span className="text-red-500 text-xs">{errors.certificate}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">
                SIP Number<span className="text-red-500">*</span>
              </Label>
              <Input
                value={sipNumber}
                onChange={(e) => setSipNumber(e.target.value)}
                id="sip_number"
                placeholder="SIP Number"
                required
                className="bg-transparent border-2"
              />
              {errors.sipNumber && (
                <span className="text-red-500 text-xs">{errors.sipNumber}</span>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                className="w-fit px-2 bg-white text-black hover:bg-gray-100 border-2"
                onClick={handleFinish}
              >
                Reupload Certificate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
