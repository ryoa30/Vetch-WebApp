"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, Save, X } from "lucide-react";
import { VetService } from "@/lib/services/VetService";
import { useSession } from "@/contexts/SessionContext";
import { ScheduleData, VetData } from "@/app/types";
import {
  dateToHHMM,
  dateToUTCDate,
  hhmmToUtcString,
  hourMinuteFromString,
} from "@/lib/utils/formatDate";
import TimePickerNew from "@/components/TimePickerNew";
import { useLoading } from "@/contexts/LoadingContext";
import ErrorDialog from "@/app/alert-dialog-box/ErrorDialogBox";
import ConfirmationDialogBox from "@/app/alert-dialog-box/ConfirmationDialogBox";
import { Checkbox } from "@radix-ui/react-checkbox";
import SuccessDialog from "@/app/alert-dialog-box/SuccessDialog";

// Data jadwal untuk contoh

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function SchedulesPage() {
  // State untuk melacak hari yang aktif
  const [activeDay, setActiveDay] = useState(daysOfWeek[0]);
  const { user } = useSession();
  const vetService = new VetService();
  const [schedule, setSchedule] = useState<ScheduleData[]>([]);
  const [baseSchedule, setBaseSchedule] = useState<ScheduleData[]>([]);
  const { setIsLoading } = useLoading();
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const startRef = useRef<HTMLDivElement | null>(null);
  const [isAvailHomecare, setIsAvailHomecare] = useState(false);
  const [isAvailEmergency, setIsAvailEmergency] = useState(false);

  const loadVetDetails = async () => {
      try {
        const response = await vetService.fetchVetDetailsByUserId(user!.id);
        if (response.ok) {
          const data:VetData = response.data;
          setIsAvailHomecare(data.isAvailHomecare);
          setIsAvailEmergency(data.isAvailEmergency);
        }
      } catch (error) {
        console.log(error);
      }
    };

  const loadSchedule = async () => {
    setIsLoading(true);
    try {
      const response = await vetService.fetchVetDailySchedule(
        user!.id,
        daysOfWeek.indexOf(activeDay) + 1
      );
      console.log(response.data);
      if (response.ok) {
        setSchedule(response.data);
        setBaseSchedule(response.data);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadVetDetails();
  }, [])

  useEffect(() => {
    loadSchedule();
  }, [activeDay]);

  const scrollToStart = () => {
    startRef.current?.scrollIntoView({ behavior: "smooth" });
  }


  const handleChangeSchedule = (
    index: number,
    newTime: { hours: number; minutes: number }
  ) => {
    const updatedSchedule = schedule.map((time, i) =>
      i === index ? { ...time, timeOfDay: hhmmToUtcString(newTime) } : time
    );
    setSchedule(updatedSchedule);
  };

  const handleSaveSchedule = async (index: number) => {
    setIsLoading(true);
    try {
      const time = schedule[index].timeOfDay.slice(11, 16);
      if(schedule[index].id.startsWith("new")){
        const response = await vetService.postVetSchedule(
          user!.id,
          time,
          daysOfWeek.indexOf(activeDay) + 1
        );
        console.log(response);
        const excludedSchedule = schedule.filter((s, i) => i !== index && !s.id.startsWith("new"));
        const newSchedules = schedule.filter((s, i) => i!==index && s.id.startsWith("new"));
        const sorted = [...excludedSchedule, response.data].sort((a, b) => a.timeOfDay.localeCompare(b.timeOfDay));
        setSchedule([...newSchedules,...sorted]);
        setBaseSchedule(sorted);
      }else{
        const response = await vetService.updateVetSchedule(
          schedule[index].id,
          user!.id,
          time,
          daysOfWeek.indexOf(activeDay) + 1
        );
        setBaseSchedule((prev)=>{
          const updated = prev.map((s, i) =>
            i === index ? { ...s, timeOfDay: schedule[index].timeOfDay } : s
          );
          return updated;
        });
        console.log(response);
      }
      
    } catch (error) {
      setOpenError(true);
      setErrorMessages(["Schedule must be at least 30 minutes apart."]);
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleDeleteSchedule = async (index: number) => {
    setIsLoading(true);
    try {
      if(schedule[index].id !== "new"){
        const response = await vetService.deleteVetSchedule(
          schedule[index].id
        );
        setBaseSchedule(baseSchedule.filter((s) => s.id !== schedule[index].id));
        console.log(response);
      }
      setSchedule(schedule.filter((_, i) => i !== index));
    } catch (error) {
      setOpenError(true);
      setErrorMessages(["Failed to delete schedule. Please try again later."]);
      console.log(error);
    }
    setIsLoading(false);
  }

  useEffect(()=>{
    console.log("Schedule updated: ", schedule);
    console.log("Base Schedule: ", baseSchedule);
  }, [schedule, baseSchedule])

  const handleAddDraftSchedule = async () => {
    const newSchedule: ScheduleData = {
      id: `new${Date.now()}`,
      vetId: user!.id,
      dayNumber: daysOfWeek.indexOf(activeDay) + 1,
      timeOfDay: "1970-01-01T09:00:00Z",
      isDeleted: false,
    };
    setSchedule([newSchedule, ...schedule]);
    scrollToStart();
  }

  const handleSaveAvailability = async () => {
    try {
      const response = await vetService.updateVetAvailability(
        user!.id,
        isAvailHomecare,
        isAvailEmergency
      );
      if(response.ok){
        setOpenSuccess(true);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-8 flex flex-col items-center">
      {/* --- Daily Schedule Card --- */}
      <div className="bg-white dark:bg-[#1F2D2A] rounded-xl shadow-lg p-6 max-w-3xl w-full overflow-y-hidden max-h-[400px]">
        <div className="w-full flex flex-row mb-6 justify-between items-center">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Daily Schedule
          </h2>
          <button className="text-start cursor-pointer font-medium text-gray-800 dark:text-white hover:underline" onClick={handleAddDraftSchedule}>
            Add new +
          </button>
        </div>
        <div className="flex border border-gray-200 rounded-sm">
          {/* Bagian Kiri: Pilihan Hari */}
          <div className="w-1/2 p-4 border-r border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              {daysOfWeek.map((day) => (
                <Button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  variant="outline"
                  className={`
                    justify-center rounded-lg text-sm font-medium
                    ${
                      activeDay === day
                        ? "bg-gray-800 dark:bg-white dark:text-black text-white hover:bg-gray-200 dark:hover:text-white"
                        : "bg-white text-gray-700 dark:text-white hover:bg-gray-100 border-gray-300"
                    }
                  `}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          {/* Bagian Kanan: Pilihan Waktu */}
          <div className="w-1/2 p-4 pl-8 max-h-[300px] overflow-y-scroll custom-scrollbar-secondary">
            <div className="space-y-4">
              <div ref={startRef} />
              {schedule.map((time, index) => (
                <div
                  key={time.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 text-black dark:text-white">
                    <span>•</span>
                    <span>Time {!time.id.startsWith("new") ? index + 1 : "New"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-black">
                      {/* <span className="bg-gray-100 rounded px-3 py-1 text-sm font-mono">{time.hour}</span>
                      <span>:</span>
                      <span className="bg-gray-100 rounded px-3 py-1 text-sm font-mono">{time.minute}</span> */}
                      <TimePickerNew
                        time={hourMinuteFromString(time.timeOfDay)}
                        onTimeChange={(time) =>
                          handleChangeSchedule(index, time)
                        }
                      />
                    </div>
                    <ConfirmationDialogBox message="Are you sure you want to delete this schedule?" subMessage="This action cannot be undone" onConfirm={() => handleDeleteSchedule(index)}>
                      <button className="text-gray-400 hover:text-red-500 text-xl">
                        <X className="w-5 h-5" />
                      </button>
                    </ConfirmationDialogBox>
                    <button
                      className={`text-gray-400 text-xl ${
                        baseSchedule.find((s) => s.id === time.id) &&
                        baseSchedule.find((s) => s.id === time.id)!.timeOfDay === time.timeOfDay
                          ? "opacity-0"
                          : "cursor-pointer hover:text-green-500"
                      }`}
                      disabled={
                        baseSchedule.some((s) => s.id === time.id) &&
                        baseSchedule.find((s) => s.id === time.id)!.timeOfDay === time.timeOfDay
                      }
                      onClick={()=>handleSaveSchedule(index)}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full my-auto h-[0.5px] bg-gray-400 mt-6"></div>

      {/* --- Service Cards --- */}
      <div className="flex gap-3 mt-6 max-w-3xl w-full">
        {/* Home Care Service Card */}
        <div className="bg-white dark:bg-[#1F2D2A] rounded-xl shadow-lg p-4 flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            Home Care Service
          </h3>
          <div className="flex flex-row gap-3">
            <Button 
            onClick={() => setIsAvailHomecare(true)}
            variant="outline"
            className={`
                    justify-center rounded-lg text-sm font-medium flex-1/2
                    ${
                      isAvailHomecare
                        ? "bg-gray-800 dark:bg-white dark:text-black text-white hover:bg-gray-200 dark:hover:text-white"
                        : "bg-white text-gray-700 dark:text-white hover:bg-gray-100 border-gray-300"
                    }
                  `}>
                Yes!
            </Button>
            <Button 
            variant="outline"
            onClick={() => {setIsAvailHomecare(false);setIsAvailEmergency(false)}}
            className={`
                    justify-center rounded-lg text-sm font-medium flex-1/2
                    ${
                      !isAvailHomecare
                        ? "bg-gray-800 dark:bg-white dark:text-black text-white hover:bg-gray-200 dark:hover:text-white"
                        : "bg-white text-gray-700 dark:text-white hover:bg-gray-100 border-gray-300"
                    }
                  `}>
                No
            </Button>
          </div>
        </div>

        {/* Emergency Service Card */}
        <div className="bg-white dark:bg-[#1F2D2A] rounded-xl shadow-lg p-4 flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            Emergency Service
          </h3>
          <div className="flex flex-row gap-3">
            <Button 
            onClick={() => setIsAvailEmergency(true)}
            disabled={!isAvailHomecare}
            variant="outline"
            className={`
                    justify-center rounded-lg text-sm font-medium flex-1/2
                    ${
                      isAvailEmergency
                        ? "bg-gray-800 dark:bg-white dark:text-black text-white hover:bg-gray-200 dark:hover:text-white"
                        : "bg-white text-gray-700 dark:text-white hover:bg-gray-100 border-gray-300"
                    }
                  `}>
                Yes!
            </Button>
            <Button 
            variant="outline"
            onClick={() => setIsAvailEmergency(false)}
            disabled={!isAvailHomecare}
            className={`
                    justify-center rounded-lg text-sm font-medium flex-1/2
                    ${
                      !isAvailEmergency
                        ? "bg-gray-800 dark:bg-white dark:text-black text-white hover:bg-gray-200 dark:hover:text-white"
                        : "bg-white text-gray-700 dark:text-white hover:bg-gray-100 border-gray-300"
                    }
                  `}>
                No
            </Button>
          </div>
        </div>

        <button className="bg-white p-3 rounded-xl flex items-center font-semibold justify-center text-black hover:bg-[#1F2D2A] hover:text-white duration-200" onClick={handleSaveAvailability}>
          <div className="flex flex-col gap-1 items-center">
            <Save className="w-8 h-8 "/>
            Save <br></br>Availability
          </div>
        </button>
      </div>
      <ErrorDialog open={openError} onOpenChange={() => setOpenError(false)} errors={errorMessages}/>
      <SuccessDialog open={openSuccess} onOpenChange={()=>setOpenSuccess(false)} message="Availability saved successfully!" />
    </div>
  );
}
