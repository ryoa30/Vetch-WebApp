"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { IVet } from "../type";
import { AdminService } from "@/lib/services/AdminService";
import { useRouter } from "next/navigation";

export default function DashboardPage() {

  const adminService = new AdminService();

  const [certificates, setCertificates] = useState<IVet[]>([]);

  const router = useRouter();

  const loadCertificates = async () =>{
    try {
      const response = await adminService.fetchUncomfirmedVetCertificates(1,10);
      console.log(response);
      if(response.ok){
        setCertificates(response.data.flattened);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() =>{
    loadCertificates();
  }, [])

  return (
    <div className="w-full">
      {/* Header Welcome */}
      <div className="w-full bg-[#F7FBEF] dark:bg-[#2E4F4A] py-6 px-6">
        <h1 className="text-2xl font-bold text-black dark:text-white">Welcome Back Admin</h1>
      </div>

      {/* Dashboard Title */}
      <h1 className="text-3xl font-bold text-white p-6">Dashboard</h1>

      {/* Certificates */}
      <div className="px-6 mb-10 ">
        <div className="bg-[#FFFFFF] dark:bg-[#2D4A46] rounded-md overflow-hidden min-h-[30vh]">
          {/* Header container */}
          <div className="bg-[#3D8D7A] dark:bg-[#1c2d29] px-4 py-2">
            <h2 className="text-white font-semibold">Certificates to approve</h2>
          </div>

          {/* List */}
          <div>
            {certificates.map((c, i) => (
              <button key={i} className="block w-full" onClick={() => {router.push("/admin/certificates")} }>
                <div className="flex flex-col px-4">
                  <div
                    className={`flex items-center justify-between py-3 cursor-pointer ${
                      i < certificates.length - 1 ? "border-b border-gray-600/50" : ""
                    }`}
                  >
                    <div>
                      <p className="text-left text-black dark:text-white font-medium">{c.firstName}</p>
                      <p className="text-sm text-black dark:text-white">Registration Certificate</p>
                    </div>
                    <ChevronRight className="text-black" />
                  </div>
                  <div className="h-[0.5px] w-full bg-gray-500 self-center"></div>
                </div>
              </button>

            ))}
            {certificates.length === 0 && (
              <div className="flex items-center justify-center px-4 py-3">
                <p className="text-black dark:text-white font-medium">No certificates to approve</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
