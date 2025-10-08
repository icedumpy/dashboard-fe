import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Checkbox } from "@/shared/components/ui/checkbox";

import type { OptionT } from "@/shared/types/option";
import { isEmpty } from "radash";

interface MultiSelectProps {
  options: OptionT[];
  value?: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  onSearch?: (search: string) => void;
  showSearch?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
  // maxCount = 3,
  showSearch = false,
  //   modalPopover = false,
  //   asChild = false,
  onSearch,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const handleUnselect = React.useCallback(
    (item: string) => {
      onChange((value ?? []).filter((i) => i !== item));
    },
    [onChange, value]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = e.target as HTMLInputElement;
      if (input.value === "") {
        if (e.key === "Backspace") {
          onChange((value ?? []).slice(0, -1));
        }
      }
    },
    [onChange, value]
  );

  const selectables = React.useMemo(
    () => options.filter((option) => !value?.includes(option.value)),
    [options, value]
  );
  const selected = React.useMemo(
    () => options.filter((option) => value?.includes(option.value)).map(item => item.label),
    [options, value]
  );


  return (
    <Popover>
      <PopoverTrigger className="overflow-hidden">
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full min-w-0 justify-between text-left font-normal",
            className
          )}
          onClick={() => setOpen((prev) => !prev)}
          disabled={disabled}
        >
          <div className="flex items-center w-full min-w-0 gap-1 overflow-hidden flex-nowrap">
            {isEmpty(value?.filter(Boolean)) ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <span className="block w-full min-w-0 truncate">
                {selected?.join(", ")}
              </span>
            )}
          </div>
          <ChevronsUpDown className="w-4 h-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          {showSearch && (
            <CommandInput
              placeholder="Search..."
              value={search}
              onValueChange={(value) => {
                setSearch(value);
                onSearch?.(value);
              }}
              onKeyDown={handleKeyDown}
            />
          )}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {selectables?.map((option) => {
                const IconComponent = option.icon;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange([...(value ?? []), option.value]);
                      setSearch("");
                    }}
                  >
                    <Checkbox checked={value?.includes(option.value)} />
                    {IconComponent && (
                      <IconComponent className="w-4 h-4 mr-2 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
              {value?.map((item) => {
                const option = options.find((option) => option.value === item);
                if (!option) return null;
                const IconComponent = option.icon;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      handleUnselect(option.value);
                    }}
                  >
                    <Checkbox checked={value?.includes(option.value)} />
                    {IconComponent && (
                      <IconComponent className="w-4 h-4 mr-2 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
