import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { Checkbox } from "@/components/ui/checkbox"; // if using shadcn/ui checkbox
import { BookingService } from "@/lib/services/BookingService";
import {snakeCase} from "lodash"
import Image from "next/image";

// const concerns = [
//   { label: "Flea and Tick", icon: "🪲" },
//   { label: "Skin or Ear Infection", icon: "🦠" },
//   { label: "Diarrhea or Vomiting", icon: "🤢" },
//   { label: "Eye Issues", icon: "👁️" },
//   { label: "Urinary Problems", icon: "💧" },
//   { label: "Trauma / Injury", icon: "💥" },
//   { label: "Toxin Ingestion", icon: "☣️" },
//   { label: "Other", icon: "➕" },
// ];

interface IConcernType {
    id: number;
    label: string;
    icon: string;
}

export function ConcernDialog({ show, onClose, selected, setSelected }: { show: boolean; onClose: () => void, selected: any[], setSelected: Dispatch<SetStateAction<any[]>> }) {
//   const [selected, setSelected] = useState<string[]>([]);

  const [concerns, setConcerns ] = useState<IConcernType[]>([]);

  const bookingService = new BookingService();

  const loadConcerns = async () =>{

    console.log("load concerns");

    try {
        const results = await bookingService.getConcernTypes();
        console.log(results);
        setConcerns(results.data.map((item: any) => ({
            id: item.id,
            label: item.concernName,
            icon: snakeCase(item.concernName)

        })))
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    loadConcerns();
  },[])

  const toggleConcern = (label: IConcernType) => {
    console.log(label, selected);
    setSelected((prev: any[]) =>
      prev.find((item: any) => item.label === label.label) ? prev.filter(item => item.label !== label.label) : [...prev, label]
    );
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg lg:max-w-2xl bg-white text-black rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#0F5544] font-semibold">Concerns</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {concerns.map(c => (
            <label
              key={c.label}
              className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                selected.includes(c.label) ? "border-green-600 bg-green-50" : "border-gray-300"
              }`}
            >
              <span className="flex items-center space-x-2">
                <Image src={`/img/concern-logos/${c.icon}.png`} alt="icon" width={50} height={50}/>
                <span>{c.label}</span>
              </span>
              <Checkbox
                checked={selected.find((item: any) => item.label === c.label) !== undefined}
                onCheckedChange={() => toggleConcern(c)}
              />
            </label>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
