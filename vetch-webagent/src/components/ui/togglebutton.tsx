import * as React from "react"
import { cn } from "@/lib/utils"
import { Sun, Moon } from "lucide-react" // You can replace with your own SVGs

export function ThemeToggleSwitch({
  defaultOn = true,
  onToggle,
  className,
}: {
  defaultOn?: boolean
  onToggle?: (isOn: boolean) => void
  className?: string
}) {
  const [isOn, setIsOn] = React.useState(defaultOn)

  const handleClick = () => {
    const newState = !isOn
    setIsOn(newState)
    onToggle?.(newState)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full transition-colors",
        isOn ? "bg-yellow-300" : "bg-gray-400",
        className
      )}
    >
      <span
        className={cn(
          "absolute left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform shadow",
          isOn ? "translate-x-6" : "translate-x-0"
        )}
      >
        {isOn ? (
          <Sun className="h-4 w-4 text-yellow-500" />
        ) : (
          <Moon className="h-4 w-4 text-gray-700" />
        )}
      </span>
    </button>
  )
}
