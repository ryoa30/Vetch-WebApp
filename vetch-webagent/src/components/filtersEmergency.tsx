"use client";

import React, { useMemo, useState } from "react";
import { CalendarIcon, Filter, PawPrint, Clock, X, Check, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

// ---------- Types ----------
export type PetType =
  | "Cat"
  | "Dog"
  | "Bird"
  | "Rabbit"
  | "Hamster"
  | "Fish"
  | "Reptile"
  | "Exotic";

export type SchedulePreset = "Today" | "Tomorrow" | "This Week" | "Custom";

export type VetFilterState = {
  petTypes: PetType[];
  query: string;
  feeRange: [number, number]; // in IDR thousands (easier to handle)
  minRating?: number; // 0-5
  homecareAble: boolean;
};

const ALL_PET_TYPES: PetType[] = [
  "Cat",
  "Dog",
  "Bird",
  "Rabbit",
  "Hamster",
  "Fish",
  "Reptile",
  "Exotic",
];


// ---------- Main Component ----------
export default function VetFilters({
  value,
  onChange,
  onApply,
}: {
  value?: Partial<VetFilterState>;
  onChange?: (next: VetFilterState) => void;
  onApply?: (finalFilters: VetFilterState) => void;
}) {
  const [state, setState] = useState<VetFilterState>({
    petTypes: value?.petTypes ?? [],
    query: value?.query ?? "",
    feeRange: value?.feeRange ?? [50, 250], // Rp 50k - 250k
    minRating: value?.minRating ?? undefined,
    homecareAble: value?.homecareAble ?? false,
  });

  const update = (patch: Partial<VetFilterState>) => {
    const next = { ...state, ...patch } as VetFilterState;
    setState(next);
    onChange?.(next);
  };

  const activeChips = useMemo(() => {
    const chips: string[] = [];
    if (state.petTypes.length) chips.push(`${state.petTypes.join(", ")}`);
    if (state.minRating) chips.push(`${state.minRating.toFixed(1)}★+`);
    if (state.homecareAble) chips.push("Homecare");
    return chips;
  }, [state]);

  return (
    <div className="w-full sm:w-sm">
      {/* Top row */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-3">
        <PetTypePopover
          selected={state.petTypes}
          onChange={(petTypes) => update({ petTypes })}
        />
        <MoreFiltersDialog state={state} onChange={update} />
      </div>

      {/* Active chips */}
      {activeChips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {activeChips.map((c, i) => (
            <Badge key={i} variant="secondary" className="rounded-full px-3 py-1">
              {c}
            </Badge>
          ))}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-black dark:text-white "
            onClick={() => {
              const cleared: VetFilterState = {
                petTypes: [],
                query: "",
                feeRange: [50, 250],
                minRating: undefined,
                homecareAble: false,
              };
              setState(cleared);
              onChange?.(cleared);
            }}
          >
            Reset
          </Button>
          <Button
            size="sm"
            className="h-8"
            onClick={() => onApply?.(state)}
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------- Pet Type Popover ----------
function PetTypePopover({
  selected,
  onChange,
}: {
  selected: PetType[];
  onChange: (next: PetType[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (pt: PetType) =>
    onChange(
      selected.includes(pt)
        ? selected.filter((x) => x !== pt)
        : [...selected, pt]
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-full text-black dark:text-white">
          <PawPrint className="size-4" /> Pet Type <ChevronDown className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search pet type" />
          <CommandList>
            <CommandEmpty>No pet type found.</CommandEmpty>
            <CommandGroup>
              {ALL_PET_TYPES.map((pt) => (
                <CommandItem
                  key={pt}
                  value={pt}
                  onSelect={() => toggle(pt as PetType)}
                  className="flex items-center justify-between"
                >
                  <span>{pt}</span>
                  {selected.includes(pt) ? (
                    <Check className="size-4" />
                  ) : (
                    <div className="size-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3">
            {selected.map((pt) => (
              <Badge key={pt} className="rounded-full">
                {pt}
                <X
                  className="ml-1 size-3 cursor-pointer"
                  onClick={() => toggle(pt)}
                />
              </Badge>
            ))}
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto h-8"
              onClick={() => onChange([])}
            >
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ---------- More Filters (Fee, Rating, Toggles) ----------
function MoreFiltersDialog({
  state,
  onChange,
}: {
  state: VetFilterState;
  onChange: (patch: Partial<VetFilterState>) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        className="gap-2 rounded-full text-black dark:text-white "
        onClick={() => setOpen(true)}
      >
        <Filter className="size-4" /> Filter
      </Button>

      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Fee */}
          <div>
            <Label className="mb-2 block">Fee (Rp x.000)</Label>
            <Slider
              value={[state.feeRange[0], state.feeRange[1]]}
              min={0}
              max={500}
              step={5}
              onValueChange={(v) => onChange({ feeRange: [v[0], v[1]] as [number, number] })}
            />
            <div className="mt-2 text-sm text-muted-foreground">
              Rp {state.feeRange[0].toLocaleString("id-ID")}k - Rp {state.feeRange[1].toLocaleString("id-ID")}k
            </div>
          </div>

          {/* Rating */}
          <div>
            <Label className="mb-2 block">Minimum Rating</Label>
            <div className="flex flex-wrap gap-2">
              {[undefined, 3, 4, 4.5].map((r, idx) => (
                <Button
                  key={idx}
                  variant={state.minRating === r ? "default" : "outline"}
                  className="gap-1 rounded-full"
                  onClick={() => onChange({ minRating: r as number | undefined })}
                >
                  {r ? (
                    <>
                      <Star className="size-4" /> {r}+
                    </>
                  ) : (
                    "Any"
                  )}
                </Button>
              ))}
            </div>
          </div>

        </div>

        <DialogFooter>
          <Button
            className="text-black dark:text-white"
            variant="ghost"
            onClick={() => {
              onChange({
                feeRange: [50, 250],
                minRating: undefined,
                homecareAble: false,
              });
            }}
          >
            Reset
          </Button>
          <Button onClick={() => setOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Example usage (remove if you integrate elsewhere) ----------
// import VetFilters from "./VetFilters";
// <VetFilters onApply={(f) => console.log(f)} />
