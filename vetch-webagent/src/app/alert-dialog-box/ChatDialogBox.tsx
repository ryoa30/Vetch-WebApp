"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { SignalData } from "simple-peer";
import Peer, { type Instance } from "simple-peer";
import { io, type Socket } from "socket.io-client";
import {
  Send,
  Image as ImageIcon,
  Video,
  X,
  NotebookText,
  CalendarDays,
  Syringe,
  Stethoscope,
  Save,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  Flag,
  SendHorizonal,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChatService } from "@/lib/services/ChatService";
import { useSession } from "@/contexts/SessionContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import IncomingCallDialog from "./IncomingCallDialog";
import { BookingService } from "@/lib/services/BookingService";
import { formatLocalDate } from "@/lib/utils/formatDate";
import ConfirmationDialogBox from "./ConfirmationDialogBox";
import SuccessDialog from "./SuccessDialog";
import ErrorDialog from "./ErrorDialogBox";
import { useLoading } from "@/contexts/LoadingContext";
import { set } from "lodash";

// ---------- socket singleton (prevents duplicates in Next dev/HMR) ----------
let _socket: Socket | null = null;
function getSocket(): Socket | null {
  if (typeof window === "undefined") return null;
  if (!_socket) {
    _socket = io(
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
      { transports: ["websocket"] }
    );
  }
  return _socket;
}

// ---------- ICE servers (add TURN for production reliability) ----------
// Use STUN only (ok for testing)
const ICE_SERVERS: RTCIceServer[] = [
  {
    urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"],
  },
];

// For production, add TURN (replace with your real TURN host/creds)
// Example TURN servers for production (add real ones when enabling TURN)
// const ICE_SERVERS_WITH_TURN: RTCIceServer[] = [
//   {
//     urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"],
//   },
//   {
//     urls: "turn:turn.your-domain.com:3478?transport=udp",
//     username: "USER",
//     credential: "PASS",
//   },
//   {
//     urls: "turn:turn.your-domain.com:3478?transport=tcp",
//     username: "USER",
//     credential: "PASS",
//   },
// ];

