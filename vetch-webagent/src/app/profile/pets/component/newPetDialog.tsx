import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { X } from "lucide-react";
import DatePicker from "@/components/DatePicker";
import { PetValidator } from "@/lib/validators/PetValidator";
import { PetService } from "@/lib/services/PetService";
import SuccessDialog from "@/app/alert-dialog-box/SuccessDialog";
import ErrorDialog from "@/app/alert-dialog-box/ErrorDialogBox";
import { formatLocalDate } from "@/lib/utils/formatDate";
import { useSession } from "@/contexts/SessionContext";

interface PetDialogProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: PetFormData) => void;
}

export interface PetFormData {
  petName: string;
  speciesName: string;
  primaryColor: string;
  gender: "male" | "female";
  neuterStatus: boolean;
  weight: number | string; // allow decimal weight, e.g. "1.5"
  dob: Date | undefined;
}

interface IErrors {
  petName?: string;
  species?: string;
  primaryColor?: string;
  gender?: string;
  neuterStatus?: string;
  weight?: string;
  dob?: string;
}

const speciesList = [
  "Cat",
  "Dog",
  "Bird",
  "Rabbit",
  "Hamster",
  "Fish",
  "Reptile",
  "Farm Animal",
  "Exotic Pet",
  "Other",
];

