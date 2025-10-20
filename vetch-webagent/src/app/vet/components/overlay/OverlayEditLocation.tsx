"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function OverlayEditLocation() {
  return (
    <Dialog>
      {/* Tombol pemicu modal */}
      <DialogTrigger asChild>
        <Button className="h-[42px] bg-gray-200 text-black hover:bg-gray-300">
          Edit Location
        </Button>
      </DialogTrigger>

      {/* Konten modal */}
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-teal-700 font-bold">
            Edit Location
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="grid gap-4 py-2">
          <div className="grid gap-1">
            <label htmlFor="address" className="text-sm font-medium">
              Address<span className="text-red-500">*</span>
            </label>
            <Input
              id="address"
              placeholder="Eg. Jl. ABC Blok C No. 12, Kelurahan XYZ, Kecamatan PQR"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="addressNotes" className="text-sm font-medium">
              Address Notes (Apt, suite, etc)
            </label>
            <Input
              id="addressNotes"
              placeholder="Eg. White Building, Room Number 12, etc"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="city" className="text-sm font-medium">
              City<span className="text-red-500">*</span>
            </label>
            <Input id="city" placeholder="City" />
          </div>

          <div className="grid gap-1">
            <label htmlFor="province" className="text-sm font-medium">
              Province or Region<span className="text-red-500">*</span>
            </label>
            <Input id="province" placeholder="Province or Region" />
          </div>

          <div className="grid gap-1">
            <label htmlFor="postalCode" className="text-sm font-medium">
              Postal Code<span className="text-red-500">*</span>
            </label>
            <Input id="postalCode" placeholder="Postal Code" />
          </div>
        </div>

        <DialogFooter>
          <Button className="bg-teal-700 text-white hover:bg-teal-800">
            Edit Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
