"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

interface IOptions {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  selected: string;
  setSelected: (value: string) => void;
  className?: string;
  placeholder?: string;
  options: IOptions[];
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  search?: string;
  setSearch: (value: string) => void;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  selected,
  setSelected,
  className,
  placeholder,
  options,
  isLoading,
  setIsLoading,
  search="",
  setSearch
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          role="combobox"
          aria-expanded={open}
          className={className}
        >
          {selected
            ? selected
            : (<span className="text-gray-400 font-normal">{placeholder}</span>)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-1" >
        <Command>
          <Input value={search} onChange={(e) => {setSearch(e.target.value); setIsLoading(true)}} placeholder={placeholder} />
          <CommandList>
            {!isLoading && <CommandEmpty>Not found.</CommandEmpty>}
            <CommandGroup>
              {!isLoading && options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    setSelected(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  
                </CommandItem>
              ))}
              {isLoading && (
                <CommandItem disabled className="flex flex-row">
                  <span className="w-4 h-4 border-4 border-t-white border-l-white border-b-white rounded-full animate-spin"/>
                  <span>Loading...</span>
                </CommandItem>
              )}
            </CommandGroup>

          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
