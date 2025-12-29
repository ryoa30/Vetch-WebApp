"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChatService } from "@/lib/services/ChatService";
import { useSession } from "@/contexts/SessionContext";
import Image from "next/image";

export default function ChatHistoryDialogBox({
  isOpen,
  setIsOpen,
  booking,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  booking: any;
}) {
  const { user } = useSession();

  // chat state
  const [messages, setMessages] = useState<any[]>([]);

  const chatService = new ChatService();

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages, isOpen]);

  // -------- load chat messages when dialog opens ----------
  useEffect(() => {
    if (!isOpen || !booking) return;
    (async () => {
      try {
        const res = await chatService.fetchMessages(booking.id, 100);
        if (res.ok) setMessages(res.data);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, [isOpen, booking]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        showCloseButton={false}
        className={` sm:max-w-lg flex bg-white p-0 gap-0 rounded-lg shadow-xl overflow-hidden`}
      >
        <div className="flex flex-col h-[600px] w-full">
          <DialogTitle>
            <div className="bg-teal-600 dark:bg-[#1F2D2A] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-teal-700 rounded-full p-1 transition"
                >
                  <X size={24} />
                </button>
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Image
                    src={
                      booking
                        ? booking.vet.user.profilePicture ||
                          "https://res.cloudinary.com/daimddpvp/image/upload/v1758101764/default-profile-pic_lppjro.jpg"
                        : ""
                    }
                    alt="chat bubble icon"
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                </div>
                <span className="font-semibold text-lg">
                  {booking &&
                    (user?.role === "vet"
                      ? `${booking.pet.user.fullName} (${booking.pet.petName})`
                      : `dr. ${booking ? booking.vet.user.fullName : ""}`)}
                </span>
              </div>
            </div>
          </DialogTitle>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-gray-50 dark:bg-gray-700">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.sender_id !== user?.id
                    ? "justify-end flex-row-reverse"
                    : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[100%] sm:max-w-[75%] ${
                    msg.sender_id !== user?.id ? "order-1" : "order-2"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 shadow-lg ${
                      msg.sender_id !== user?.id
                        ? "bg-yellow-50 text-gray-800 rounded-bl-none"
                        : "bg-blue-300 text-gray-800 rounded-br-none"
                    }`}
                  >
                    {msg.type === "image" && (
                      <div className="relative w-64 h-64">
                        <Image
                          src={msg.content}
                          alt="sent image"
                          fill
                          className="object-contain rounded-md"
                          unoptimized
                        />
                      </div>
                    )}
                    {msg.type === "message" && (
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-end gap-1 mt-1 px-1">
                  <span className="text-xs text-gray-500">
                    {new Date(msg.inserted_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input Area */}
          <div className="bg-[#3D8D7A] dark:bg-[#1F2D2A] border-t border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <span className="text-black w-[80%] py-2 text-2xl bg-white rounded-lg text-center mx-auto font-medium">
                {" "}
                Chat History{" "}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
