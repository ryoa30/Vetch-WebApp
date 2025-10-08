import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";

interface IProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

const DatePicker: FC<IProps> = ({ date, setDate, className }) => {
  const [open, setOpen] = React.useState(false);

  return (
    // isolate creates its own stacking context, avoiding weird ancestors
    <div className="relative isolate z-[70]">
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={`justify-between font-normal ${className ?? ""}`}
          >
            {date ? date.toLocaleDateString() : (
              <span className="text-gray-500">dd/mm/yyyy, cannot be in the future</span>
            )}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          // ⬇️ Make absolutely sure the layer captures clicks
          className="w-auto p-0 z-[80] border shadow-md pointer-events-auto"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}  // stop outside-close
          onInteractOutside={(e) => e.preventDefault()}     // stop outside-close
          // If your shadcn PopoverContent supports it, keep it in the body portal:
          // container={document.body}
          // And as a last resort:
          style={{ pointerEvents: "auto" }}
        >
          <div className="pointer-events-auto"> {/* extra guard */}
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              toDate={new Date()}
              initialFocus
              onSelect={(d) => {
                if (!d) return;
                setDate(d);
                setOpen(false);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
