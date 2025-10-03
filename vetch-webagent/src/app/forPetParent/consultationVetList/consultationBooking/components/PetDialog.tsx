import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { PetService } from "@/lib/services/PetService";
import { useSession } from "@/contexts/SessionContext";
import {capitalize, snakeCase} from "lodash";
import Image from "next/image";
import { ChevronRight } from "lucide-react";


export function PetDialog({ show, onClose, pet, setPet }: { show: boolean; onClose: () => void, pet: any, setPet: Dispatch<SetStateAction<any>> }) {

  const [pets, setPets ] = useState<any[]>([]);
  const {user} = useSession();

  const petService = new PetService();

  const loadPets = async () =>{

    console.log("load concerns");

    try {
        const results = await petService.fetchPetsByUserId(user?.id || "");
        console.log(results);
        setPets(results.data);
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    loadPets();
  },[])

  

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg lg:max-w-3xl min-h-[70vh] flex flex-col bg-white text-black rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#0F5544] font-semibold">Who is this appointment for?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col justify-between flex-1">
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 py-4">
            {pets.map(pet => (
              <button className="flex items-center cursor-pointer" key={pet.id} onClick={() => {setPet(pet); onClose();}}>
                  <img
                    src={`/img/pet-logo/${snakeCase(pet.speciesName)}.png`}
                    alt="Pet"
                    className="rounded-xl w-[60px] h-[60px] mr-2"
                  />
                  <div className="flex flex-col justify-center">
                      <span className="text-xl text-left font-medium">{capitalize(pet.petName)}</span>
                      <span className="text-left">{pet.speciesName}</span>
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 text-black" />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
