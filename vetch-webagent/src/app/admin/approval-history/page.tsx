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

const historyData = [
  {
    name: "Dr. Seemore",
    type: "Registration Certificate",
    status: "Approved",
    date: "20 May 2025 at 10:00",
  },
  {
    name: "Dr. Taftian",
    type: "Specialty Certificate",
    status: "Disapproved",
    date: "19 May 2025 at 11:00",
  },
  {
    name: "Dr. Raydawn",
    type: "Specialty Certificate",
    status: "Disapproved",
    date: "18 May 2025 at 12:00",
  },
  {
    name: "Dr. Seemore",
    type: "Registration Certificate",
    status: "Approved",
    date: "17 May 2025 at 14:00",
  },
];

export default function ApprovalHistoryPage() {
  const [selected, setSelected] = useState<null | typeof historyData[0]>(null);

  return (
    <div className="p-6 bg-[#A3D1C6] dark:bg-[#71998F]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-white">History</h1>
        <Input
          placeholder="Search for patient"
          className="w-full md:w-64 mt-3 md:mt-0 rounded-full bg-white dark:bg-white"
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
        {historyData.map((item, i) => (
          <Card
            key={i}
            onClick={() => setSelected(item)}
            className="bg-transparent border-b border-black/20 shadow-none cursor-pointer hover:bg-white/10"
          >
            <CardHeader className="flex flex-row justify-between items-center p-4">
              <div>
                <CardTitle className="text-lg text-black dark:text-white">{item.name}</CardTitle>
                <p className="text-sm text-black/80 dark:text-white/80">{item.type}</p>
                <p
                  className={`text-sm font-semibold ${
                    item.status === "Approved"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.status}
                </p>
                <p className="text-sm text-black/70 dark:text-white/70">{item.date}</p>
              </div>
              <ChevronRight className="text-black" />
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg bg-[#1c2d29] text-white">
          <DialogHeader>
            <DialogTitle>Confirm Certificate</DialogTitle>
            {selected && (
              <DialogDescription asChild>
                <div className="text-gray-300 space-y-2">
                  <p>
                    <strong>Specialty:</strong> {selected.type}
                  </p>
                  <p>
                    <span
                      className={`font-semibold ${
                        selected.status === "Approved"
                          ? "text-green-400"
                          : "text-red-500"
                      }`}
                    >
                      {selected.status}
                    </span>{" "}
                    | {selected.date}
                  </p>
                </div>
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Certificate preview */}
          <div className="mt-4">
            <Image
              src="/img/sample-certificate.png"
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
