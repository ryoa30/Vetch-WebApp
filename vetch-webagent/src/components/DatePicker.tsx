import React, { FC } from 'react'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react"

interface IProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    className?: string;
}

const DatePicker:FC<IProps> = ({date, setDate, className}) => {

  const [open, setOpen] = React.useState(false)
//   const [date, setDate] = React.useState<Date | undefined>(undefined)
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            id="date"
            className={"justify-between font-normal " + className}
          >
            {date ? date.toLocaleDateString() : (<span className="text-gray-500">dd/mm/yyyy, cannot be in the future</span>)}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
  )
}

export default DatePicker
