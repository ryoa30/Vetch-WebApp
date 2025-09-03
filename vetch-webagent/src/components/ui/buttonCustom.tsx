import { Bone, Calendar, Filter } from "lucide-react";

export function PetTypeButton() {
  return (
    <button className="flex items-center gap-2 border border-gray-400 rounded-full px-4 py-2 bg-white hover:bg-gray-100">
      <Bone className="w-4 h-4" stroke="black" strokeWidth={2} />
      <span className="text-black font-semibold">Pet Type</span>
    </button>
  );
}

export function ScheduleButton() {
  return (
    <button className="flex items-center gap-2 border border-gray-400 rounded-full px-4 py-2 bg-white hover:bg-gray-100">
      <Calendar className="w-4 h-4" stroke="black" strokeWidth={2}/>
      <span className="text-black font-semibold">Schedule</span>
    </button>
  );
}

export function FilterButton() {
  return (
    <button className="flex items-center gap-2 border border-gray-400 rounded-full px-4 py-2 bg-white hover:bg-gray-100">
      <Filter className="w-4 h-4" stroke="black" strokeWidth={2}/>
      <span className="text-black font-semibold">Filter</span>
    </button>
  );
}
