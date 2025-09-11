"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const certificates = [
  { name: "Dr. Seemore", type: "Registration Certificate" },
  { name: "Dr. Raydawn", type: "Specialty Certificate" },
  { name: "Dr. Taftian", type: "Species Certificate" },
  { name: "Dr. Lorensius", type: "Species Certificate" },
];

export default function CertificatesPage() {
  const [selected, setSelected] = useState<{
    name: string;
    type: string;
  } | null>(null);

  return (
    <div className="p-6 bg-[#A3D1C6] dark:bg-[#71998F]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white">Certificates</h1>
        <Input
          placeholder="Search for patient"
          className="w-full md:w-64 mt-3 md:mt-0 rounded-full bg-white dark:bg-white"
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
                <CardTitle className="text-lg text-black dark:text-white">{c.name}</CardTitle>
                <p className="text-sm text-black/80 dark:text-white/80">{c.type}</p>
              </div>
              <ChevronRight className="text-black" />
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Dialog confirm */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg bg-[#1c2d29] text-white">
          <DialogHeader>
            <DialogTitle>Confirm Certificate</DialogTitle>
            <DialogDescription asChild>
              <div className="text-gray-300 space-y-2">
                {selected && (
                  <>
                    <div>
                      <strong>Doctor:</strong> {selected.name}
                    </div>
                    <div>
                      <strong>Type:</strong> {selected.type}
                    </div>
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* Certificate Preview */}
          <div className="mt-4">
            <Image
              src="/img/certificate-placeholder.png"
              alt="Certificate Preview"
              width={600}
              height={400}
              className="w-full rounded-lg border border-gray-600"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="destructive" onClick={() => setSelected(null)}>
              Reject
            </Button>
            <Button onClick={() => setSelected(null)}>Approve</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
