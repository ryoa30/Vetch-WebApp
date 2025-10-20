"use client";

import { Upload } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddSpeciesModal() {
  return (
    // Komponen ini membungkus pemicu (tombol +) dan konten modal
    <Dialog>
      {/* Pemicu yang akan membuka modal */}
      <DialogTrigger asChild>
        <Button className="bg-gray-200 text-black hover:bg-gray-300">+</Button>
      </DialogTrigger>

      {/* Konten yang akan ditampilkan di dalam overlay */}
      <DialogContent className="sm:max-w-[480px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-teal-700 font-bold">
            Add Species
          </DialogTitle>
        </DialogHeader>

        {/* Form di dalam Dialog */}
        <div className="grid gap-6 py-4">
          {/* Dropdown untuk memilih spesies */}
          <div className="grid gap-2">
            <label htmlFor="species" className="text-sm font-medium">
              Pet's Species
            </label>
            <Select>
              <SelectTrigger id="species">
                <SelectValue placeholder="- Choose -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bird">Bird</SelectItem>
                <SelectItem value="fish">Fish</SelectItem>
                <SelectItem value="rabbit">Rabbit</SelectItem>
                <SelectItem value="hamster">Hamster</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Input untuk upload file */}
          <div className="grid gap-2">
            <label htmlFor="proof" className="text-sm font-medium">
              Add Proof/Certificate
            </label>
            <label htmlFor="proof-upload" className="flex items-center justify-between w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground cursor-pointer hover:bg-gray-50">
              Upload Certificate or Proof of Competency
              <Upload className="h-4 w-4 text-gray-500" />
            </label>
            <Input id="proof-upload" type="file" className="hidden" />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" className="font-semibold">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}