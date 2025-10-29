import React, { FC, useEffect } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface TimePickerNewProps {
  time: { hours: number; minutes: number };
  onTimeChange: (time: { hours: number; minutes: number }) => void;
  className?: string;
}

const TimePickerNew: FC<TimePickerNewProps> = ({
  time,
  onTimeChange,
  className,
}) => {
  const [displayHour, setDisplayHour] = React.useState("");
  const [displayMinute, setDisplayMinute] = React.useState("");
  const onValueChangeHour = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/[^\d]/g, "");
    const realValue = digits ? parseInt(digits, 10) : 0;
    const hours = Math.min(Math.max(realValue, 0), 23); // constrain to 0-23
    onTimeChange({ hours, minutes: time.minutes });
  };

  const onValueChangeMinute = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/[^\d]/g, "");
    const realValue = digits ? parseInt(digits, 10) : 0;
    const minutes = Math.min(Math.max(realValue, 0), 59);
    onTimeChange({ hours: time.hours, minutes });
  };

  useEffect(() => {
    setDisplayHour(String(time.hours).padStart(2, "0"));
    setDisplayMinute(String(time.minutes).padStart(2, "0"));
  }, [time]);

  return (
    <div className="flex flex-row gap-3">
      <Input
        type="text"
        inputMode="numeric"
        value={displayHour}
        onChange={onValueChangeHour}
        className={cn(
          "w-[48px] text-center text-black dark:text-white font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
      />
      <Input
        type="text"
        inputMode="numeric"
        value={displayMinute}
        onChange={onValueChangeMinute}
        className={cn(
          "w-[48px] text-center text-black dark:text-white font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
      />
    </div>
  );
};

export default TimePickerNew;
