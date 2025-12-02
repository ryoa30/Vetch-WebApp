import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { PetService } from "@/lib/services/PetService";
import { useSession } from "@/contexts/SessionContext";
import {capitalize, snakeCase} from "lodash";
import { ChevronRight } from "lucide-react";
import { PetDialog as NewPetDialog } from "../../../../profile/pets/component/newPetDialog";



export function PetDialog({ show, onClose, pet, setPet }: { show: boolean; onClose: () => void, pet: any, setPet: Dispatch<SetStateAction<any>> }) {

  const [pets, setPets ] = useState<any[]>([]);
  const {user} = useSession();

  const [isAddPet, setIsAddPet] = useState(false);

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

  const handleSelectPet=(pet) => {
    setPet(pet); 
    onClose();
  }

  useEffect(() => {
    loadPets();
  },[])

  

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg lg:max-w-3xl min-h-[70vh] flex flex-col bg-white dark:bg-[#1F2D2A] text-black rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#0F5544] font-semibold dark:text-white">Who is this appointment for?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col justify-between flex-1">
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 py-4">
            {pets.map(pet => (
              <button className="flex items-center cursor-pointer" key={pet.id} onClick={() => handleSelectPet(pet)}>
                  <img
                    src={`/img/pet-logo/${snakeCase(pet.speciesName)}.png`}
                    alt="Pet"
                    className="rounded-xl w-[60px] h-[60px] mr-2 dark:invert"
                  />
                  <div className="flex flex-col justify-center">
                      <span className="text-xl text-left font-medium dark:text-white">{capitalize(pet.petName)}</span>
                      <span className="text-left dark:text-white">{pet.speciesName}</span>
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 text-black dark:text-white" />
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsAddPet(true)}
            className="px-6 py-2 border w-fit text-2xl ml-auto dark:border-white border-black text-black dark:text-white rounded-full font-semibold dark:hover:bg-gray-500 hover:bg-gray-100"
          >
            Add Pet
          </button>
        </div>
        <NewPetDialog show={isAddPet} onClose={()=>{setIsAddPet(false)}} onSubmit={()=>{loadPets()}} />
      </DialogContent>
    </Dialog>
  );
}