export default function ChatDialogBox({
  isOpen,
  setIsOpen,
  bookingId,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  bookingId: any;
}) {

  const socket = useMemo(() => getSocket(), []);
  const { user } = useSession();

  // chat state
  const [isVetOptionsOpen, setIsVetOptionsOpen] = useState(false);
  const [imageMessage, setImageMessage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [booking, setBooking] = useState<any>(null);
  const {setIsLoading} = useLoading();
  // console.log("xkx", booking);

  const [conclussion, setConclussion] = useState( "");
  const [vaccinationDate, setVaccinationDate] = useState("");
  const [consultationDate, setConsultationDate] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successAction, setSuccessAction] = useState<() => void>(() => () => { console.log("click"); });
  const [isError, setIsError] = useState(false);

  // call state
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState(""); // caller socket id
  const [callerSignal, setCallerSignal] = useState<SignalData | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef<HTMLVideoElement | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<Instance | null>(null);
  const joinedRef = useRef<Set<string>>(new Set());

  const streamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  // keep refs in sync with state
  useEffect(() => {
    streamRef.current = stream ?? null;
  }, [stream]);
  useEffect(() => {
    remoteStreamRef.current = remoteStream ?? null;
  }, [remoteStream]);

  const endRef = useRef<HTMLDivElement | null>(null);

  const chatService = useMemo(() => new ChatService(), []);

  // helper
  function destroyPeer() {
    try {
      connectionRef.current?.removeAllListeners?.();
    } catch {}
    try {
      connectionRef.current?.destroy?.();
    } catch {}
    connectionRef.current = null;
    const pc = peerRef.current;
    if (pc) {
      try {
        pc.getSenders()?.forEach((s) => {
          try {
            pc.removeTrack(s);
          } catch {}
        });
        pc.ontrack = null;
        pc.onicecandidate = null;
        pc.onconnectionstatechange = null;
        pc.close();
      } catch {}
      peerRef.current = null;
    }
  }

  // -------- load chat messages when dialog opens ----------
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setIsLoading(true);
      try {
        const booking = await bookingService.fetchBookingById(bookingId);
        const res = await chatService.fetchMessages(bookingId, 100);
        setBooking(booking.ok ? booking.data : null);
        setConclussion(booking.ok ? booking.data.bookingConclusion || "" : "");
        setConsultationDate(booking.ok ? booking.data.pet.reminderConsultationDate.split("T")[0] || "" : "");
        setVaccinationDate(booking.ok ? booking.data.pet.reminderVaccineDate.split("T")[0] || "" : "");
        console.log(booking.data);
        if (res.ok) setMessages(res.data);
      } catch (e) {
        console.warn(e);
      }
      setIsLoading(false);
    })();
  }, [isOpen, bookingId, chatService]);

  function hardStopAllMedia() {
    // 1) state-backed local stream
    streamRef.current?.getTracks()?.forEach((t) => t.stop());

    // 2) anything hanging off the video tags
    const localElStream = (myVideo.current?.srcObject ||
      null) as MediaStream | null;
    localElStream?.getTracks()?.forEach((t) => t.stop());

    const remoteElStream = (userVideo.current?.srcObject ||
      null) as MediaStream | null;
    remoteElStream?.getTracks()?.forEach((t) => t.stop());
  }

  function clearVideoEls() {
    if (myVideo.current) {
      (myVideo.current as any).srcObject = null;
    }
    if (userVideo.current) {
      (userVideo.current as any).srcObject = null;
    }
  }

  // stable leave handler that always uses refs
  const onLeaveCall = useCallback(() => {
    destroyPeer();
    hardStopAllMedia();

    setStream(null);
    setRemoteStream(null);
    setCallEnded(true);
    setCallAccepted(false);
    setReceivingCall(false);
    setCaller("");
    clearVideoEls();
    setCallerSignal(null);
    setIsVideoCall(false);
    console.log("call ended by remote");
  }, []);

  // local ender stays the same, but reuse the same cleanup path
  const endCall = () => {
    if (!socket || !bookingId) return;
    socket.emit("leaveCall", { roomId: bookingId });
    onLeaveCall();
  };

  // -------- join room + minimal listeners tied to the room ----------
  useEffect(() => {
    if (!socket) return;
    const roomId = bookingId;
    if (!roomId) return;
    const joinedSet = joinedRef.current;

    // join once (dev StrictMode safe)
    if (!joinedRef.current.has(roomId)) {
      socket.emit("join_room", { roomId });
      joinedRef.current.add(roomId);
    }

    const onReceive = (msg: any) => setMessages((prev) => [...prev, msg]);
    const onIncomingCall = (data: {
      signal: SignalData;
      from: string;
      roomId: string;
      name?: string;
    }) => {
      console.log("receivingCall");
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    };

    const onFinishBooking = () => {
      setSuccessMessage("Your Consultation is ended");
      setIsSuccessOpen(true);
      setSuccessAction(() => () => { window.location.reload(); setIsOpen(false); });
    }

    socket.off("receive_message", onReceive);
    socket.on("receive_message", onReceive);

    socket.off("callUser", onIncomingCall);
    socket.on("callUser", onIncomingCall);

    socket.off("leaveCall"); // clear any prior handler
    socket.on("leaveCall", onLeaveCall);

    socket.off("finishBooking"); // clear any prior handler
    socket.on("finishBooking", onFinishBooking);

    return () => {
      socket.off("receive_message", onReceive);
      socket.off("callUser", onIncomingCall);
      socket.off("leaveCall", onLeaveCall);
      socket.emit("leave_room", { roomId });
      joinedSet.delete(roomId);
    };
  }, [socket, booking?.id, onLeaveCall, setIsOpen]);

  // -------- listen for callAccepted globally (not inside callUser) ----------
  useEffect(() => {
    if (!socket) return;
    const onCallAccepted = (signal: SignalData) => {
      if (connectionRef.current) {
        connectionRef.current.signal(signal);
        setCallAccepted(true);
      }
    };
    socket.off("callAccepted", onCallAccepted);
    socket.on("callAccepted", onCallAccepted);
    return () => {
      socket.off("callAccepted", onCallAccepted);
    };
  }, [socket]);

  // -------- bind local video whenever stream is ready & call UI is open ----------
  useEffect(() => {
    if (!isVideoCall || !stream || !myVideo.current) return;
    try {
      myVideo.current.srcObject = stream;
      myVideo.current.muted = true;
      myVideo.current.playsInline = true;
      void myVideo.current.play();
    } catch (e) {
      console.warn("attach local stream failed", e);
    }
  }, [isVideoCall, stream, isOpen]);

  // -------- bind remote video whenever remoteStream arrives ----------
  useEffect(() => {
    if (!isVideoCall || !remoteStream || !userVideo.current) return;
    try {
      userVideo.current.srcObject = remoteStream;
      userVideo.current.playsInline = true;
      void userVideo.current.play();
    } catch (e) {
      console.warn("attach remote stream failed", e);
    }
  }, [isVideoCall, remoteStream, isOpen]);

  // -------- helpers ----------
  const ensureLocalStream = async () => {
    if (stream && stream.getTracks().some((t) => t.readyState === "live")) {
      return stream;
    }
    // previous stream was stopped or missing → request a new one
    const s = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(s);
    return s;
  };

  const createPeer = (initiator: boolean, s: MediaStream) =>
    new Peer({
      initiator,
      trickle: false,
      stream: s,
      config: { iceServers: ICE_SERVERS },
    });

  // -------- chat send ----------
  const handleSend = () => {
    if (!message.trim() || !socket || !booking) return;
    socket.emit("send_message", {
      roomId: booking.id,
      senderId: user?.id,
      senderRole: user?.role,
      message,
      type: "message",
    });
    setMessage("");
  };

  const wirePeer = (peer: Instance) => {
    peer.on("stream", (remote) => {
      console.log("setRemoteStream", remote);
      setRemoteStream(remote);
    });
    peer.on("error", (e) => console.error("[peer] error", e));
    peer.on("close", () => {
      // remote hung up or peer destroyed → local cleanup
      destroyPeer();
      stream?.getTracks().forEach((t) => t.stop());
      setStream(null);
      clearVideoEls();
      setIsVideoCall(false);
    });
  };

  // caller
  const startCall = async () => {
    if (!socket || !booking?.id) return;
    setIsVideoCall(true);
    setCallEnded(false);
    const s = await ensureLocalStream();
    const peer = createPeer(true, s);

    peer.on("signal", (signalData) => {
      socket.emit("callUser", {
        roomId: booking.id,
        signalData,
        from: socket.id,
        name: user?.fullName,
        senderRole: user?.role
      });
      
    });

    wirePeer(peer);
    connectionRef.current = peer;
  };

  // callee
  const answerCall = async () => {
    if (!socket || !callerSignal) return;
    setIsVideoCall(true);
    setCallAccepted(true);
    setCallEnded(false);

    const s = await ensureLocalStream();
    const peer = createPeer(false, s);

    peer.on("signal", (signalData) => {
      socket.emit("answerCall", { to: caller, signal: signalData });
    });

    wirePeer(peer);
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  // camera/mic toggles
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const toggleCamera = () => {
    setCameraOn((prev) => {
      const next = !prev;
      stream?.getVideoTracks().forEach((t) => (t.enabled = next));
      return next;
    });
  };

  const toggleMic = () => {
    setMicOn((prev) => {
      const next = !prev;
      stream?.getAudioTracks().forEach((t) => (t.enabled = next));
      return next;
    });
  };

  useEffect(() => {
    if (!isVideoCall && isOpen) {
      endRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages, isOpen, isVideoCall]);

  const bookingService = new BookingService();

  const handleUpdateConclusion = async () => {
    setIsLoading(true);
    if(!booking?.id) {setIsLoading(false);return};
    if(conclussion.trim() === ""){
      setIsError(true);
      setIsLoading(false);
      return;
    }

    console.log(consultationDate, vaccinationDate);
    const result = await bookingService.changeBookingConclusionDate(booking.id, conclussion, consultationDate.toString(), vaccinationDate.toString());

    if(!result.ok){
      setIsError(true);
    }else{
      setSuccessMessage("Consultation details updated successfully");
      setIsSuccessOpen(true);
      setSuccessAction(() => () => { console.log("click"); });
    }
    setIsLoading(false);
  }

  const handleFinishConsultation = async () => {
    if(!booking?.id) return;
    if(conclussion.trim() === ""){
      setIsError(true);
      return;
    }
    handleUpdateConclusion();
    await bookingService.changeBookingStatus(booking.id, "DONE");
    if (!socket || !booking) return;
    socket.emit("finishBooking", {
      roomId: booking.id
    });
    setSuccessMessage("Your Consultation is ended");
    setIsSuccessOpen(true);
    setSuccessAction(() => () => { window.location.reload(); setIsOpen(false); });
    // window.location.reload();
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageMessage(e.target.files[0]);
      // Allow selecting the same file again by clearing the input value
      e.target.value = "";
    }
  };

  const handleCancelUpload = () => {
    setImageMessage(null);
  }

  const handleSendImage = async () => {
    if(!imageMessage || !socket || !booking) return;
    const uploadResult = await chatService.uploadImage(imageMessage);
    if(!uploadResult.ok){
      return;
    }
    console.log(uploadResult);
    socket.emit("send_message", {
      roomId: booking.id,
      senderId: user?.id,
      senderRole: user?.role,
      message:uploadResult.data,
      type: "image",
    });
    setImageMessage(null);
  }

  // Create and clean up a preview URL to avoid memory leaks and ensure updates
  useEffect(() => {
    if (!imageMessage) {
      setImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageMessage);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageMessage]);

  // ===================== RENDER =====================

  if (!isVideoCall) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={false}
          className={`${
            user?.role === "vet" ? "sm:max-w-4xl" : "sm:max-w-lg"
          } flex bg-white p-0 gap-0 rounded-lg shadow-xl overflow-hidden`}
        >
          {user?.role === "vet" && (
            <div className={`${isVetOptionsOpen ? "opacity-100 w-full" : "opacity-0 w-0 md:opacity-100 hidden md:block"} transition-all duration-300 md:w-2/3 h-[600px] bg-gray-50 md:relative absolute z-100 dark:bg-gray-800 p-4 flex flex-col border-r border-gray-200 dark:border-gray-700`}>
              <div className="mb-6">
                <div className="flex flex-row justify-between">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white mb-2">
                    <NotebookText className="w-5 h-5" />
                    Conclusion
                  </h3>
                  <button onClick={()=>setIsVetOptionsOpen(false)}>
                    <X className="w-5 h-5 md:hidden "/> 
                  </button>
                </div>
                <textarea
                  className="w-full h-32 p-2 border rounded-md min-h-[100px] bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3D8D7A]"
                  placeholder="Write conclusion here..."
                  value={conclussion}
                  onChange={(e) => setConclussion(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <h3 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white mb-3">
                  <CalendarDays className="w-5 h-5" />
                  Assign Schedule
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex gap-2">
                      <Syringe className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">Vaccination</span>
                    </div>
                    <input
                      type="date"
                      value={vaccinationDate}
                      className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3D8D7A]"
                      onChange={(e) => {if(e.target.value > formatLocalDate(new Date())) setVaccinationDate(e.target.value)}}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                      <Stethoscope className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">Consultation</span>
                    </div>
                    <input
                      type="date"
                      value={consultationDate}
                      className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3D8D7A]"
                      onChange={(e) => {if(e.target.value > formatLocalDate(new Date())) setConsultationDate(e.target.value);}}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-auto flex flex-col gap-3">
                <button className=" w-full bg-[#3D8D7A] hover:bg-[#327566] text-white duration-200 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2" 
                  onClick={handleUpdateConclusion}
                >
                  <Save className="w-5 h-5" />
                  Save Details
                </button>
                {booking && <ConfirmationDialogBox 
                  message={"Are you sure you want to end the consultation? This action cannot be undone."} 
                  subMessage={`${new Date(new Date(booking?.bookingDate.split("T")[0] +"T"+ (booking?.bookingTime.split("T")[1]).split("Z")[0]).getTime() + 30*60000) > new Date() ? "There is still time for the booking" : ""}`}
                  onConfirm={handleFinishConsultation}
                >
                  <button className=" w-full bg-red-600 hover:bg-red-800 text-white duration-200 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2" 
                  >
                    <Flag className="w-5 h-5" />
                    End Consultation
                  </button>
                </ConfirmationDialogBox>}
              </div>
            </div>
          )}

          <div className="flex flex-col h-[600px] w-full relative">
            <DialogTitle>
              <div className="bg-teal-600 dark:bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
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
                
              <div className="flex items-center gap-2">
                <button
                  className="hover:bg-teal-700 rounded-full p-2 transition md:hidden"
                  onClick={() => setIsVetOptionsOpen((prev) => !prev)}
                >
                  <NotebookText size={24} />
                </button>

                <button
                  className="hover:bg-teal-700 rounded-full p-2 transition"
                  onClick={startCall}
                >
                  <Video size={24} />
                </button>
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
                      {msg.type === "image" &&  (
                        <div className="relative w-64 h-64">
                          <Image
                            src={msg.content}
                            alt="sent image"
                            fill
                            className="object-contain rounded-md"
                            unoptimized
                          />
                        </div>
                      )
                      }
                      {msg.type === "message" && <p className="text-sm leading-relaxed">{msg.content}</p>}
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
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 p-3  ">
                <div className={`absolute flex flex-col justify-start bottom-0 w-full left-0 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-700 transition-all duration-300 ${imageMessage ? 'h-[65%] p-2 border border-gray-300' : 'h-0'}`}>
                  <button onClick={handleCancelUpload} className="self-end rounded-full p-1 hover:bg-gray-500/50 mb-2 duration-200"><X className="w-5 h-5"/></button>
                  {imageMessage && imagePreviewUrl && (
                    <div className="relative h-[75%]">
                      <Image
                        src={imagePreviewUrl}
                        alt="preview"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                  <button
                    onClick={handleSendImage}
                    className="bg-white self-end font-bold mt-2 flex flex-row items-center gap-2 hover:bg-gray-50 text-teal-600 rounded-full p-2.5 border-gray-300"
                  >
                    Send Image <SendHorizonal size={20} />
                  </button>
                </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  disabled={imageMessage !== null}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ketik pesan di sini"
                  className="flex-1 dark:text-black bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleSend}
                  className="bg-white hover:bg-gray-300 duration-200 text-teal-600 rounded-full p-2.5 transition border border-gray-300"
                >
                  <Send size={20} />
                </button>
                <button
                  className="bg-white w-[40px] h-[40px] hover:bg-gray-300 duration-200 text-teal-600 rounded-full p-2.5 transition border border-gray-300"
                >
                  <input 
                    type="file"
                    accept="image/*"
                    className=" absolute w-[40px] h-[40px] opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                  />
                  <ImageIcon size={20} />
                </button>
              </div>
            </div>
          </div>
          <IncomingCallDialog
            open={receivingCall}
            callerName="Your Consultation"
            onAccept={answerCall}
            onDecline={endCall}
          />
          <SuccessDialog
            message={successMessage}
            open={isSuccessOpen}
            onOpenChange={(open) => {
              setIsSuccessOpen(open);
              if (!open) {
                try { successAction(); } catch (e) { console.error(e); }
              }
            }}
          />
          <ErrorDialog errors={["Conclussion is not valid or empty"]} onOpenChange={() => setIsError(false)} open={isError}/>
        </DialogContent>
      </Dialog>
    );
  }

  // ======= VIDEO CALL UI =======
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        showCloseButton={false}
        className="w-screen h-screen max-w-[100vw] sm:max-w-[100vw] p-0 rounded-none bg-black overflow-hidden flex flex-col"
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3">
          <div className="text-white/80 text-sm">Video Call</div>
          <button
            onClick={endCall}
            className="inline-flex items-center justify-center rounded-full p-2 hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Video area */}
        <div className="relative h-full w-full pt-12 pb-20">
          <div className="relative grid h-full w-full grid-cols-1 md:grid-cols-2">
            {/* Local (You) */}
            <div className="md:relative md:flex md:items-center md:w-full absolute bottom-0 right-0 z-10 w-[30vw] bg-black">
              {stream ? (
                <video
                  ref={myVideo}
                  muted
                  playsInline
                  autoPlay
                  className="w-full [transform:scaleX(-1)]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="rounded-2xl border-2 border-dashed border-white/20 px-8 py-10 text-center">
                    <VideoIcon className="mx-auto mb-3 h-10 w-10 text-white/60" />
                    <p className="text-white/90 font-medium">
                      Camera not ready
                    </p>
                    <p className="text-white/60 text-sm">
                      Grant permission or turn camera on.
                    </p>
                  </div>
                </div>
              )}
              <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-xs text-white/90">
                You
              </span>
            </div>

            {/* Remote (Callee) */}
            <div className="relative flex items-center w-full bg-black">
              {callAccepted && !callEnded && remoteStream ? (
                <video
                  ref={userVideo}
                  playsInline
                  autoPlay
                  className="w-full"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-6">
                  <div className="w-full max-w-md rounded-2xl border-2 border-dashed border-white/20 px-8 py-10 text-center">
                    <VideoIcon className="mx-auto mb-3 h-10 w-10 text-white/60" />
                    <p className="text-white/90 font-medium">
                      {receivingCall && !callAccepted
                        ? "Incoming call — tap Answer to connect."
                        : "Waiting for the other participant…"}
                    </p>
                    {receivingCall && !callAccepted && (
                      <div className="mt-4">
                        <Button variant="secondary" onClick={answerCall}>
                          Answer
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-xs text-white/90">
                Remote
              </span>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center p-4">
          <div className="flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md p-2">
            <Button
              size="icon"
              variant={cameraOn ? "secondary" : "destructive"}
              className="rounded-full"
              onClick={toggleCamera}
              aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
            >
              {cameraOn ? (
                <VideoIcon className="h-5 w-5" />
              ) : (
                <VideoOff className="h-5 w-5" />
              )}
            </Button>

            <Button
              size="icon"
              variant={micOn ? "secondary" : "destructive"}
              className="rounded-full"
              onClick={toggleMic}
              aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
            >
              {micOn ? (
                <Mic className="h-5 w-5" />
              ) : (
                <MicOff className="h-5 w-5" />
              )}
            </Button>

            <Button
              size="icon"
              variant="destructive"
              className="rounded-full"
              onClick={endCall}
              aria-label="End call"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}
