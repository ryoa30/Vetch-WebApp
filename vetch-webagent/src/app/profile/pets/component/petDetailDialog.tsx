"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditPetDialog, EditPetFormData } from "./editPetDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MedicalRecord {
  date: string;
  issue: string;
  type: string;
}

interface Schedule {
  description: string;
  vet: string;
  interval: string;
}

export interface PetDetailsData {
  name: string;
  gender: "male" | "female";
  species: string;
  neutered: boolean;
  age: string;
  weight: string;
  color: string;
  medicalHistory: MedicalRecord[];
  schedule: Schedule[];
}

interface PetDetailsDialogProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: PetDetailsData) => void;
  onDelete: () => void;
  data: PetDetailsData;
}

export function PetDetailsDialog({ show, onClose, onSave, onDelete, data }: PetDetailsDialogProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleSaveEdit = (edited: EditPetFormData) => {
    onSave({
      ...data,
      name: edited.name,
      color: edited.color,
      neutered: edited.neutered,
      weight: edited.weight,
    });
    setShowEditDialog(false);
  };
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-1/2 bg-white text-black rounded-lg shadow-lg [&>button:last-child]:hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-600 hover:text-black"
        >
          <X size={20} />
        </button>

        <DialogHeader>
          <DialogTitle className="mt-4 text-2xl text-[#0F5544] font-semibold">
            Pet Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Pet Basic Info */}
          <div>
            <p className="text-lg font-medium">
              {data.name} | {data.gender === "female" ? "Female ♀" : "Male ♂"}
            </p>
            <p className="text-sm text-gray-500">Pet name</p>
          </div>

          {/* Species & Neutered */}
          <div>
            <p className="flex items-center text-lg font-medium">
              🐾 {data.species} | {data.neutered ? "Neutered" : "Not Neutered"}
            </p>
            <p className="text-sm text-gray-500">Species | Neuter Status</p>
          </div>

          {/* Age & Weight */}
          <div>
            <p className="text-lg font-medium">
              {data.age} | {data.weight}
            </p>
            <p className="text-sm text-gray-500">Age | Weight</p>
          </div>

          {/* Color */}
          <div>
            <p className="text-lg font-medium">{data.color}</p>
            <p className="text-sm text-gray-500">Primary Color</p>
          </div>

          {/* Divider */}
          <hr className="my-3" />

          {/* Medical History */}
          <div>
            <h3 className="text-lg font-semibold">Medical History</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {data.medicalHistory.map((record, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>• {record.date} — {record.issue}</span>
                  <span className="text-gray-600">{record.type}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-lg font-semibold">Schedule</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {data.schedule.map((s, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>• {s.description}</span>
                  <span className="text-gray-600">
                    Last Vet: {s.vet} | {s.interval}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={() => setShowEditDialog(true)}
            className="rounded-full px-8 py-2 border border-black bg-white text-black hover:bg-gray-100"
          >
            Edit Details
          </Button>
        </div>
        <EditPetDialog
        show={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onDelete={onDelete}
        onSave={handleSaveEdit}
        initialData={{
          name: data.name,
          color: data.color,
          neutered: data.neutered,
          weight: data.weight,
        }}
      />
      </DialogContent>
    </Dialog>
  );
}