export function PetDialog({ show, onClose, onSubmit }: PetDialogProps) {
  const [form, setForm] = useState<PetFormData>({
    petName: "",
    speciesName: "",
    primaryColor: "",
    gender: "male",
    neuterStatus: true,
    weight: 0,
    dob: undefined,
  });

  const [errors, setErrors] = useState<IErrors>({
    petName: "",
    species: "",
    primaryColor: "",
    gender: "",
    neuterStatus: "",
    weight: "",
    dob: "",
  });
  const {user} = useSession();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const petValidator = new PetValidator();

  const petService = new PetService();

  const handleChange = (field: keyof PetFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const validate = petValidator.validatePetInfo({
      petName: form.petName,
      petSpecies: form.speciesName,
      petColor: form.primaryColor,
      petGender: form.gender,
      petWeight:
        typeof form.weight === "string" ? parseFloat(form.weight) : form.weight,
      petDob: form.dob,
    });

    if (!validate.ok) {
      setErrors(validate.errors);
      return;
    } else {
      setErrors({});
      const result = await petService.createPet({
        ...form,
        dob:undefined,
        petDob:
          form.dob instanceof Date
            ? formatLocalDate(form.dob)
            : undefined,
        userId: user?.id
      });
      console.log(result);
      if (!result.ok) {
        setShowFailure(true);
        return;
      } else {
        setShowSuccess(true);
      }
    }
    // onClose();
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-1/2 bg-white dark:bg-[#1F2D2A] text-black rounded-lg shadow-lg [&>button:last-child]:hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>

        <DialogHeader>
          <DialogTitle className="mt-4 text-xl font-semibold text-[#0F5544] dark:text-white">
            Add new pet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Pet Name */}
          <div className="space-y-1">
            <Label className="font-medium dark:text-white">
              Pet&apos;s Name <span className="text-red-500">*</span>
            </Label>
            <Input
              className="mb-0 dark:text-white"
              placeholder="Must at least be 3 characters"
              value={form.petName}
              onChange={(e) => handleChange("petName", e.target.value)}
            />
            {errors.petName && (
              <span className="text-red-500 text-xs">{errors.petName}</span>
            )}
          </div>

          {/* Species */}
          <div className="space-y-1 dark:text-white">
            <Label className="font-medium">
              Pet&apos;s Species <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.speciesName}
              onValueChange={(val) => handleChange("speciesName", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="- Must choose one -" />
              </SelectTrigger>
              <SelectContent>
                {speciesList.map((species) => {
                  return (
                    <SelectItem key={species} value={species}>
                      {species}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.species && (
              <span className="text-red-500 text-xs">{errors.species}</span>
            )}
          </div>

          {/* Color */}
          <div className="space-y-1 dark:text-white">
            <Label className="font-medium">
              Primary Color <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.primaryColor}
              onValueChange={(val) => handleChange("primaryColor", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="- Must choose one -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="brown">Brown</SelectItem>
                <SelectItem value="gray">Gray</SelectItem>
                <SelectItem value="golden">Golden</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
            {errors.primaryColor && (
              <span className="text-red-500 text-xs">
                {errors.primaryColor}
              </span>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-1 dark:text-white">
            <Label className="font-medium">
              Gender <span className="text-red-500">*</span>
            </Label>
            <div className="flex space-x-3">
              <Button
                type="button"
                className={`rounded-full ${
                  form.gender === "female"
                    ? "bg-[#0F5544] text-white"
                    : "border"
                }`}
                variant="ghost"
                onClick={() => handleChange("gender", "female")}
              >
                ♀ Female
              </Button>
              <Button
                type="button"
                className={`rounded-full ${
                  form.gender === "male" ? "bg-[#0F5544] text-white" : "border"
                }`}
                variant="ghost"
                onClick={() => handleChange("gender", "male")}
              >
                ♂ Male
              </Button>
            </div>
            {errors.gender && (
              <span className="text-red-500 text-xs">{errors.gender}</span>
            )}
          </div>

          {/* Neutered */}
          <div className="space-y-1 dark:text-white">
            <Label className="font-medium">
              Is your pet neutered? <span className="text-red-500">*</span>
            </Label>
            <div className="flex space-x-3">
              <Button
                type="button"
                className={`rounded-full ${
                  form.neuterStatus ? "bg-[#0F5544] text-white" : "border"
                }`}
                variant="ghost"
                onClick={() => handleChange("neuterStatus", true)}
              >
                Yes
              </Button>
              <Button
                type="button"
                className={`rounded-full ${
                  !form.neuterStatus ? "bg-[#0F5544] text-white" : "border"
                }`}
                variant="ghost"
                onClick={() => handleChange("neuterStatus", false)}
              >
                No
              </Button>
            </div>
            {errors.neuterStatus && (
              <span className="text-red-500 text-xs">
                {errors.neuterStatus}
              </span>
            )}
          </div>

          {/* Weight */}
          <div className="space-y-1 dark:text-white">
            <Label className="font-medium">
              Pet&apos;s Weight <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center">
              <Input
                type="number"
                placeholder="Weight in KG, must at least be 1 gram"
                value={form.weight}
                onChange={(e) => handleChange("weight", Number(e.target.value))}
              />
              <span className="ml-2 font-medium">KG</span>
            </div>
            {errors.weight && (
              <span className="text-red-500 text-xs">{errors.weight}</span>
            )}
          </div>

          {/* DOB */}
          <div className="space-y-1 dark:text-white">
            <Label className="font-medium">
              Pet&apos;s DOB <span className="text-red-500">*</span>
            </Label>
            {/* <Input
              type="date"
              value={form.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
            /> */}
            <DatePicker
              className="h-fit w-full bg-transparent text-black dark:text-white cursor-pointer mb-0"
              date={form.dob}
              setDate={(d) => handleChange("dob", d ?? form.dob)}
            />
          </div>
          {errors.dob && (
            <span className="text-red-500 text-xs">{errors.dob}</span>
          )}
        </div>

        {/* Add Pet Button */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSubmit}
            className="rounded-full px-8 py-2 border border-black bg-white text-black hover:bg-gray-100"
          >
            Add Pet
          </Button>
        </div>
        <SuccessDialog
          onOpenChange={() => {
            setShowSuccess(false);
            onSubmit(form);
            onClose();
          }}
          open={showSuccess}
          message="Successfully added Pet"
        />
        <ErrorDialog
          onOpenChange={() => setShowFailure(false)}
          open={showFailure}
          errors={["Failed to add Pet"]}
        />
      </DialogContent>
    </Dialog>
  );
}
