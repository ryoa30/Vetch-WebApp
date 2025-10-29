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
import { useEffect, useState } from "react";
import { SpeciesTypeData } from "@/app/types";
import { VetService } from "@/lib/services/VetService";

export default function AddSpeciesModal({vetId, onAction, speciesHandled = []}: {vetId: string, onAction: (data?: any) => void, speciesHandled?: any[]}) {
  const [speciesTypes, setSpeciesTypes] = useState<SpeciesTypeData[]>([]);
  const [speciesTypeId, setSpeciesTypeId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const vetService = new VetService();

  useEffect(() => {
    const loadSpeciesTypes = async () => {
      try {
        const result = await vetService.fetchSpeciesTypes();
        console.log(result);
        if (result.ok) {
          setSpeciesTypes(result.data.filter((st:SpeciesTypeData) => !speciesHandled.some(sh => sh.speciesType.id === st.id)));
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadSpeciesTypes();
  }, [])
  
  const handleConfirm = async () =>{
    try {
      const response = await vetService.postVetSpecies(vetId, speciesTypeId);
      if(response.ok){
        onAction({...response.data, speciesType: {id: speciesTypeId, speciesName: speciesTypes.find(st => st.id === speciesTypeId)?.speciesName || ""}});
        console.log(response);
        // close dialog after successful action
        setOpen(false);
        // optional: reset selection
        setSpeciesTypeId("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    // Komponen ini membungkus pemicu (tombol +) dan konten modal
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Pemicu yang akan membuka modal */}
      <DialogTrigger asChild>
        <Button className="bg-gray-200 text-black hover:bg-gray-300">+</Button>
      </DialogTrigger>

      {/* Konten yang akan ditampilkan di dalam overlay */}
      <DialogContent className="sm:max-w-[480px] bg-white dark:bg-[#1F2D2A]">
        <DialogHeader>
          <DialogTitle className="text-xl text-teal-700 dark:text-white font-bold">
            Add Species
          </DialogTitle>
        </DialogHeader>

        {/* Form di dalam Dialog */}
        <div className="grid gap-6 py-4">
          {/* Dropdown untuk memilih spesies */}
          <div className="grid gap-2">
            <label htmlFor="species" className="text-sm font-medium">
              Pet&apos;s Species
            </label>
            <Select value={speciesTypeId} onValueChange={setSpeciesTypeId}>
              <SelectTrigger id="species" className="w-full">
                <SelectValue placeholder="- Choose -" className="w-full"/>
              </SelectTrigger>
              <SelectContent>
                {speciesTypes.map((species) => (
                  <SelectItem key={species.id} value={species.id}>
                    {species.speciesName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Input untuk upload file */}
          {/* <div className="grid gap-2">
            <label htmlFor="proof" className="text-sm font-medium">
              Add Proof/Certificate
            </label>
            <label htmlFor="proof-upload" className="flex items-center justify-between w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground cursor-pointer hover:bg-gray-50">
              Upload Certificate or Proof of Competency
              <Upload className="h-4 w-4 text-gray-500" />
            </label>
            <Input id="proof-upload" type="file" className="hidden" />
          </div> */}
        </div>
        
        <DialogFooter>
          <Button variant="outline" className="font-semibold" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}