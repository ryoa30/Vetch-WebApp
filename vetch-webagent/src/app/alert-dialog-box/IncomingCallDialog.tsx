// components/IncomingCallDialog.tsx
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { PhoneIcon, PhoneOff, Video as VideoIcon } from "lucide-react";
import { useEffect, useRef } from "react";

type IncomingCallDialogProps = {
  open: boolean;
  callerName: string;
  callerAvatar?: string;
  onAccept: () => void;
  onDecline: () => void;
  withVideo?: boolean;        // if true, show video icon on accept
  playRingtone?: boolean;     // optional ringtone
};

export default function IncomingCallDialog({
  open,
  callerName,
  onAccept,
  onDecline,
  playRingtone = true,
}: IncomingCallDialogProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!playRingtone) return;
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/ringtone.mp3"); // place a short loopable file in /public/sounds
      audioRef.current.loop = true;
      audioRef.current.volume = 0.6;
    }
    if (open) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    return () => {
      audioRef.current?.pause();
    };
  }, [open, playRingtone]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onDecline()}>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-md p-0 overflow-hidden rounded-2xl border border-gray-200 shadow-2xl"
      >
        <DialogTitle className="sr-only">Incoming Call</DialogTitle>
        
        <div className="bg-white dark:bg-gray-800">
          {/* Header */}
          <div className="px-5 py-4 bg-teal-600 text-white flex items-center justify-between">
            <span className="font-semibold">Incoming Call</span>
          </div>

          {/* Body */}
          <div className="px-6 py-6 flex flex-col items-center text-center gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Calling from</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white animate-bounce">
                {callerName}
              </h3>
            </div>

            {/* Actions */}
            <div className="mt-2 grid grid-cols-2 gap-4 w-full">
              <button
                onClick={onDecline}
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-white text-red-600 px-4 py-3 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <PhoneOff className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Decline
              </button>
              <button
                onClick={onAccept}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 text-white px-4 py-3 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                  <VideoIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Accept
              </button>
            </div>

            {/* Tips / shortcuts */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
