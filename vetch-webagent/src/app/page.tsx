"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoading } from "@/contexts/LoadingContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IVet } from "./forPetParent/consultationVetList/types";
import { VetService } from "@/lib/services/VetService";

export default function Home() {

  const [doctors, setDoctors] = useState<IVet[]>([]);
  const {setIsLoading} = useLoading();
  const vetService = new VetService();

  const loadVets = async () => {
    setIsLoading(true);
    try {
      const result = await vetService.fetchVets(1, 3);
      console.log(result);
      if (result.ok) {
        setDoctors(result.data.vets);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(()=>{
    loadVets(); 
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#3D8D7A] dark:bg-[#1F2D2A] text-white relative">
      {/* Hero Section */}
      <div className="container mx-auto px-12 py-12">
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="lg:w-1/2 text-white mb-8 lg:mb-0 text-center sm:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
              Caring for Your Pets,
              <br />
              <span className="italic text-3xl lg:text-5xl">
                Anytime, Anywhere
              </span>
            </h1>
            <p className="text-lg mb-8 opacity-90">
              Connect with certified veterinarians for expert
              <br />
              pet care treatment in your area today!
            </p>
            <Link href={"/forPetParent/consultationVetList"} className="bg-white text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg">
              Consult Now
            </Link>
          </div>

          <div className="relative w-full lg:w-1/2">
            <div className="h-80">
              <img
                src="/img/dog.png"
                alt="dog"
                className="absolute left-1/2 -translate-x-1/2 bottom-0 lg:h-100 h-80 translate-y-20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-8 bg-[#B3D8A8] dark:bg-[#357C72]"></div>

      <div className="bg-[#FBFFE4] dark:bg-[#2E4F4A]">
        {/* Middle Section */}
        <div className="py-8">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Because Their{" "}
              <span className="text-[#3D8D7A] dark:text-blue-600">
                Health Matters
              </span>
            </h2>
            <p className="text-gray-600 dark:text-white mb-12 max-w-2xl mx-auto">
              Vetch ensures your pets receive the best medical
              <br />
              attention from verified experts.
            </p>

            <div className="flex justify-center mb-12">
              <img
                src="/img/dog-and-doctor.png"
                alt="Veterinarian with dog and cat"
                className="w-full max-w-4xl"
              />
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="pb-16 pt-0">
          {" "}
          {/* Mengurangi padding top menjadi 0 */}
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Safe, Secure, and Reliable
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-[900px] mx-auto">
              {/* Dr. Seemore */}
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="bg-white dark:bg-[#2D4236] shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-2">
                    <img
                      src={doctor.profilePicture}
                      alt="Dr Profile Picture"
                      className="w-full h-32 object-cover rounded-t"
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-gray-800 dark:text-white">
                        Dr. {doctor.fullName}
                      </span>
                      <span className="text-gray-600 font-semibold">Fee</span>
                    </div>
                    <div className="flex justify-end items-center mb-2">
                      <span className="text-xs text-gray-800 dark:text-white">
                        IDR {new Intl.NumberFormat("id-ID").format(doctor.price)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold text-xs text-gray-800 dark:text-white">
                        Pets Treated:
                      </span>
                      <span className="text-xs text-gray-700 ml-1 dark:text-white">
                        Chincilla, Spider, Cat, Dog
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
