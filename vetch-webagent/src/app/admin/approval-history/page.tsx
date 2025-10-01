"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { IVet } from "../type";
import { AdminService } from "@/lib/services/AdminService";
import AppPaginationClient from "@/components/app-pagination-client";
import { formatIsoJakarta } from "@/lib/utils/formatDate";
import LoadingOverlay from "@/components/LoadingOverlay";

// const historyData = [
//   {
//     name: "Dr. Seemore",
//     type: "Registration Certificate",
//     status: "Approved",
//     date: "20 May 2025 at 10:00",
//   },
//   {
//     name: "Dr. Taftian",
//     type: "Specialty Certificate",
//     status: "Disapproved",
//     date: "19 May 2025 at 11:00",
//   },
//   {
//     name: "Dr. Raydawn",
//     type: "Specialty Certificate",
//     status: "Disapproved",
//     date: "18 May 2025 at 12:00",
//   },
//   {
//     name: "Dr. Seemore",
//     type: "Registration Certificate",
//     status: "Approved",
//     date: "17 May 2025 at 14:00",
//   },
// ];

export default function ApprovalHistoryPage() {
  const [selected, setSelected] = useState<null | IVet>(null);
  const [historyData, setHistoryData] = useState<IVet[]>([]);

  const adminService = new AdminService();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [volume, setVolume] = useState(5);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const loadCertificates = async () =>{
    try {
      const response = await adminService.fetchComfirmedVetCertificates(pageNumber,volume, query);
      console.log(response);
      if(response.ok){
        setHistoryData(response.data.flattened);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  useEffect(() =>{
    loadCertificates();
  }, [pageNumber, volume, query]);

  return (
    <div className="p-6 bg-[#A3D1C6] dark:bg-[#71998F]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-white">History</h1>
        <Input
          placeholder="Search for Veterinarian"
          className="w-full md:w-64 mt-3 md:mt-0 rounded-full bg-white dark:bg-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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

      {/* History list */}
      <div className="space-y-2">
        {historyData.map((item, i) => {
          const formattedDate = formatIsoJakarta(item.verifiedDate!);
          return (
          <Card
            key={i}
            onClick={() => setSelected(item)}
            className="bg-transparent border-b border-black/20 shadow-none cursor-pointer hover:bg-white/10"
          >
            <CardHeader className="flex flex-row justify-between items-center p-4">
              <div>
                <CardTitle className="text-lg text-black dark:text-white">{item.fullName}</CardTitle>
                <p className="text-sm text-black/80 dark:text-white/80">Registration Certificate</p>
                <p
                  className={`text-sm font-semibold ${
                    item.verified
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.verified ? "Approved" : "Disapproved"}
                </p>
                <p className="text-sm text-black/70 dark:text-white/70">{formattedDate}</p>
              </div>
              <ChevronRight className="text-black" />
            </CardHeader>
          </Card>
        )})}

        {historyData.length === 0 && (
          <div className="flex items-center justify-center px-4 py-3">
            <p className="text-black dark:text-white font-medium">No Approval Yet</p>
          </div>
        )}
      </div>

      <AppPaginationClient 
          className="mt-6 flex justify-center"
          currentPage={pageNumber}
          totalPages={totalPages}
          onPageChange={(page) => {
            setIsLoading(true);
            setPageNumber(page);
          }}
          pageSize={volume}
          onPageSizeChange={(size) => {setIsLoading(true); setVolume(size)}}
          resetToPage1OnSizeChange={true}
        />

        <LoadingOverlay show={isLoading} />

      {/* Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg lg:max-w-4xl bg-[#1c2d29] text-white">
          <DialogHeader>
            <DialogTitle>Confirm Certificate</DialogTitle>
            {selected && (
              <DialogDescription asChild>
                <div className="text-gray-300 space-y-2">
                  <p>
                    <strong>Doctor:</strong> {selected.fullName}
                  </p>
                  <p>
                    <span
                      className={`font-semibold ${
                        selected.verified
                          ? "text-green-400"
                          : "text-red-500"
                      }`}
                    >
                      {selected.verified ? "Approved" : "Disapproved"}
                    </span>{" "}
                    | {formatIsoJakarta(selected.verifiedDate!)}
                  </p>
                </div>
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Certificate preview */}
          <div className="mt-4">
            <Image
              src={selected?selected.uploadCertificate: "/img/logo/logo.png"}
              alt="Certificate Preview"
              width={600}
              height={400}
              className="w-full rounded-lg border border-gray-600"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
