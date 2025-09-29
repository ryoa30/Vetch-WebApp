"use client";
import { useState } from "react";
import {
  X,
  Video,
  SendHorizonal,
  Paperclip,
  Image as ImageIcon,
  NotebookText,
  CalendarDays,
  Syringe,
  Stethoscope,
  Save,
} from "lucide-react";

// Definisikan tipe untuk sebuah pesan
interface Message {
  id: number;
  text: string;
  timestamp: string;
  sender: "me" | "other";
}

// Definisikan tipe untuk props komponen
interface LiveChatProps {
  open: boolean;
  onClose: () => void;
  vetName?: string;
}

export default function OverlayLiveChat({
  open,
  onClose,
  vetName = "Aryo",
}: LiveChatProps) {
  // Gunakan tipe Message untuk state array
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Ada yang bisa saya bantu ?", timestamp: "23.35", sender: "other" },
    { id: 2, text: "Kucing gw ketabrak truk dok", timestamp: "23.35", sender: "me" },
    { id: 3, text: "Bisa kerumah sekarang ?", timestamp: "23.35", sender: "me" },
    { id: 4, text: "Oke saya segera kesana", timestamp: "23.35", sender: "other" },
  ]);

  // Tipe state untuk input adalah string
  const [newMessage, setNewMessage] = useState<string>("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const newMsg: Message = {
      id: messages.length + 1,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      sender: "me",
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl h-[90vh] flex overflow-hidden">
        {/* Kolom Kiri - Panel Dokter */}
        <div className="w-1/3 bg-gray-50 dark:bg-gray-800 p-4 flex flex-col border-r border-gray-200 dark:border-gray-700">
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
        </div>

        {/* Kolom Kanan - Chat */}
        <div className="w-2/3 flex flex-col bg-white dark:bg-gray-900">
          {/* Header Chat */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <span className="font-semibold dark:text-white">{vetName}</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 dark:text-gray-300">
                <Video className="w-6 h-6" />
              </button>
              <button onClick={onClose} className="text-gray-600 dark:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Area Pesan */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-100/50 dark:bg-gray-800/50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-3 py-2 max-w-sm ${msg.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-[#E5F2E8] dark:bg-gray-700 dark:text-gray-200'}`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Pesan */}
          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                // Tambahkan tipe untuk event 'e'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ketik pesan di sini"
                className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D8D7A]"
              />
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#3D8D7A]">
                 <ImageIcon className="w-6 h-6" />
              </button>
               <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#3D8D7A]">
                 <Paperclip className="w-6 h-6" />
              </button>
              <button onClick={handleSendMessage} className="bg-[#3D8D7A] text-white rounded-full p-2 hover:bg-[#327566]">
                <SendHorizonal className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}