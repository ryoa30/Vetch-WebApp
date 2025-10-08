"use client";

import ConfirmationDialogBox from "@/app/alert-dialog-box/ConfirmationDialogBox";
import ErrorDialog from "@/app/alert-dialog-box/ErrorDialogBox";
import SuccessDialog from "@/app/alert-dialog-box/SuccessDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PetService } from "@/lib/services/PetService";
import { PetValidator } from "@/lib/validators/PetValidator";
import { X } from "lucide-react";
import { useState } from "react";

interface EditPetDialogProps {
  show: boolean;
  onClose: () => void;
  initialData: EditPetFormData;
}

export interface EditPetFormData {
  id: string;
  petName: string;
  primaryColor: string;
  neuterStatus: boolean;
  weight: string;
}

interface IErrors {
  petName?: string;
  primaryColor?: string;
  weight?: string;
}

export function EditPetDialog({
  show,
  onClose,
  initialData,
}: EditPetDialogProps) {
  const [form, setForm] = useState<EditPetFormData>(initialData);

  const petValidator = new PetValidator();
  const petService = new PetService();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const [errors, setErrors] = useState<IErrors>({
    petName: '',
    primaryColor: '',
    weight: '',
  });

  const handleChange = (key: keyof EditPetFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const validate = petValidator.validatePetEditInfo({
      petName: form.petName,
      petColor: form.primaryColor,
      petWeight: parseFloat(form.weight),
    });
    if (!validate.ok) {
      setErrors(validate.errors);
      return;
    }else{
      setErrors({});
      const result = await petService.updatePet(form);
      console.log(result);
      if(!result.ok){
        setShowFailure(true);
      }else{
        setShowSuccess(true);
      }
    }
  };

  const handleDeletion = async () => {
    const result = await petService.deletePet(form.id);
      console.log(result);
      if(!result.ok){
        setShowFailure(true);
      }else{
        setShowSuccess(true);
      }
  }

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-1/2 bg-white dark:bg-[#1F2D2A] text-black rounded-lg shadow-lg [&>button:last-child]:hidden">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-600 dark:text-white hover:text-black"
        >
          <X size={20} />
        </button>

        <DialogHeader>
          <DialogTitle className="mt-4 text-2xl text-[#0F5544] dark:text-white font-semibold">
            Edit Pet Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Pet Name */}
          <div className="space-y-2">
              <Label htmlFor="petName" className="dark:text-white">Pet&apos;s Name</Label>
              <Input
                id="petName"
                placeholder="Must at least be 3 characters"
                className="mb-0 dark:text-white"
                value={form.petName}
                onChange={(e) => handleChange("petName", e.target.value)}
              />
              {errors.petName && <span className="text-red-500 text-xs">{errors.petName}</span>}

            </div>

          {/* Primary Color */}
          <div className="space-y-2 dark:text-white">
            <Label className="dark:text-white">
                Primary Color<span className="text-red-500">*</span>
              </Label>
              <Select
              value={form.primaryColor}
              onValueChange={(e) => handleChange("primaryColor", e)}>
                <SelectTrigger className="w-full mb-0">
                  <SelectValue placeholder="- Must choose one -" className="dark:text-white"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="brown">Brown</SelectItem>
                  <SelectItem value="gray">Gray</SelectItem>
                  <SelectItem value="golden">Golden</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
              {errors.primaryColor && <span className="text-red-500 text-xs">{errors.primaryColor}</span>}
          </div>

          {/* Neutered Toggle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Is your pet neutered?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleChange("neuterStatus", true)}
                className={`px-4 py-2 dark:text-white rounded-lg border ${
                  form.neuterStatus
                    ? "bg-[#3D8D7A] text-white border-[#3D8D7A]"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleChange("neuterStatus", false)}
                className={`px-4 py-2 dark:text-white rounded-lg border ${
                  !form.neuterStatus
                    ? "bg-[#3D8D7A] text-white border-[#3D8D7A]"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black mb-1 dark:text-white">
              Pet&apos;s Weight
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={form.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="flex-1 dark:text-white border border-gray-300 rounded-lg px-3 py-2"
              />
              <span className="text-black dark:text-white font-semibold">KG</span>
            </div>
            {errors.weight && <span className="text-red-500 text-xs">{errors.weight}</span>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 gap-3">
          <ConfirmationDialogBox message="Are you sure want to delete this pet?" subMessage="This action cannot be undone." onConfirm={handleDeletion}  >
            <button
              className="px-6 py-2 border dark:border-white border-black text-black dark:text-white rounded-full font-semibold dark:hover:bg-gray-500 hover:bg-gray-100"
            >
              Delete Pet
            </button>
          </ConfirmationDialogBox>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 border dark:border-white border-black text-black dark:text-white rounded-full font-semibold dark:hover:bg-gray-500 hover:bg-gray-100"
          >
            Save
          </button>
        </div>
      </DialogContent>
      <SuccessDialog onOpenChange={()=>{setShowSuccess(false); window.location.reload();}} open={showSuccess} message="Successfully modified Pet"/>
      <ErrorDialog onOpenChange={()=>setShowFailure(false)} open={showFailure} errors={["Failed to modify Pet"]} />
    </Dialog>
  );
}
