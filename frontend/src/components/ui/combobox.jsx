"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const historicNames = [
  {
    value: "oppenheimer",
    label: "Oppenheimer",
  },
  {
    value: "ratan.tata",
    label: "Ratan Tata",
  },
  {
    value: "kalpana.chawla",
    label: "Kalpana Chawla",
  },
  {
    value: "anne.frank",
    label: "Anne Frank",
  },
];

export function ComboboxDemo({ onSelect }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? historicNames.find((legend) => legend.value === value)?.label
            : "Select legend..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Legends..." />
          <CommandList>
            <CommandEmpty>No Legends found.</CommandEmpty>
            <CommandGroup>
              {historicNames.map((legend) => (
                <CommandItem
                  key={legend.value}
                  value={legend.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onSelect(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === legend.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {legend.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
