"use client";

import { use, useEffect, useState } from "react";
import DoctorScheduleCard from "@/components/ui/doctorschedulecard";
import { IVet } from "./types";
import { VetService } from "@/lib/services/VetService";
import AppPaginationClient from "@/components/app-pagination-client";
import { useLoading } from "@/contexts/LoadingContext";
import { Input } from "@/components/ui/input";
import VetFilters from "@/components/filters";

export default function HomePage() {
  const [doctors, setDoctors] = useState<IVet[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [volume, setVolume] = useState(12);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});

  const {setIsLoading} = useLoading();

  const vetService = new VetService();

  const loadVets = async () => {
    setIsLoading(true);
    try {
      const result = await vetService.fetchVets(pageNumber, volume, query, filters);
      console.log(result);
      if (result.ok) {
        setTotalPages(result.data.totalPages);
        setDoctors(result.data.vets);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadVets();
  }, [pageNumber, volume]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadVets();
    }, 300); // 0.3 seconds

    return () => clearTimeout(delayDebounce); // clear if user keeps typing
  }, [query]);

  return (
    <div className="min-h-screen w-full bg-[#FBFFE4] dark:bg-[#2E4F4A] text-white pb-4">
      <div className="flex flex-1">
        <div className="flex-1 p-8 bg-[#FBFFE4] dark:bg-[#2E4F4A]">
          <div className="flex gap-10 pb-10 flex-col-reverse md:flex-row">
            {/* <PetTypeButton />
            <ScheduleButton />
            <FilterButton /> */}
            <VetFilters onChange={(f) => setFilters(f)}  onApply={() => loadVets()}/>
            <Input
              placeholder="Search for Vet"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              className="md:w-[50%] w-full text-black px-4 py-2 rounded-full bg-white dark:bg-white"
            />
          </div>

          {doctors.length>0 && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:w-[90%] gap-6 justify-items-center mx-auto">
            {doctors.map((doctor, index) => (
              <DoctorScheduleCard key={index} doctor={doctor} />
            ))}
          </div>}
          {doctors.length===0 && <div className="text-black dark:text-white text-center font-semibold">No vets found</div>}
        </div>
      </div>
      <AppPaginationClient
        className="mt-6 flex justify-center"
        currentPage={pageNumber}
        pageSizeOptions={[12, 18, 24]}
        totalPages={totalPages}
        onPageChange={(page) => {
          // setIsLoading(true);
          setPageNumber(page);
        }}
        pageSize={volume}
        onPageSizeChange={(size) => {
          // setIsLoading(true);
          setVolume(size);
        }}
        resetToPage1OnSizeChange={true}
      />
    </div>
  );
}
