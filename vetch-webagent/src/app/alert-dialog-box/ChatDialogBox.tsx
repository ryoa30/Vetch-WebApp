import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import {
  Send,
  Image as ImageIcon,
  FileText,
  Video,
  X,
  NotebookText,
  CalendarDays,
  Syringe,
  Stethoscope,
  Save,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChatService } from "@/lib/services/ChatService";
import { useSession } from "@/contexts/SessionContext";
import Image from "next/image";

const socket = io(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
);

export default function ChatDialogBox({ isOpen, setIsOpen, booking }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [me, setMe] = useState("");

  const joinedRef = useRef<Set<string>>(new Set());

  const { user } = useSession();

  const chatService = new ChatService();

  const loadChatDetails = async () => {
    try {
      if (booking) {
        const messages = await chatService.fetchMessages(booking.id, 100);
        console.log(messages);
        if (messages.ok) {
          setMessages(messages.data);
        } else {
          throw new Error("Failed to load messages");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const roomId = booking?.id;
    if (!roomId) return;

    const onReceive = (msg: any) => setMessages((prev) => [...prev, msg]);
    const onMe = (id: string) => setMe(id);

    // prevent duplicate join in dev StrictMode / remounts
    if (!joinedRef.current.has(roomId)) {
      socket.emit("join_room", { roomId });
      joinedRef.current.add(roomId);
    }

    socket.on("receive_message", onReceive);
    socket.on("me", onMe);

    return () => {
      socket.off("receive_message", onReceive);
      socket.off("me", onMe);
      socket.emit("leave_room", { roomId });
      joinedRef.current.delete(roomId);
    };
  }, [booking?.id]);

  useEffect(() => {
    if (isOpen && booking) {
      loadChatDetails();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (message.trim()) {
      const data = {
        roomId: booking.id,
        senderId: user?.id,
        senderRole: user?.role,
        message: message,
      };
      socket.emit("send_message", data);
      setMessage("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        showCloseButton={false}
        className={`${user?.role === "vet"?"sm:max-w-4xl":"sm:max-w-lg"} flex bg-white p-0 gap-0 rounded-lg shadow-xl overflow-hidden`}
      >
        {user?.role === "vet" && <div className="w-2/3 bg-gray-50 dark:bg-gray-800 p-4 flex flex-col border-r border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <h3 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white mb-2">
              <NotebookText className="w-5 h-5" />
              Conclusion
            </h3>
            <textarea
              className="w-full h-32 p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3D8D7A]"
              placeholder="Write conclusion here..."
            ></textarea>
          </div>
          <div className="mb-6">
            <h3 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white mb-3">
              <CalendarDays className="w-5 h-5" />
              Assign Schedule
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <Syringe className="w-5 h-5 text-gray-500" />
                 <input type="date" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3D8D7A]" />
              </div>
              <div className="flex items-center gap-3">
                 <Stethoscope className="w-5 h-5 text-gray-500" />
                 <input type="date" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3D8D7A]" />
              </div>
            </div>
          </div>
          <div className="mt-auto">
             <button className="w-full bg-[#3D8D7A] hover:bg-[#327566] text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                Save
             </button>
          </div>
        </div>}
        <div className="flex flex-col h-[600px] w-full">
          {/* Header */}
          <DialogTitle>
            <div className="bg-teal-600 text-white px-4 py-3 flex items-center justify-between">
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
                  dr. {booking ? booking.vet.user.fullName : ""}
                </span>
              </div>
              <button className="hover:bg-teal-700 rounded-full p-2 transition">
                <Video size={24} />
              </button>
            </div>
          </DialogTitle>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
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
                  className={`max-w-[75%] ${
                    msg.sender_id !== user?.id
                      ? "order-1"
                      : "order-2"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 shadow-lg ${
                    msg.sender_id !== user?.id
                        ? "bg-yellow-50 text-gray-800 rounded-bl-none"
                        : "bg-blue-300 text-gray-800 rounded-br-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
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
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ketik pesan di sini"
                className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={handleSend}
                className="bg-white hover:bg-gray-50 text-teal-600 rounded-full p-2.5 transition border border-gray-300"
              >
                <Send size={20} />
              </button>
              <button className="bg-white hover:bg-gray-50 text-teal-600 rounded-full p-2.5 transition border border-gray-300">
                <ImageIcon size={20} />
              </button>
              <button className="bg-white hover:bg-gray-50 text-teal-600 rounded-full p-2.5 transition border border-gray-300">
                <FileText size={20} />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
