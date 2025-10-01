"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";

interface EditPetDialogProps {
  show: boolean;
  onClose: () => void;
  onDelete: () => void;
  onSave: (data: EditPetFormData) => void;
  initialData: EditPetFormData;
}

export interface EditPetFormData {
  name: string;
  color: string;
  neutered: boolean;
  weight: string;
}

export function EditPetDialog({
  show,
  onClose,
  onDelete,
  onSave,
  initialData,
}: EditPetDialogProps) {
  const [form, setForm] = useState<EditPetFormData>(initialData);

  const handleChange = (key: keyof EditPetFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-xl">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-green-900">
            Edit Pet Details
          </DialogTitle>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Pet Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pet’s Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <select
              value={form.color}
              onChange={(e) => handleChange("color", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="Black">Black</option>
              <option value="Brown">Brown</option>
              <option value="White">White</option>
              <option value="Gray">Gray</option>
            </select>
          </div>

          {/* Neutered Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Is your pet neutered?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleChange("neutered", true)}
                className={`px-4 py-2 rounded-lg border ${
                  form.neutered
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleChange("neutered", false)}
                className={`px-4 py-2 rounded-lg border ${
                  !form.neutered
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pet’s Weight
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={form.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              />
              <span className="text-gray-700 font-semibold">KG</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onDelete}
            className="px-6 py-2 border border-black text-black rounded-full font-semibold hover:bg-gray-100"
          >
            Delete Pet
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
