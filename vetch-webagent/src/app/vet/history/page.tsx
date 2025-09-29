import Image from "next/image";
import { Input } from "@/components/ui/input";


export default function HistoryPage() {
    return (
    <div className="p-6 bg-[#A3D1C6] dark:bg-[#71998F]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-white">History</h1>
        <Input
          placeholder="Search for Veterinarian"
          className="w-full md:w-[500px] mt-3 md:mt-0 rounded-full bg-white dark:bg-white"
        />
      </div>

      {/* Bone divider */}
      <div className="w-full flex justify-center mb-6">
        <Image
          src="/img/bone.png"
          alt="Bone Divider"
          width={1000}
          height={40}
          className="object-contain"
        />
      </div>

    </div>
  );
}