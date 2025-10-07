import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { X } from "lucide-react";

interface PetDialogProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: PetFormData) => void;
}

export interface PetFormData {
  name: string;
  species: string;
  otherSpecies: string;
  color: string;
  otherColor: string;
  gender: "male" | "female";
  neutered: boolean;
  weight: number | string; // allow decimal weight, e.g. "1.5"
  dob: string;
}

export function PetDialog({ show, onClose, onSubmit }: PetDialogProps) {
  const [form, setForm] = useState<PetFormData>({
    name: "",
    species: "",
    otherSpecies: "",
    color: "",
    otherColor: "",
    gender: "male",
    neutered: true,
    weight: 0,
    dob: "",
  });

  const handleChange = (field: keyof PetFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-1/2 bg-white text-black rounded-lg shadow-lg [&>button:last-child]:hidden">
      {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <DialogHeader>
          <DialogTitle className="mt-4 text-xl font-semibold text-[#0F5544]">
            Add new pet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Pet Name */}
          <div className="space-y-1">
            <Label className="font-medium">
              Pet's Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Must at least be 3 characters"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* Species */}
          <div className="space-y-1">
            <Label className="font-medium">Pet's Species <span className="text-red-500">*</span></Label>
            <Select
              value={form.species}
              onValueChange={(val) => handleChange("species", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="- Must choose one -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
                <SelectItem value="bird">Bird</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Other Species Input */}
            {form.species === "other" && (
              <div className="mt-2">
                <Input
                  placeholder="Enter species"
                  value={form.otherSpecies}
                  onChange={(e) => handleChange("otherSpecies", e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Color */}
          <div className="space-y-1">
            <Label className="font-medium">Primary Color <span className="text-red-500">*</span></Label>
            <Select
              value={form.color}
              onValueChange={(val) => handleChange("color", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="- Must choose one -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="brown">Brown</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Other Color Input */}
            {form.color === "other" && (
              <div className="mt-2">
                <Input
                  placeholder="Enter species"
                  value={form.otherSpecies}
                  onChange={(e) => handleChange("otherColor", e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <Label className="font-medium">Gender <span className="text-red-500">*</span></Label>
            <div className="flex space-x-3">
              <Button
                type="button"
                className={`rounded-full ${form.gender === "female" ? "bg-[#0F5544] text-white" : "border"}`}
                variant="ghost"
                onClick={() => handleChange("gender", "female")}
              >
                ♀ Female
              </Button>
              <Button
                type="button"
                className={`rounded-full ${form.gender === "male" ? "bg-[#0F5544] text-white" : "border"}`}
                variant="ghost"
                onClick={() => handleChange("gender", "male")}
              >
                ♂ Male
              </Button>
            </div>
          </div>

          {/* Neutered */}
          <div className="space-y-1">
            <Label className="font-medium">Is your pet neutered? <span className="text-red-500">*</span></Label>
            <div className="flex space-x-3">
              <Button
                type="button"
                className={`rounded-full ${form.neutered ? "bg-[#0F5544] text-white" : "border"}`}
                variant="ghost"
                onClick={() => handleChange("neutered", true)}
              >
                Yes
              </Button>
              <Button
                type="button"
                className={`rounded-full ${!form.neutered ? "bg-[#0F5544] text-white" : "border"}`}
                variant="ghost"
                onClick={() => handleChange("neutered", false)}
              >
                No
              </Button>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-1">
            <Label className="font-medium">Pet's Weight <span className="text-red-500">*</span></Label>
            <div className="flex items-center">
              <Input
                type="number"
                placeholder="Weight in KG, must at least be 1 gram"
                value={form.weight}
                onChange={(e) => handleChange("weight", Number(e.target.value))}
              />
              <span className="ml-2 font-medium">KG</span>
            </div>
          </div>

          {/* DOB */}
          <div className="space-y-1">
            <Label className="font-medium">Pet's DOB <span className="text-red-500">*</span></Label>
            <Input
              type="date"
              value={form.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
            />
          </div>
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
      </DialogContent>
    </Dialog>
  );
}
