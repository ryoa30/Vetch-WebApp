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
import { Button } from "@/components/ui/button";
import { AdminService } from "@/lib/services/AdminService";
import { IVet } from "../type";
import ApproveCertificateDialogBox from "@/app/alert-dialog-box/ApproveCertificateDialogBox";
import DisapproveCertificateDialogBox from "@/app/alert-dialog-box/DisapproveCertificateDialogBox";
import AppPaginationClient from "@/components/app-pagination-client";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function CertificatesPage() {
  const [selected, setSelected] = useState<IVet| null>(null);

  const adminService = new AdminService();
  
  const [certificates, setCertificates] = useState<IVet[]>([]);

  const [openApproved, setOpenApproved] = useState(false);

  const [openDisapproved, setOpenDisapproved] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [volume, setVolume] = useState(5);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  const loadCertificates = async () =>{
    try {
      const response = await adminService.fetchUncomfirmedVetCertificates(pageNumber,volume, query);
      console.log(response);
      if(response.ok){
        setCertificates(response.data.flattened);
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

  const handleApprove = async () => {
    if (selected) { 
      console.log("selected", selected);
      await adminService.changeVetCertificateStatus(selected.id, true);
      setOpenApproved(false);
      setSelected(null);
      await loadCertificates();
    }
  }

  const handleDisapprove = async () => {
    if (selected) { 
      await adminService.changeVetCertificateStatus(selected.id, false);
      setOpenDisapproved(false);
      setSelected(null);
      await loadCertificates();
    }
  }

  return (
    <div className="p-6 bg-[#A3D1C6] dark:bg-[#71998F]">
      <ApproveCertificateDialogBox open={openApproved} onCancel={() => setOpenApproved(false)} onConfirm={handleApprove}/>
      <DisapproveCertificateDialogBox open={openDisapproved} onCancel={() => setOpenDisapproved(false)} onConfirm={handleDisapprove}/>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white">Certificates</h1>
        <Input
          placeholder="Search for Veterinarian"
          className="w-full md:w-64 mt-3 md:mt-0 rounded-full bg-white dark:bg-white text-black"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Ornament garis tulang */}
      <div className="w-full flex justify-center mb-6">
        <Image
          src="/img/bone.png"
          alt="Bone Divider"
          width={1000}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Certificates list */}
      <div className="space-y-2">
        {certificates.map((c, i) => (
          <Card
            key={i}
            onClick={() => setSelected(c)}
            className="bg-transparent border-b border-black/20 shadow-none cursor-pointer hover:bg-white/10"
          >
            <CardHeader className="flex flex-row justify-between items-center p-4">
              <div>
                <CardTitle className="text-lg text-black dark:text-white">{c.fullName}</CardTitle>
                <p className="text-sm text-black/80 dark:text-white/80">Registration Certificate</p>
              </div>
              <ChevronRight className="text-black" />
            </CardHeader>
          </Card>
        ))}

        {certificates.length === 0 && (
          <div className="flex items-center justify-center px-4 py-3">
            <p className="text-black dark:text-white font-medium">No certificates to approve</p>
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
        onPageSizeChange={(size) =>{setIsLoading(true); setVolume(size)}}
        resetToPage1OnSizeChange={true}
      />

      <LoadingOverlay show={isLoading} />

      {/* Dialog confirm */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg lg:max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1c2d29] text-white">
          <DialogHeader>
            <DialogTitle>Confirm Certificate</DialogTitle>
            <DialogDescription asChild>
              <div className="text-gray-300 space-y-2">
                {selected && (
                  <>
                    <div>
                      <strong>Doctor:</strong> {selected.fullName}
                    </div>
                    <div>
                      <strong>SIP:</strong> {selected.sipNumber}
                    </div>
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* Certificate Preview */}
          <div className="mt-4">
            <Image
              src={selected?selected.uploadCertificate: "/img/logo/logo.png"}
              alt="Certificate Preview"
              width={600}
              height={400}
              className="w-full rounded-lg border border-gray-600"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="destructive" onClick={() => setOpenDisapproved(true)}>
              Reject
            </Button>
            <Button onClick={() => setOpenApproved(true)}>Approve</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
